import DataSource from './data-handler.js';
import db from './db.js';

class Base {
	constructor(component) {
		this.component = component;
		this.dataService = new DataSource();
		this.checkData();
		this.bindEvents();
	}

	bindEvents() {
		document.querySelector(`#load-${this.component}`).addEventListener('click', this.fetchItems.bind(this));
	}

	fetchItems() {
		const fetcher = `fetch${this.component.charAt(0).toUpperCase()}${this.component.substring(1)}`
		this.dataService[fetcher]().then(data => {
			this.drawListing(data);
		});
	}

	drawListing(content) {
		this.updateLastModified();
	}

	checkData() {
		db[this.component].toArray().then(content => {
			this.drawListing(content);
			this.dataService.data[this.component] = content;
			// can get count using count()
			document.querySelector(`#${this.component}-count`).innerHTML = content.length;
		});
	}

	updateLastModified() {
		const lastModified = localStorage.getItem(this.component);
		document.querySelector(`#${this.component}-update`).innerHTML = lastModified ? timeAgo.format(JSON.parse(lastModified)) : 'Not available';
	}
}

export default Base;
