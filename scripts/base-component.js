import { html, render } from '../web_modules/lit-html.js';
import DataSource from './data-handler.js';
import db from './db.js';

class Base {
	constructor(component) {
		this.component = component;

		this.panel = {
			content: document.querySelector(`#${this.component}-content`),
			actionsList: document.querySelector(`#${this.component}-filters`),
		}

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
			this.updateCount(content.length);
		});
	}

	updateCount(length) {
		// can get count using count()
		document.querySelector(`#${this.component}-count`).innerHTML = length;
	}

	updateLastModified() {
		const lastModified = localStorage.getItem(this.component);
		document.querySelector(`#${this.component}-update`).innerHTML = lastModified ? timeAgo.format(JSON.parse(lastModified)) : 'Not available';
	}

	prepareFilters() {
		for (const key in this.filtrationKeys) {
			this.drawFilter(key, this.filtrationKeys[key]);
		}
	}

	drawFilter(key, details) {
		let container;
		if (details.node === 'select') {
			const orderedFilter = Object.entries(this.filtrationKeys[key].items).sort(function (a, b) {
				if (a[1].toLowerCase() > b[1].toLowerCase()) {
					return 1;
				}
				if (b[1].toLowerCase() > a[1].toLowerCase()) {
					return -1;
				}
				return 0;
			});
			const optionsTemplate = [html`<option value="" selected>All</option>`];
			orderedFilter.forEach( item => {
				optionsTemplate.push(html`
					<option value="${item[0]}">${item[1]}</option>
				`);
			});

			container = html`
				<label for="filter-${this.component}-by-${key}">${key}</label>
				<select id="filter-${this.component}-by-${key}" @change=${(ev)=> {this.updateListing(ev, key)}}>
					${optionsTemplate}
				</select>
			`;
			render(container, this.panel.actionsList);
		}
	}

	updateListing(ev, key) {
		const { value } = ev.target;
		const rows = this.panel.content.querySelectorAll('tr');
		rows.forEach(row => {
			if (value === '') {
				row.style.display = 'table-row';
			} else {
				const match = row.querySelector(`td[data-key=${key}]`)?.dataset.value === value;
				if (match) {
					row.style.display = 'table-row';
				} else {
					row.style.display = 'none';
				}
			}
		});
	}
}

export default Base;
