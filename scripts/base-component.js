import Utilities from './utilities.js';
import routes from './routes.js'
import DataSource from './data-handler.js';
import db from './db.js';

class Base {
	constructor(component) {
		this.component = component;
		this.checkData();
		this.bindEvents();
	}

	bindEvents() {
		document.querySelector(`#load-${this.component}`).addEventListener('click', this.fetchItems.bind(this));
	}

	fetchItems() {
		this.data = new DataSource();
		const fetcher = `fetch${this.component.charAt(0).toUpperCase()}${this.component.substring(1)}`
		this.data[fetcher]().then(data => {
			this.drawListing(data);
		});
	}

	drawListing(content) {}

	checkData() {
		db[this.component].toArray().then(content => {
			this.drawListing(content);
			// can get count using count()
			document.querySelector(`#${this.component}-count`).innerHTML = content.length;
		});
	}

	updateLastModified() {
		const lastModified = localStorage.getItem(this.component);
		console.log(lastModified);
		document.querySelector(`#${this.component}-update`).innerHTML = lastModified ? timeAgo.format(JSON.parse(lastModified)) : 'Not available';
	}
}

export default Base;
