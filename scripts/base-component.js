import { html, render } from '../web_modules/lit-html.js';
import DataSource from './data-handler.js';
import Utilities from './utilities.js';
import db from './db.js';

class Base {
	constructor(component) {
		this.component = component;

		this.panel = {
			content: document.querySelector(`#${this.component}-content`),
			actionsList: document.querySelector(`#${this.component}-filters`),
		}
		this.dataService = new DataSource();
		this.searchListing = Utilities.debounce(this.searchListing, 250);
		this.checkData();
		this.bindEvents();
	}

	bindEvents() {
		document.querySelector(`#load-${this.component}`).addEventListener('click', this.fetchItems.bind(this));
		document.addEventListener('click', this.closePanel.bind(this));
	}

	fetchItems() {
		const fetcher = `fetch${this.component.charAt(0).toUpperCase()}${this.component.substring(1)}`
		this.dataService[fetcher]().then(data => {
			this.drawListing(data);
		});
	}

	closePanel(ev) {
		if(ev.target.classList.contains('close-panel')) {
			ev.target.closest('.panel').style.display = 'none';
		}
	}

	drawListing() {
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
		this.filters = [];
		for (const key in this.filtrationKeys) {
			this.filters.push(this.createFilter(key, this.filtrationKeys[key]));
		}
		render(this.filters, this.panel.actionsList);
	}

	createFilter(key, details) {
		let container;
		let optionsTemplate;
		if (details.node === 'select') {
			if (details.type === 'list') {
				const orderedFilter = Object.entries(this.filtrationKeys[key].items).sort(function (a, b) {
					if (a[1].toLowerCase() > b[1].toLowerCase()) {
						return 1;
					}
					if (b[1].toLowerCase() > a[1].toLowerCase()) {
						return -1;
					}
					return 0;
				});
				optionsTemplate = [html`<option value="" selected>All</option>`];
				orderedFilter.forEach( item => {
					optionsTemplate.push(html`
						<option value="${item[0]}">${item[1]}</option>
					`);
				});
			} else if (details.type === 'date') {
				optionsTemplate = [html`<option value="" selected>All</option>`];
				details.items.forEach(item => {
					optionsTemplate.push(html`
						<option value="${item.value}">${item.label}</option>
					`);
				})
			}
			container = html`
				<label for="filter-${this.component}-by-${key}">${key}</label>
				<select id="filter-${this.component}-by-${key}" @change=${(ev)=> {this.updateListing(ev, key, details.type)}}>
					${optionsTemplate}
				</select>
			`;
		} else if (details.type === 'search') {
			container = html`
				<label class="visually-hidden" for="text-search-by-${key}">Search</label>
				<input type="search"
					@keyup=${(ev) => { this.searchListing(ev, details.column) }}
					/* Search event is used to detect clearing of the search input */
					@search=${(ev) => { this.searchListing(ev, details.column) }}
					id="text-search-by-${key}" placeholder="Search" />
			`
		}
		return container;
	}

	searchListing(ev, column) {
		const filter = ev.target.value.toUpperCase();
		const rows = this.panel.content.querySelectorAll('tbody tr');
		rows.forEach(row => {
			const cells = row.querySelectorAll(`td[data-key="${column}"]`);
			cells.forEach(cell => {
				if (cell.innerText.toUpperCase().indexOf(filter) > -1) {
					row.style.display = 'table-row';
				} else {
					row.style.display = 'none';
				}
			});
		});
	}

	updateListing(ev, key, type) {
		let { value } = ev.target;
		let match;
		if (type === 'date' && value !== '') {
			value = +new Date - value;
		}
		const rows = this.panel.content.querySelectorAll('tbody tr');
		rows.forEach(row => {
			if (value === '') {
				row.style.display = 'table-row';
			} else {
				if (type === 'date') {
					match = row.querySelector(`td[data-key=${key}]`)?.dataset.value > value;
				} else {
					match = row.querySelector(`td[data-key=${key}]`)?.dataset.value === value;
				}
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
