import { html, render } from '../web_modules/lit-html.js';
import Diff2Html from '../web_modules/diff2html/bundles/js/diff2html.min.js';
import Utilities from './utilities.js';
import routes from './routes.js';
import Groups from './groups.js';
import Charts from './charts.js';
import Base from './base-component.js';
import db from './db.js';

class Projects extends Base {
	constructor() {
		super('projects');
		this.filtrationKeys = {
			name: {
				type: 'search',
				column: 'name',
			},
			group: {
				node: 'select',
				type: 'list',
				items: {},
			},
			date: {
				node: 'select',
				type: 'date',
				items: [
					{
						label: 'Last week',
						value: 1000 * 60 * 60 * 24 * 7
					},
					{
						label: '2 weeks ago',
						value: 1000 * 60 * 60 * 24 * 14
					},
					{
						label: 'Last month',
						value: 1000 * 60 * 60 * 24 * 30
					},
				]
			}
		};
	}

	static load(groups) {
		return Promise.all(groups.map(group => Groups.loadGroupProjects(group.id)));
	}

	static getProjectsInGroup(groupId) {
		return Utilities.req(`${routes.groups}/${groupId}/${routes.projects}`);
	}

	loadEvents(projectId) {
		return Utilities.req(`${routes.projects}/${projectId}/${routes.events}`);
	}

	loadCommits(projectId, afterDate) {
		const data = {
			with_stats: true,
			per_page: 500,
			all: true,
			...(afterDate ? { since: afterDate } : {})
		}
		const searchParams = new URLSearchParams(data).toString();
		return Utilities.req(`${routes.projects}/${projectId}/${routes.repository}/${routes.commits}`, searchParams);
	}

	loadCommit(projectId, commitId) {
		return Utilities.req(`${routes.projects}/${projectId}/${routes.repository}/${routes.commits}/${commitId}/diff`);
	}

	drawListing(projects) {
		const projectsTemplates = [];
		for (const project of projects) {
			const group = this.dataService.data.groups.find(group => group.id === project.namespace.id);
			if (group) {
				this.filtrationKeys.group.items[group.id] = group.name;
			}
  			projectsTemplates.push(html`
				<tr>
					<td class="listing__avatar">
						<a href="${project.http_url_to_repo}" target="_blank">
							<img src="${project.avatar_url || './images/project.svg'}" alt="${project.name}" />
						</a>
					</td>
					<td data-key="name">${project.name}</td>
					<td data-key="group" data-value="${group?.id}">${group?.name || '-'}</td>
					<td data-key="date" data-value="${Date.parse(project.last_activity_at)}">${timeAgo.format(Date.parse(project.last_activity_at))}</td>
					<td class="listing__actions">
						<span class="button-group">
							<button @click=${(ev) => {this.displayButtons(ev)}}>Load</button>
							<span class="buttons">
								<button title="Load Activities" @click=${()=> {this.loadProjectActivities(project.id)}}>Activities</button>
								<button title="Load Commits" @click=${() => {this.loadProjectCommits(project.id)}}>Commits</button>
							</span>
						</span>
						<span class="button-group">
							<button @click=${(ev) => {this.displayButtons(ev)}}>Display</button>
							<span class="buttons">
							<button title="Display Activities" @click=${()=> {this.showProjectActivities(project.id, project.name)}}>Activities</button>
							<button title="Display Commits" @click=${()=> {this.showProjectCommits(project.id, project.name)}}>Commits</button>
							</span>
						</span>
						<button @click=${()=> {this.appendToChart(project.id, project.name)}}>+</button>
					</td>
				</tr>
			`);
		}
		const nodes = html`
			<table class="listing">
				<thead>
					<tr>
						<th colspan="2">Name</th>
						<th>Group</th>
						<th>Last Activity</th>
						<th>Actions</th>
					</tr>
				</thead>
				<tbody>
					${projectsTemplates}
				</tbody>
			</table>
		`;
		render(nodes, this.panel.content);
		this.updateLastModified();
		this.prepareFilters();
	}

	displayButtons(ev) {
		const alreadyOpened = document.querySelector('.button-group.is-opened');
		if (alreadyOpened) {
			return;
		}
		ev.stopPropagation();
		const buttonGroup = ev.target.closest('.button-group');
		buttonGroup.classList.add('is-opened');
		document.addEventListener('click', () => {
			document.querySelector('.button-group.is-opened').classList.remove('is-opened')
		}, { once: true });
	}

	async getProjectEvents(projectId) {
		return await db.events
			.where('project_id')
			.equals(projectId)
			.with({ project: 'project_id' });
	}

	async getProjectCommits(projectId) {
		return await db.commits
			.where('project_id')
			.equals(projectId)
			.with({ project: 'project_id' });
	}

