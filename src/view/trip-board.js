import { SORT_NAMES, ACTIVE_SORT } from '../const.js';
import AbstractView from '../framework/abstract-view.js';

const createSortItem = (sortName, isDisabled, isChecked) => {
	return `            <div class="trip-sort__item  trip-sort__item--${sortName}">
              <input id="sort-${sortName}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-${sortName}" ${isChecked ? 'checked' : ''} ${isDisabled ? 'disabled' : ''}>
              <label class="trip-sort__btn" for="sort-${sortName}">${sortName}</label>
            </div>
`;
}
const sortTemplate = () => {
	const sortItemsTemplate = SORT_NAMES.map((sort, item) => createSortItem(sort.value, sort.disabled, item === ACTIVE_SORT));
	return `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
                ${sortItemsTemplate.join('')}
                </form>`;
};
export default class SortMenuView extends AbstractView {
	getTemplate() {
		return sortTemplate();
	}
}
