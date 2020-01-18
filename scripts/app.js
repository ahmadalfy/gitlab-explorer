import { html, render } from '../web_modules/lit-html.js';
import TimeAgo from '../web_modules/javascript-time-ago.js'
import en from '../web_modules/javascript-time-ago/locale/en/index.js';
import Groups from './groups.js'
import db from './db.js'

class App {
	constructor() {
		this.registerRelativeTime();
		this.groups = new Groups();
	}

	registerRelativeTime() {
		TimeAgo.addLocale(en)
		window.timeAgo = new TimeAgo('en');
	}
}

new App();
