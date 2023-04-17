import AbstractView from "../framework/abstract-view.js";
import Chart from '../../node_modules/chart.js';
import ChartDataLabels from '../../node_modules/chartjs-plugin-datalabels';
import { getSortedData, arrUniqueTypes } from '../utils/stat.js';
import { ChartMode, BAR_HEIGHT, TYPE_HORIZONTAL_BAR, BACKGROUND_COLOR, HOVER_BACKGROUND_COLOR, ANCHOR_START, ANCHOR_END } from "../const.js";
import { findElement } from '../utils/common.js';
import { humanizeDateDuration } from '../utils/point.js';
import StatView from '../view/stat-view.js';
import { render } from "../view/render.js";
import { replace, remove } from "../framework/render.js";
import { RenderPosition } from '../const.js';

const moneyChart = (moneyCtx, points, types) => {
	console.log(points);
	console.log(points.reduce((s, i) => s + i.price, 0));
	const moneyData = getSortedData(points, types, ChartMode.MONEY);
	return new Chart(moneyCtx, {
		plugins: [ChartDataLabels],
		type: TYPE_HORIZONTAL_BAR,
		data: {
			labels: moneyData.types,	//['TAXI', 'BUS', 'TRAIN', 'SHIP', 'TRANSPORT', 'DRIVE'],
			datasets: [{
				data: moneyData.values,	//[400, 300, 200, 160, 150, 100],
				backgroundColor: BACKGROUND_COLOR,
				hoverBackgroundColor: HOVER_BACKGROUND_COLOR,
				anchor: ANCHOR_START,
				barThickness: 44,
				minBarLength: 50,
			}],
		},
		options: {
			plugins: {
				datalabels: {
					font: {
						size: 13,
					},
					color: '#000000',
					anchor: ANCHOR_END,
					align: 'start',
					formatter: (val) => `€ ${val}`,
				},
			},
			title: {
				display: true,
				text: 'MONEY',
				fontColor: '#000000',
				fontSize: 23,
				position: 'left',
			},
			scales: {
				yAxes: [{
					ticks: {
						fontColor: '#000000',
						padding: 5,
						fontSize: 13,
					},
					gridLines: {
						display: false,
						drawBorder: false,
					},
				}],
				xAxes: [{
					ticks: {
						display: false,
						beginAtZero: true,
					},
					gridLines: {
						display: false,
						drawBorder: false,
					},
				}],
			},
			legend: {
				display: false,
			},
			tooltips: {
				enabled: false,
			},
		},
	});
}
const typeChart = (typeCtx, points, types) => {
	const typeData = getSortedData(points, types, ChartMode.TYPE);
	return new Chart(typeCtx, {
		plugins: [ChartDataLabels],
		type: TYPE_HORIZONTAL_BAR,
		data: {
			labels: typeData.types,	//['TAXI', 'BUS', 'TRAIN', 'SHIP', 'TRANSPORT', 'DRIVE'],
			datasets: [{
				data: typeData.values,	//[4, 3, 2, 1, 1, 1],
				backgroundColor: BACKGROUND_COLOR,
				hoverBackgroundColor: HOVER_BACKGROUND_COLOR,
				anchor: ANCHOR_START,
				barThickness: 44,
				minBarLength: 50,
			}],
		},
		options: {
			plugins: {
				datalabels: {
					font: {
						size: 13,
					},
					color: '#000000',
					anchor: ANCHOR_END,
					align: 'start',
					formatter: (val) => `${val}x`,
				},
			},
			title: {
				display: true,
				text: 'TYPE',
				fontColor: '#000000',
				fontSize: 23,
				position: 'left',
			},
			scales: {
				yAxes: [{
					ticks: {
						fontColor: '#000000',
						padding: 5,
						fontSize: 13,
					},
					gridLines: {
						display: false,
						drawBorder: false,
					},
				}],
				xAxes: [{
					ticks: {
						display: false,
						beginAtZero: true,
					},
					gridLines: {
						display: false,
						drawBorder: false,
					},
				}],
			},
			legend: {
				display: false,
			},
			tooltips: {
				enabled: false,
			},
		},
	});
}

const timeChart = (timeCtx, points, types) => {
	const timeData = getSortedData(points, types, ChartMode.TIME);
	return new Chart(timeCtx, {
		plugins: [ChartDataLabels],
		type: TYPE_HORIZONTAL_BAR,
		data: {
			labels: timeData.types,	//['TAXI', 'BUS', 'TRAIN', 'SHIP', 'TRANSPORT', 'DRIVE'],
			datasets: [{
				data: timeData.values,	//
				backgroundColor: BACKGROUND_COLOR,
				hoverBackgroundColor: HOVER_BACKGROUND_COLOR,
				anchor: ANCHOR_START,
				barThickness: 44,
				minBarLength: 50,
			}],
		},
		options: {
			plugins: {
				datalabels: {
					font: {
						size: 13,
					},
					color: '#000000',
					anchor: ANCHOR_END,
					align: 'start',
					formatter: (val) => `${humanizeDateDuration(val)}`,
				},
			},
			title: {
				display: true,
				text: 'TYPE',
				fontColor: '#000000',
				fontSize: 23,
				position: 'left',
			},
			scales: {
				yAxes: [{
					ticks: {
						fontColor: '#000000',
						padding: 5,
						fontSize: 13,
					},
					gridLines: {
						display: false,
						drawBorder: false,
					},
				}],
				xAxes: [{
					ticks: {
						display: false,
						beginAtZero: true,
					},
					gridLines: {
						display: false,
						drawBorder: false,
					},
				}],
			},
			legend: {
				display: false,
			},
			tooltips: {
				enabled: false,
			},
		},
	});
}

export default class StatPresenter extends AbstractView {
	constructor(statContainer, pointsModel) {
		super();
		this._statComponent = null;
		this._statContainer = statContainer;
		this._pointsModel = pointsModel;
		// this._points = this._pointsModel.getPoints();
		this._moneyChart = null;
		this._typeChart = null;
		this._timeChart = null;
		this._refreshCharts = this._refreshCharts.bind(this);
		this._pointsModel.addObserver(this._refreshCharts);
	}
	init() {
		this._statComponent = new StatView(this._pointsModel);
		render(this._statContainer, this._statComponent, RenderPosition.BEFOREEND);
	}
	getStatView() {
		return this._statComponent;
	}
	_refreshCharts() {
		this.init();
	}
}
