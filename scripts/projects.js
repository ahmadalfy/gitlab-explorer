import Utilities from './utilities.js';
import routes from './routes.js'

class Projects {
	static getProjectsInGroup(groupId) {
		return Utilities.req(`${routes.groups}/${groupId}/${routes.projects}`);
	}
}

export default Projects;
