import AbstractView from '../framework/abstract-view.js';
import Chart from '../../node_modules/chart.js';
import ChartDataLabels from '../../node_modules/chartjs-plugin-datalabels';
import { getSortedData } from '../utils/stat.js';
import { ChartMode, BAR_HEIGHT, TYPE_HORIZONTAL_BAR, BACKGROUND_COLOR, HOVER_BACKGROUND_COLOR, ANCHOR_START, ANCHOR_END } from '../const.js';
import { findElement } from '../utils/common.js';
import dayjs from 'dayjs';

const moneyChart = (moneyCtx, points, types) => {
	const moneyData = getSortedData(points, types, ChartMode.MONEY);
	return new Chart(moneyCtx, {
		plugins: [ChartDataLabels],
		type: TYPE_HORIZONTAL_BAR,
		data: {
			labels: moneyData.types,
			datasets: [{
				data: moneyData.values,
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

const TimeFormat = {
	HOUR_PER_DAY: 1440,
	MINUTE_PER_HOUR: 60,
	MILLISECOND_PER_MINUTE: 60000,
};
const DAYS_COUNT = 10;

const humanizeDateDuration = (tripTime) => {
	const duration = dayjs.duration(tripTime).$d;

	const day = duration.days < DAYS_COUNT ? `0${duration.days}D` : `${duration.days}D`;
	const hour = duration.hours < DAYS_COUNT ? `0${duration.hours}H` : `${duration.hours}H`;
	const minute = duration.minutes < DAYS_COUNT ? `0${duration.minutes}M` : `${duration.minutes}M`;
	const total = (tripTime / TimeFormat.MILLISECOND_PER_MINUTE) > TimeFormat.HOUR_PER_DAY ? `${day} ${hour} ${minute}` : (tripTime / TimeFormat.MILLISECOND_PER_MINUTE) > TimeFormat.MINUTE_PER_HOUR ? `${hour} ${minute}` : minute;
	return total;
};

const statTemplate = () => {
	return `<section class='statistics'>
          <h2 class='visually-hidden'>Trip statistics</h2>

          <div class='statistics__item'>
            <canvas class='statistics__chart--money' id='money' width='900'></canvas>
          </div>

          <div class='statistics__item'>
            <canvas class='statistics__chart--type' id='type' width='900'></canvas>
          </div>

          <div class='statistics__item'>
            <canvas class='statistics__chart--time' id='time-spend' width='900'></canvas>
          </div>
        </section>`;
}

class StatView extends AbstractView {
	constructor(pointsModel) {
		super();

		this._pointsModel = pointsModel;
		this._points = this._pointsModel.getPoints();
		this._moneyChart = null;
		this._typeChart = null;
		this._timeChart = null;

		this._setChart = this._setChart.bind(this);
		this._pointsModel.addObserver(this._setChart);	// При изменении точек обновляет цифры в статистике

	}
	init() {
		this._setChart();
		this.hide();		// по умолчанию скрыто. Поэтому при каждой инициализации скрывать.
	}
	getTemplate() {
		return statTemplate();
	}
	removeElement() {
		super.removeElement();
		this._resetCharts();
	}
	_resetCharts() {
		if (this._moneyChart !== null || this._typeChart !== null || this._timeChart !== null) {
			this._moneyChart = null;
			this._typeChart = null;
			this._timeChart = null;
		}
	}
	_setChart() {
		this._resetCharts();
		const moneyCtx = findElement(this.getElement(), '.statistics__chart--money');
		const typeCtx = findElement(this.getElement(), '.statistics__chart--type');
		const timeCtx = findElement(this.getElement(), '.statistics__chart--time');

		const uniqueTypes = uniqueTypes(this._points);
		this._moneyChart = moneyChart(moneyCtx, this._points, uniqueTypes);
		this._typeChart = typeChart(typeCtx, this._points, uniqueTypes);
		this._timeChart = timeChart(timeCtx, this._points, uniqueTypes);

		// Расчет высоты канваса в зависимости от того, сколько данных в него будет передаваться
		moneyCtx.height = BAR_HEIGHT * 5;
		typeCtx.height = BAR_HEIGHT * 5;
		timeCtx.height = BAR_HEIGHT * 5;
	}

	setStatClickListener(callback) {
		this._callback.setChart = callback;
		this.getElement().addEventListener('click', this._setChart);
	}

}

export default StatView;