	async appendToChart(projectId, projectName) {
		let projectEvents = await this.getProjectEvents(projectId);
		const response = Charts.prepareProjectEvents(projectEvents);
		const { data } = response;
		Charts.addSeries({ data, name: projectName });
	}

	async loadProjectActivities(projectId) {
		const events = await this.loadEvents(projectId);
		events.forEach(event => {
			delete event.author;
			event.creation_day = new Date(event.created_at).setHours(0, 0, 0, 0);
		});
		db.events.bulkPut(events);
	}

	/**
	 * loadProjectCommits get the project commits since the last commit stored in the db.
	 * We the last commit for the project from the database using the last `authored_date`
	 * then request the commits from the API. The result is cleaned from the un-needed keys
	 * to keep the db as small as we can.
	 * @param {Number} projectId
	 */
	async loadProjectCommits(projectId) {
		let commits;
		let afterDate;
		await db.commits
			.where('project_id')
			.equals(projectId)
			.reverse()
			.sortBy('authored_date')
			.then(commits => {
				if (commits.length > 0) {
					afterDate = commits[0].authored_date;
				}
			}
		);
		commits = await this.loadCommits(projectId, afterDate);
		commits.forEach(commit => {
			[
				'created_at',
				'author_email',
				'committed_date',
				'committer_email',
				'committed_date',
				'committer_name',
				'created_at',
				'id',
			].forEach(key => { delete commit[key] });
			commit.project_id = projectId;
			commit.creation_day = new Date(commit.authored_date).setHours(0, 0, 0, 0);
			commit.authored_date = new Date(commit.authored_date);
		});
		db.commits.bulkPut(commits);
	}

	async showProjectActivities(projectId, projectName) {
		let projectEvents = await this.getProjectEvents(projectId);
		const updatedEvents = Charts.prepareProjectEvents(projectEvents);
		const { data } = updatedEvents;
		Charts.drawChart([{ data, name: projectName }], projectName, 'areaspline');
		Charts.prepareChartFilters();
	}

	async showProjectCommits(projectId, projectName) {
		let projectCommits = await this.getProjectCommits(projectId);
		const formattedCommitsSerieses = Charts.prepareProjectCommits(projectCommits);
		Charts.drawChart(formattedCommitsSerieses, projectName, 'area', this.drawDayCommits.bind(this), { projectId });
		Charts.prepareChartFilters();
	}

	async drawDayCommits({ ev, projectId }) {
		const day = ev.point.category;
		const dayBeginning = new Date(new Date(day).setHours(0, 0, 0, 0));
		const dayEnding = new Date(new Date(day).setHours(23,59,59));
		const dayCommits = await db.commits
			.where('authored_date')
			.between(dayBeginning, dayEnding)
			.toArray();
		document.querySelector('#commits-panel').style.display = 'flex';
		console.log(dayCommits);
		const commitsTemplate = [];
		for ( const commit of dayCommits) {
			if (projectId === commit.project_id) {
				commitsTemplate.push(html`
					<tr>
						<td>${commit.short_id}</td>
						<td width="50%" title="${commit.message}">${commit.title}</td>
						<td>${commit.author_name}</td>
						<td>${new Date(commit.authored_date).toTimeString().split(' ')[0]}</td>
						<td class="additions">+${commit.stats.additions}</td>
						<td class="deletions">-${commit.stats.deletions}</td>
						<td>
							<button @click=${() => {this.getCommitDetails(projectId, commit.short_id);}}>Details</button>
						</td>
					</tr>
				`);
			}
		}
		const nodes = html`
		<table class="listing">
			<thead>
				<tr>
					<th rowspan="2">id</th>
					<th rowspan="2">Title</th>
					<th rowspan="2">Author</th>
					<th rowspan="2">Time</th>
					<th colspan="2">Statistics</th>
						<th rowspan="2">Actions</th>
				</tr>
				<tr>
					<th>Additions</th>
					<th>Deletions</th>
				</tr>
			</thead>
			<tbody>
				${commitsTemplate}
			</tbody>
		</table>
	`;
	render(nodes, document.querySelector('#commits-content'));
	}

	async getCommitDetails(projectId, commitId) {
		const commit = await this.loadCommit(projectId, commitId);
		this.constructDiffString(commit);
	}

	constructDiffString(commit) {
		const diffs = [];
		commit.forEach(change => {
			diffs.push(`diff --git a/${change.old_path} b/${change.new_path}`);
			if (change.new_file) {
				diffs.push(`new file mode ${change.b_mode}`);
			}
			diffs.push(change.diff);
		});
		document.querySelector('#diffs-panel').style.display = 'flex';
		document.querySelector('#diffs-content').innerHTML = Diff2Html.html(diffs.join('\n'));
	}

	checkData() {
		db.projects.with({ group: 'group_id'}).then(projects => {
			this.drawListing(projects);
			this.dataService.data.projects = projects;
			document.querySelector('#projects-count').innerHTML = projects.length;
		});
	}
}

export default Projects;
