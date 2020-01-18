import { html, render } from '../web_modules/lit-html.js';
import TimeAgo from '../web_modules/javascript-time-ago.js'
import en from '../web_modules/javascript-time-ago/locale/en/index.js';
import DataSource from './data-handler.js';
import Groups from './groups.js'
import Projects from './projects.js'
import Members from './members.js'
import db from './db.js'

class App {
	constructor() {
		this.registerRelativeTime();
		this.groups = new Groups();
		this.projects = new Projects();
		this.Members = new Members();
	}

	registerRelativeTime() {
		TimeAgo.addLocale(en)
		window.timeAgo = new TimeAgo('en');
	}
}

new App();
