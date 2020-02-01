import { html, render } from '../web_modules/lit-html.js';
import Highcharts from '../web_modules/highcharts.js';
import Utilities from './utilities.js';
import routes from './routes.js';
import Groups from './groups.js';
import Base from './base-component.js';
import db from './db.js';

class Projects extends Base {
	constructor() {
		super('projects');
		this.filtrationKeys = {
			name: {
				type: 'search',
				column: 'name',
			},
			group: {
				node: 'select',
				type: 'list',
				items: {},
			},
			date: {
				node: 'select',
				type: 'date',
				items: [
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
				]
			}
		};
	}

	static load(groups) {
		return Promise.all(groups.map(group => Groups.loadGroupProjects(group.id)));
	}

	static getProjectsInGroup(groupId) {
		return Utilities.req(`${routes.groups}/${groupId}/${routes.projects}`);
	}

	loadEvents(projectId) {
		return Utilities.req(`${routes.projects}/${projectId}/${routes.events}`);
	}

	drawListing(projects) {
		const projectsTemplates = [];
		for (const project of projects) {
			const group = this.dataService.data.groups.find(group => group.id === project.namespace.id);
			if (group) {
				this.filtrationKeys.group.items[group.id] = group.name;
			}
  			projectsTemplates.push(html`
				<tr>
					<td class="listing__avatar">
						<a href="${project.http_url_to_repo}" target="_blank">
							<img src="${project.avatar_url || './images/project.svg'}" alt="${project.name}" />
						</a>
					</td>
					<td data-key="name">${project.name}</td>
					<td data-key="group" data-value="${group?.id}">${group?.name || '-'}</td>
					<td data-key="date" data-value="${Date.parse(project.last_activity_at)}">${timeAgo.format(Date.parse(project.last_activity_at))}</td>
					<td class="listing__actions">
						<button @click=${()=> {this.showProjectActivities(project.id, project.name)}}>Show Activity</button>
					</td>
				</tr>
			`);
		}
		const nodes = html`
			<table class="listing">
				<thead>
					<tr>
						<th colspan="2">Name</th>
						<th>Group</th>
						<th>Last Activity</th>
						<th>Actions</th>
					</tr>
				</thead>
				<tbody>
					${projectsTemplates}
				</tbody>
			</table>
		`;
		render(nodes, this.panel.content);
		this.updateLastModified();
		this.prepareFilters();
	}

	async getProjectEvents(projectId) {
		return await db.events
			.where('project_id')
			.equals(projectId)
			.with({ project: 'project_id' });
	}

	async prepareProjectData(projectId) {
		let projectEvents = await this.getProjectEvents(projectId);

		const groupedEvents = projectEvents.reduce((acc, obj)=> {
			let key = obj.creation_day
			if (!acc[key]) {
				acc[key] = []
			}
				acc[key].push(obj)
			return acc
		}, {});

		const formattedData = [];
		for (let date in groupedEvents) {
			formattedData.push([JSON.parse(date), groupedEvents[date].length]);
		}

		const today = new Date().setHours(0, 0, 0, 0);
		if (!groupedEvents[today]) {
			formattedData.push([today, 0]);
		}

		return { data: formattedData.reverse(), groupedEvents };
	}

	async showProjectActivities(projectId, projectName) {
		const events = await this.loadEvents(projectId);
		events.forEach(event => {
			delete event.author;
			event.creation_day = new Date(event.created_at).setHours(0, 0, 0, 0);
		});
		db.events.bulkPut(events);
		const updatedEvents = await this.prepareProjectData(projectId);
		const { data } = updatedEvents;
		console.log(data);
		this.drawChart(data, projectName);
	}

	drawChart(data, name) {
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

	checkData() {
		db.projects.with({ group: 'group_id'}).then(projects => {
			this.drawListing(projects);
			this.dataService.data.projects = projects;
			document.querySelector('#projects-count').innerHTML = projects.length;
		});
	}
}

export default Projects;
