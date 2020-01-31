import { html, render } from '../web_modules/lit-html.js';
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
		};
	}

	static load(groups) {
		return Promise.all(groups.map(group => Groups.loadGroupProjects(group.id)));
	}

	static getProjectsInGroup(groupId) {
		return Utilities.req(`${routes.groups}/${groupId}/${routes.projects}`);
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
					<td class="listing__avatar"><img src="${project.avatar_url || './images/project.svg'}" alt="${project.name}" /></td>
					<td data-key="name">${project.name}</td>
					<td data-key="group" data-value="${group?.id}">${group?.name || '-'}</td>
					<td>${timeAgo.format(Date.parse(project.last_activity_at))}</td>
					<td class="listing__actions">
						<button @click=${()=> {this.showMembers(project.id)}}>Members</button>
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

	checkData() {
		db.projects.with({ group: 'group_id'}).then(projects => {
			this.drawListing(projects);
			this.dataService.data.projects = projects;
			document.querySelector('#projects-count').innerHTML = projects.length;
		});
	}
}

export default Projects;
