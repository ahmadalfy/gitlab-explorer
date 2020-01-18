import { html, render } from '../web_modules/lit-html.js';
import Utilities from './utilities.js';
import routes from './routes.js';
import Groups from './groups.js';
import Base from './base-component.js';
// import db from './db.js';

class Members extends Base {
	constructor() {
		super('members');
	}

	static load(groups) {
		return Promise.all(groups.map(group => Groups.loadGroupMembers(group.id)))
	}

	loadEvents(userId) {
		return Utilities.req(`${routes.users}/${userId}/${routes.events}`);
	}

	getEvents(ev, memberId) {
		this.loadEvents(memberId).then(events => {
			console.log(events);
		});
	}

	drawListing(members) {
		const membersTemplates = [];
		for (const member of members) {
			membersTemplates.push(html`
				<tr>
					<td class="listing__avatar"><img src="${member.avatar_url}" alt="${member.name}" /></td>
					<td>${member.name}</td>
					<td class="member-activity"> - </td>
					<td class="listing__actions">
						<button @click=${(ev)=> {this.getEvents(ev, member.id)}}>Load activity</button>
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
						<th>Actions</th>
					</tr>
				</thead>
				<tbody>
					${membersTemplates}
				</tbody>
			</table>
		`;
		render(nodes, document.querySelector('#members-content'));
		this.updateLastModified();
	}
}

export default Members;
