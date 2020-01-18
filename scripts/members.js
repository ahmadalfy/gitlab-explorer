import Utilities from './utilities.js';
import routes from './routes.js'

class Members {
	static load() {
		return Utilities.req(routes.members);
	}

	static loadMemberEvents(userId) {
		return Utilities.req(`${routes.users}/${userId}/${routes.events}`);
	}
}

export default Members;
