import { html, render } from '../web_modules/lit-html.js';
import Highcharts from '../web_modules/highcharts.js';

class Charts {

	static prepareMemberEvents(memberEvents) {
		const formattedData = [];
		for (let date in memberEvents.events) {
			formattedData.push([JSON.parse(date), memberEvents.events[date].length]);
		}
		const today = new Date().setHours(0, 0, 0, 0);
		if (!memberEvents.events[today]) {
			formattedData.unshift([today, 0]);
		}
		return { data: formattedData.reverse(), memberEvents };
	}

	static prepareUserDetailedData(memberEvents) {
		const formattedData = [];
		for (let date in memberEvents.events) {
			memberEvents.events[date].forEach(event => {
				const stack = formattedData.find(data => data.name === event.action_name);
				if (!stack) {
					formattedData.push({
						name: event.action_name,
						data: [[ event.creation_day, 1 ]],
						stack: 0,
						type: 'column',
					});
				} else {
					const datedStack = stack.data.find(item => event.creation_day === item[0]);
					if (!datedStack) {
						stack.data.unshift([ event.creation_day, 1 ]);
					} else {
						datedStack[1] += 1;
					}
				}
			});
		}
		return { data: formattedData, memberEvents };
	}

	static drawChart(data, name) {
		this.chart = Highcharts.chart('charts', {
			chart: {
				zoomType: 'x',
			},
			title: {
				text: `Activity of ${name}`
			},
			subtitle: {
				text: `Source: Gitlab Activities`
			},
			xAxis: {
				type: 'datetime',
			},
			series: [{
				name,
				data,
			}],
			plotOptions: {
				series: {
					cursor: 'pointer',
					marker: {
						lineWidth: 1
					}
				},
			},
		});
	}

	static drawDetailedChart(data, name) {
		this.chart = Highcharts.chart('charts', {
			type: 'column',
			chart: {
				zoomType: 'x',
			},
			series: data,
			name: 'Details',
			xAxis: {
				type: 'datetime',
			},
			title: {
				text: `Activity of ${name}`
			},
			subtitle: {
				text: `Source: Gitlab Activities`
			},
			plotOptions: {
				column: {
					stacking: 'normal',
					dataLabels: {
						enabled: true
					}
				}
			}
		});
	}

	static addSeries(data) {
		this.chart.addSeries(data);
	}

	static prepareChartFilters(memberId, memberName, showDetailsCallback) {
		const dates = [
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
		];
		const today = +(new Date());
		const actionList = [];
		for (const date of dates) {
			actionList.push(html`
				<button @click=${() => {
					console.log(this);
					this.chart.xAxis[0].setExtremes((today - date.value), today);
					this.chart.showResetZoom();
				}}>${date.label}</button>
			`);
		}
		actionList.push(html`
			<button @click=${() => { showDetailsCallback(memberId, memberName) }}>Details</button>
		`);
		const buttons = html`${actionList}`;
		render(buttons, document.querySelector('#zoom-options'));
	}
}

export default Charts;
