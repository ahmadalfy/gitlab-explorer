import TimeAgo from '../web_modules/javascript-time-ago.js'
import en from '../web_modules/javascript-time-ago/locale/en/index.js';
import DataSource from './data-handler.js';
import Groups from './groups.js'
import Projects from './projects.js'
import Members from './members.js'
import RegisterDbOperations from './db-operations.js';

class App {
	constructor() {
		this.registerRelativeTime();
		this.groups = new Groups();
		this.projects = new Projects();
		this.members = new Members();
		console.log(this.groups);
		new RegisterDbOperations(this.checkData.bind(this));
	}

	registerRelativeTime() {
		TimeAgo.addLocale(en)
		window.timeAgo = new TimeAgo('en');
	}

	checkData() {
		this.groups.checkData();
		this.projects.checkData();
		this.members.checkData();
	}
}

new App();
