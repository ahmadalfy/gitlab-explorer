import { html, render } from '../web_modules/lit-html.js';
import Highcharts from '../web_modules/highcharts.js';
import Utilities from './utilities.js';
import routes from './routes.js';
import Groups from './groups.js';
import Base from './base-component.js';
import Charts from './charts.js';
import db from './db.js';

class Members extends Base {
	constructor() {
		super('members');
		this.filtrationKeys = {
			name: {
				type: 'search',
				column: 'name',
			},
		};
	}

	static load(groups) {
		return Promise.all(groups.map(group => Groups.loadGroupMembers(group.id)))
	}

	loadEvents(userId) {
		return Utilities.req(`${routes.users}/${userId}/${routes.events}`);
	}

	/**
	 * getEvents get the last 100 activity and store then in the database
	 * @param {Event} ev
	 * @param {String} memberId
	 */
	async getEvents(ev, memberId) {
		const activityCell = ev.target.closest('tr').querySelector('.member-activity');
		const updateCell = ev.target.closest('tr').querySelector('.last-update');
		const events = await this.loadEvents(memberId);
		// If the user has no events, update the view and db with 'NA'
		if (events.length === 0) {
			db.members.update(memberId, { last_activity: 'NA', last_update: 'NA' });
			activityCell.innerHTML = 'NA';
			updateCell.innerHTML = 'NA';
			return;
		}
		/**
		 * Loop through the events and add a new key 'creation_day' to be used to group the events
		 * later on to find out how many activity done per day. We set the time to zeros and remove
		 * the author object because it's not necessary.
		 */
		events.forEach(event => {
			delete event.author;
			event.creation_day = new Date(event.created_at).setHours(0, 0, 0, 0);
		});
		/**
		 * Group events by day to facilitate drawing the charts and display the activities
		 */
		const groupedEvents = events.reduce((acc, obj)=> {
			let key = obj.creation_day
			if (!acc[key]) {
				acc[key] = []
			}
				acc[key].push(obj)
			return acc
		}, {});
		/** Get the user's previous data from the 'member_events' table and merge both */
		const member = await db.member_events.get({ member_id: memberId });
		if (member) {
			for (const eventDate in member.events) {
				if (!groupedEvents[eventDate]) {
					// If the event date doesn't exist in the new data, add it to the grouped events
					groupedEvents[eventDate] = member.events[eventDate];
				} else {
					// If the event date exist, check if the event itself existing or not. If not, push it.
					member.events[eventDate].forEach(memberEvent => {
						const foundEvent = groupedEvents[eventDate].find(groupedEvent => groupedEvent.created_at === memberEvent.created_at);
						if (!foundEvent) {
							groupedEvents[eventDate].push(memberEvent);
						}
					})
				}
			}
		}
		const data = {
			member_id: memberId,
			events: groupedEvents,
		}
		/**
		 * If the member exists in the database, update his events. If not, create a
		 * new recorrd for him.
		 */
		if (member) {
			db.member_events.update(member.id, data);
		} else {
			db.member_events.put(data);
		}
		/**
		 * Update the member activity by the last event and last retrival then update the
		 * events table
		 */
		await db.members.update(memberId, {
			last_activity: events[0].created_at,
			last_update: Date.now(),
		});
		activityCell.innerHTML = timeAgo.format(Date.parse(events[0].created_at));
		updateCell.innerHTML = timeAgo.format(Date.now());
		db.events.bulkPut(events);
	}

	async getUserEvents(memberId) {
		const events = await db.member_events
			.where('member_id')
			.equals(memberId)
			.with({ member: 'member_id' });
		return events[0];
	}

	async prepareUserDetailedData(memberId) {
		let memberEvents = await this.getUserEvents(memberId);

		const formattedData = [];

		for (let date in memberEvents.events) {
			memberEvents.events[date].forEach(event => {
				const stack = formattedData.find(data => data.name === event.action_name);
				if (!stack) {
					formattedData.push({
						name: event.action_name,
						data: [[ event.creation_day, 1 ]],
						stack: 0,
						type: 'column',
					});
				} else {
					const datedStack = stack.data.find(item => event.creation_day === item[0]);
					if (!datedStack) {
						stack.data.push([ event.creation_day, 1 ]);
					} else {
						datedStack[1] += 1;
					}
				}
			});
		}

		return { data: formattedData, memberEvents };
	}

