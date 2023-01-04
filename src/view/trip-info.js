import { DateFormat } from '../const.js';
import { humanizeDate } from '../utils';
import AbstractView from '../framework/abstract-view.js';

const tripInfoTemplate = (points) => {
	let way = '';
	let cost = 0;
	let minDate = Infinity;
	let maxDate = 0;
	points.forEach(element => {
		if (way === '') {
			way += element.city;
		}
		else {
			way += ' &mdash; ' + element.city;
		}
		let sum = element.checkedOffer.reduce((sum, currentObj) => sum += currentObj.price, 0);
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
              <h1 class="trip-info__title">${way}</h1>

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