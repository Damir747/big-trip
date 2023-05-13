import { DateFormat } from '../const.js';
import { humanizeDate } from '../utils/common.js';
import AbstractView from '../framework/abstract-view.js';

const wayInfo = (points) => {
	if (points.length === 0) {
		return '';
	}
	let way = points[0].city;
	if (points.length <= 3) {
		for (let i = 1; i < points.length; i++) {
			way += ' &mdash; ' + points[i].city;
		}
	}
	else {
		way += ' &mdash; ' + '...' + ' &mdash; ' + points[points.length - 1].city;
	}
	return way;
}
const tripInfoTemplate = (points) => {
	let cost = 0;
	let minDate = Infinity;
	let maxDate = 0;
	points.forEach(element => {
		let sum = element.checkedOffers === undefined ? 0 : element.checkedOffers.reduce((sum, currentObj) => sum += currentObj.checked ? currentObj.price : 0, 0);
		cost += element.price + sum;
		if (element.start < minDate) {
			minDate = element.start;
		}
		if (element.end > maxDate) {
			maxDate = element.end;
		}
	});

	return `<section class="trip-main__trip-info  trip-info">
				<div class="trip-info__main">
              <h1 class="trip-info__title">${wayInfo(points)}</h1>

              <p class="trip-info__dates">${humanizeDate(minDate, DateFormat.FORMAT_SHORT_DATE)}&nbsp;&mdash;&nbsp;${humanizeDate(maxDate, DateFormat.FORMAT_SHORT_DATE)}</p>
            </div>

            <p class="trip-info__cost">
              Total: &euro;&nbsp;<span class="trip-info__cost-value">${cost}</span>
            </p>
				</section>`;
};

export default class TripInfo extends AbstractView {
	constructor(points = []) {
		super();
		this._points = points;
	}
	getTemplate() {
		return tripInfoTemplate(this._points);
	}
}