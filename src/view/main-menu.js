import { TABS_NAMES, ACTIVE_TABS, ACTIVE_TABS_CLASS } from '../const.js';
import { createElement } from '../utils.js';

const createTabsItem = (tabsName, isActive) => {
	return `<a class="trip-tabs__btn  ${isActive ? ACTIVE_TABS_CLASS : ''}" href="#">${tabsName}</a>`
}
const mainMenuTemplate = () => {
	const tabsItemsTemplate = TABS_NAMES.map((tabs, item) => createTabsItem(tabs, item === ACTIVE_TABS));
	return `<nav class="trip-controls__trip-tabs  trip-tabs">
                ${tabsItemsTemplate.join('')}
              </nav>`;
};

export default class TabsMenu {
	constructor() {
		this._element = null;
	}
	getTemplate() {
		return mainMenuTemplate();
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
