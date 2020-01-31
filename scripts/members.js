import { html, render } from '../web_modules/lit-html.js';
import Highcharts from '../web_modules/highcharts.js';
import Utilities from './utilities.js';
import routes from './routes.js';
import Groups from './groups.js';
import Base from './base-component.js';
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

	async getEvents(ev, memberId) {
		const activityCell = ev.target.closest('tr').querySelector('.member-activity');
		const updateCell = ev.target.closest('tr').querySelector('.last-update');
		const events = await this.loadEvents(memberId)
		if (events.length === 0) {
			db.members.update(memberId, { last_activity: 'NA', last_update: 'NA' });
			activityCell.innerHTML = 'NA';
			updateCell.innerHTML = 'NA';
			return;
		}
		events.forEach(event => {
			event.creation_day = new Date(event.created_at).setHours(0, 0, 0, 0);
		});
		const groupedEvents = events.reduce((acc, obj)=> {
			let key = obj.creation_day
			if (!acc[key]) {
				acc[key] = []
			}
				acc[key].push(obj)
			return acc
		}, {});
		const data = {
			member_id: memberId,
			events: groupedEvents,
		}
		const member = await db.member_events.get({ member_id: memberId });
		if (member) {
			db.member_events.update({ member_id: memberId }, data);
		} else {
			db.member_events.put(data);
		}
		await db.members.update(memberId, {
			last_activity: events[0].created_at,
			last_update: Date.now(),
		});
		activityCell.innerHTML = timeAgo.format(Date.parse(events[0].created_at));
		updateCell.innerHTML = timeAgo.format(Date.now());
		db.events.bulkPut(events);
	}

	async prepaeUserData(memberId) {
		let memberEvents = await db.member_events
			.where('member_id')
			.equals(memberId)
			.with({ member: 'member_id' });
		memberEvents = memberEvents[0];

		const formattedData = [];
		for (let date in memberEvents.events) {
			formattedData.push([JSON.parse(date), memberEvents.events[date].length]);
		}

		const today = new Date().setHours(0, 0, 0, 0);
		if (!memberEvents[today]) {
			formattedData.unshift([today, 0]);
		}

		return { data: formattedData.reverse(), memberEvents };
	}

	drawChart(data, name) {
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
					cursor: 'pointer',
					point: {
						events: {
							click: function () {
								console.log(this.category);
							}
						}
					},
					marker: {
						lineWidth: 1
					}
				}
			},
		});
	}

	async displayEvents(memberId) {
		const response = await this.prepaeUserData(memberId);
		const { data, memberEvents: { member : { name }} } = response;
		this.drawChart(data, name);
	}

	async appendToChart(memberId) {
		const response = await this.prepaeUserData(memberId);
		const { data, memberEvents: { member : { name }} } = response;
		this.chart.addSeries({
			name,
			data,
		});
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
