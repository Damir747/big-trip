import AbstractView from '../framework/abstract-view.js';
import { CUT_FILTER_NAME, FILTER_NAMES } from '../const.js';
import { filterCount } from '../utils/filter.js';

const createFilterItem = (filterName, isChecked, points) => {
	const count = filterCount(points, filterName);
	return `<div class="trip-filters__filter">
                  <input id="filter-${filterName}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" data-filter-type="${filterName}" value="${filterName}" ${isChecked ? 'checked' : ''} ${count > 0 ? '' : 'disabled'}>
                  <label class="trip-filters__filter-label" for="filter-${filterName}">${filterName.toUpperCase()} ${count}</label>
                </div>`
}
const filterTemplate = (activeFilter, points) => {
	const filterItemsTemplate = Object.values(FILTER_NAMES).map((filter) => createFilterItem(filter, filter === activeFilter, points));
	return `<div class="trip-controls__filters">
						<h2 class="visually-hidden">Filter events</h2>
						<!-- Фильтры -->
					<form class="trip-filters" action="#" method="get">
                ${filterItemsTemplate.join('')}
                <button class="visually-hidden" type="submit">Accept filter</button>
              </form>
				</div>`;
};
export default class FilterView extends AbstractView {
	constructor(activeFilter, points) {
		super();
		this._activeFilter = activeFilter;
		this._points = points;
		this._filterTypeChangeHandle = this._filterTypeChangeHandle.bind(this);
	}
	getTemplate() {
		return filterTemplate(this._activeFilter, this._points);
	}

	_filterTypeChangeHandle(evt) {
		if (evt.target.tagName !== 'LABEL') {
			return;
		}
		const filterType = evt.target.attributes.for.value.replace(CUT_FILTER_NAME, '');
		this._callback.filterTypeChangeHandle(filterType);
	}
	setFilterClickListener(callback) {
		this._callback.filterTypeChangeHandle = callback;
		this.getElement().addEventListener('click', this._filterTypeChangeHandle);
	}
}
