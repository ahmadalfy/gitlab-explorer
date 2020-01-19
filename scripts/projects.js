import { html, render } from '../web_modules/lit-html.js';
import Utilities from './utilities.js';
import routes from './routes.js';
import Groups from './groups.js';
import Base from './base-component.js';
import db from './db.js';

class Projects extends Base {
	constructor() {
		super('projects');
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
			projectsTemplates.push(html`
				<tr>
					<td class="listing__avatar"><img src="${project.avatar_url || './images/project.svg'}" alt="${project.name}" /></td>
					<td>${project.name}</td>
					<td>${group ? group.name : '-'}</td>
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
		render(nodes, document.querySelector('#projects-content'));
		this.updateLastModified();
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
