import { FILTER_NAMES, ACTIVE_FILTER } from '../const.js';
import { createElement } from '../utils.js';

const createFilterItem = (filterName, isChecked) => {
	return `<div class="trip-filters__filter">
                  <input id="filter-${filterName}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${filterName}" ${isChecked ? 'checked' : ''}>
                  <label class="trip-filters__filter-label" for="filter-${filterName}">${filterName.toUpperCase()}</label>
                </div>`
}
const filterTemplate = () => {
	const filterItemsTemplate = FILTER_NAMES.map((filter, item) => createFilterItem(filter, item === ACTIVE_FILTER));
	return `<form class="trip-filters" action="#" method="get">
                ${filterItemsTemplate.join('')}
                <button class="visually-hidden" type="submit">Accept filter</button>
              </form>`;
};
export default class FilterMenu {
	constructor() {
		this._element = null;
	}
	getTemplate() {
		return filterTemplate();
	}
	getElement() {
		if (!this._element) {
			this._element = createElement(this.getTemplate());
		}
		return this._element;
	}
	removeElement() {
		this._element = null;
	}
}