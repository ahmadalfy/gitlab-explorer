import Utilities from './utilities.js';
import Groups from './groups.js';
import Projects from './projects.js';
import Members from './members.js';
import routes from './routes.js'
import db from './db.js'

class DataSource {

	static instance;

	constructor() {
		if(DataSource.instance){
			return DataSource.instance;
		}
		this.data = { members: [], groups: [], projects: []};
		DataSource.instance = this;
	}

	fetchGroups() {
		return Groups.load().then(groups => {
			this.data.groups = groups;
			db.groups.bulkPut(groups);
			localStorage.setItem('groups', Date.now());
			return groups;
		})
	}

	fetchProjects() {
		return Projects.load(this.data.groups).then(projects => {
			this.data.projects = projects.flat();
			this.data.projects.forEach(project => {
				project.group_id = project.namespace.id;
			});
			db.projects.bulkPut(this.data.projects);
			localStorage.setItem('projects', Date.now());
			return projects;
		})
	}

	fetchData() {
		Groups.load().then(groups => {
			data.groups = groups;
			db.groups.bulkPut(groups);
			const projects = Promise.all(groups.map(group => Groups.loadGroupProjects(group.id)));
			projects.then(projects => {
				db.projects.bulkPut(projects.flat());
			});
			return Promise.all(groups.map(group => Groups.loadGroupMembers(group.id)))
		})
		.then(groupMembers => groupMembers.flat())
		.then(members => {
			const key = 'id';
			const uniqueMembers = [...new Map(members.map(item =>[item[key], item])).values()];
			data.members = uniqueMembers;
			db.members.bulkPut(uniqueMembers);
			const events = Promise.all(uniqueMembers.map(member => Members.loadMemberEvents(member.id)));
			events.then(events => {
				db.events.bulkPut(events.flat());
			});
		})
		.then(events => {
			data.members.forEach((member, i) => {
				data.members[i].events = events[i];
			});
		});
	}
}

export default DataSource;