	drawChart(data, name, id) {
		const that = this;
		this.chart = Highcharts.chart('charts', {
			chart: {
				zoomType: 'x',
			},
			title: {
				text: `Activity of ${name}`
			},
			subtitle: {
				text: `Source: Gitlab Activities`
			},
			xAxis: {
				type: 'datetime',
			},
			series: [{
				name,
				data,
			}],
			plotOptions: {
				series: {
					stacking: 'normal',
					cursor: 'pointer',
					point: {
						events: {
							click: function () {
								that.getEventsByDate(this.category, id);
							}
						}
					},
					marker: {
						lineWidth: 1
					}
				},
			},
		});
	}

	async getEventsByDate(day, id) {
		const member = await db.member_events.get({ member_id: id });
		console.log(member.events[day]);
	}

	prepareChartFilters(memberId, memberName) {
		const dates = [
			{
				label: 'Last week',
				value: 1000 * 60 * 60 * 24 * 7
			},
			{
				label: '2 weeks ago',
				value: 1000 * 60 * 60 * 24 * 14
			},
			{
				label: 'Last month',
				value: 1000 * 60 * 60 * 24 * 30
			},
		];
		const today = +(new Date());
		const actionList = [];
		for (const date of dates) {
			actionList.push(html`
				<button @click=${() => {
					this.chart.xAxis[0].setExtremes((today - date.value), today);
					this.chart.showResetZoom();
				}}>${date.label}</button>
			`);
		}
		actionList.push(html`
			<button @click=${() => { this.showActivityDetals(memberId, memberName) }}>Details</button>
		`);
		const buttons = html`${actionList}`;
		render(buttons, document.querySelector('#zoom-options'));
	}

	async displayEvents(memberId) {
		let memberEvents = await this.getUserEvents(memberId);
		const response = await Charts.prepareMemberEvents(memberEvents);

		const { data, memberEvents: { member : { name }} } = response;
		this.drawChart(data, name, memberId);
		this.prepareChartFilters(memberId, name);
	}

	async appendToChart(memberId) {
		let memberEvents = await this.getUserEvents(memberId);
		const response = await Charts.prepareMemberEvents(memberEvents);

		const { data, memberEvents: { member : { name }} } = response;
		this.chart.addSeries({
			name,
			data,
		});
	}

	async showActivityDetals(memberId, name) {
		const response = await this.prepareUserDetailedData(memberId);
		const { data } = response;
		this.chart = Highcharts.chart('charts', {
			type: 'column',
			chart: {
				zoomType: 'x',
			},
			series: data,
			name: 'Details',
			xAxis: {
				type: 'datetime',
			},
			title: {
				text: `Activity of ${name}`
			},
			subtitle: {
				text: `Source: Gitlab Activities`
			},
			plotOptions: {
				column: {
					stacking: 'normal',
					dataLabels: {
						enabled: true
					}
				}
			}
		});
		this.appendToChart(memberId);
	}

	drawListing(members) {
		const membersTemplates = [];
		for (const member of members) {
			membersTemplates.push(html`
				<tr>
					<td class="listing__avatar">
						<a target="_blank" href="${member.web_url}">
							<img src="${member.avatar_url}" alt="${member.name}" />
						</a>
					</td>
					<td data-key="name">${member.name}</td>
					<td class="member-activity">
						${member.last_activity && member.last_activity !== 'NA' ?
							timeAgo.format(Date.parse(member.last_activity)) :
							member.last_activity ? member.last_activity : '-'}
					</td>
					<td class="last-update">
					${member.last_update && member.last_update !== 'NA' ?
						timeAgo.format(member.last_update) :
						member.last_update ? member.last_update : '-'}
					</td>
					<td class="listing__actions">
						<button @click=${(ev)=> {this.getEvents(ev, member.id)}}>Load</button>
						<button @click=${()=> {this.displayEvents(member.id)}}>Display</button>
						<button @click=${()=> {this.appendToChart(member.id)}}>+</button>
					</td>
				</tr>
			`);
		}
		const nodes = html`
			<table class="listing">
				<thead>
					<tr>
						<th colspan="2">Name</th>
						<th>Activity</th>
						<th>Last update</th>
						<th>Actions</th>
					</tr>
				</thead>
				<tbody>
					${membersTemplates}
				</tbody>
			</table>
		`;
		render(nodes, document.querySelector('#members-content'));
		this.updateCount(members.length);
		this.updateLastModified();
		this.prepareFilters();
	}
}

export default Members;
