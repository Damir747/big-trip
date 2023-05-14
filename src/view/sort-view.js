import AbstractView from '../framework/abstract-view.js';
import { SORT_NAMES } from '../const.js';

const createSortItem = (sortName, isDisabled, isChecked, upSort) => {
	return `<div class="trip-sort__item  trip-sort__item--${sortName}">
              <input id="sort-${sortName}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" data-sort-type="${sortName}" value="sort-${sortName}" ${isChecked ? 'checked' : ''} ${isDisabled ? 'disabled' : ''}>
              <label class="trip-sort__btn ${upSort ? 'trip-sort__bottom' : 'trip-sort__top'}" for="sort-${sortName}">${sortName}</label>
            </div>
`;
}
const sortTemplate = (activeSort, upSort) => {
	const sortItemsTemplate = SORT_NAMES.map((sort, item) => createSortItem(sort.value, sort.disabled, sort.value === activeSort, upSort));
	return `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
                ${sortItemsTemplate.join('')}
                </form>`;
};

export default class SortMenuView extends AbstractView {
	constructor(activeSort, upSort) {
		super();
		this._activeSort = activeSort;
		this._upSort = upSort;
		this._sortTypeChangeHandler = this._sortTypeChangeHandler.bind(this);
	}
	getTemplate() {
		return sortTemplate(this._activeSort, this._upSort);
	}
	_sortTypeChangeHandler(evt) {
		if (evt.target.tagName !== 'INPUT') {
			return;
		}
		this._callback.sortTypeChangeHandler(evt.target.dataset.sortType);
	}
	setSortClickListener(callback) {
		this._callback.sortTypeChangeHandler = callback;
		this.getElement().addEventListener('click', this._sortTypeChangeHandler);
	}
}
