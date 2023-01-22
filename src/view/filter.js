import AbstractView from '../framework/abstract-view.js';
import { FILTER_NAMES, ACTIVE_FILTER } from '../const.js';
import dayjs from 'dayjs';

const createFilterItem = (filterName, isChecked, points = []) => {
	let pointsFilterLength = 0;
	switch (filterName) {
		case FILTER_NAMES[0]:
			pointsFilterLength = points.length;
			break;
		case FILTER_NAMES[1]:
			pointsFilterLength = points.slice().filter((el) => dayjs(el.start).diff(dayjs()) >= 0).length;
			break;
		case FILTER_NAMES[2]:
			pointsFilterLength = points.slice().filter((el) => dayjs(el.start).diff(dayjs()) < 0).length;
			break;
		default:
			throw new Error('Unknown filterName', filterName);
	}

	return `<div class="trip-filters__filter">
                  <input id="filter-${filterName}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" data-filter-type="${filterName}" value="${filterName}" ${isChecked ? 'checked' : ''}>
                  <label class="trip-filters__filter-label" for="filter-${filterName}">${filterName.toUpperCase()} ${pointsFilterLength}</label>
                </div>`
}
const filterTemplate = (points = []) => {
	const filterItemsTemplate = FILTER_NAMES.map((filter, item) => createFilterItem(filter, item === ACTIVE_FILTER, points));
	return `<div class="trip-controls__filters">
						<h2 class="visually-hidden">Filter events</h2>
						<!-- Фильтры -->
					<form class="trip-filters" action="#" method="get">
                ${filterItemsTemplate.join('')}
                <button class="visually-hidden" type="submit">Accept filter</button>
              </form>
				</div>`;
};
export default class FilterMenuView extends AbstractView {
	constructor(points = []) {
		super();
		this._points = points;
		this._filterTypeChangeHandle = this._filterTypeChangeHandle.bind(this);
	}
	getTemplate() {
		return filterTemplate(this._points);
	}
	_filterTypeChangeHandle(evt) {
		if (evt.target.tagName !== 'LABEL') {
			return;
		}
		this._callback.filterTypeChangeHandle(evt.target.attributes.for.value);
	}
	setFilterClickListener(callback) {
		this._callback.filterTypeChangeHandle = callback;
		console.log(this.getElement());
		this.getElement().addEventListener('click', this._filterTypeChangeHandle);
	}
}
// const changeFilter = (elem) => {
// 	console.log(`Сработал addEventListener для фильтра ${elem.control.value}`);
// }
// const btnFilter = document.querySelectorAll('.trip-filters__filter-label');
// btnFilter.forEach((elem) =>
// 	elem.addEventListener('click', (evt) => {
// 		changeFilter(elem);
// 	})
// );