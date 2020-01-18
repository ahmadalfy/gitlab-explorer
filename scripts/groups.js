import { html, render } from '../web_modules/lit-html.js';
import Utilities from './utilities.js';
import routes from './routes.js'
import DataSource from './data-handler.js';
import Base from './base-component.js';
import db from './db.js';

class Groups extends Base {
	constructor() {
		super('groups');
	}

	static load() {
		return Utilities.req(routes.groups);
	}

	// static loadGroupMembers(groupId) {
	// 	return Utilities.req(`${routes.groups}/${groupId}/${routes.members}`);
	// }

	static loadGroupProjects(groupId) {
		return Utilities.req(`${routes.groups}/${groupId}/${routes.projects}`);
	}

	drawListing(groups) {
		const groupsTemplates = [];
		for (const group of groups) {
			groupsTemplates.push(html`
				<tr>
					<td class="listing__avatar"><img src="${group.avatar_url || './images/group.svg'}" alt="${group.name}" /></td>
					<td>${group.name}</td>
					<td class="listing__actions">
						<button @click=${()=> {this.showProjects(group.id)}}>Projects</button>
						<button @click=${()=> {this.showMembers(group.id)}}>Members</button>
					</td>
				</tr>
			`);
		}
		const nodes = html`
			<table class="listing">
				<thead>
					<tr>
						<th colspan="2">Name</th>
						<th>Actions</th>
					</tr>
				</thead>
				<tbody>
					${groupsTemplates}
				</tbody>
			</table>
		`;
		render(nodes, document.querySelector('#groups-content'));
		this.updateLastModified();
	}
}

export default Groups;
