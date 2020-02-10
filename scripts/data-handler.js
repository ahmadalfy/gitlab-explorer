import Groups from './groups.js';
import Projects from './projects.js';
import Members from './members.js';
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

	async fetchGroups() {
		const groups = await Groups.load();
		this.data.groups = groups;
		db.groups.bulkPut(groups);
		db.logs.put({
			last_updated: Date.now(),
			id: 'groups'
		});
		return this.data.groups;
	}

	async fetchProjects() {
		const projects = await Projects.load(this.data.groups);
		this.data.projects = projects.flat();
		this.data.projects.forEach(project => {
			project.group_id = project.namespace.id;
		});
		db.projects.bulkPut(this.data.projects);
		db.logs.put({
			last_updated: Date.now(),
			id: 'projects'
		});
		return this.data.projects;
	}

	async fetchMembers() {
		const members = await Members.load(this.data.groups);
		const key = 'id';
		this.data.members = [...new Map(members.flat().map(item => [item[key], item])).values()];
		db.members.bulkPut(this.data.members);
		db.logs.put({
			last_updated: Date.now(),
			id: 'members'
		});
		return this.data.members;
	}
}

export default DataSource;
