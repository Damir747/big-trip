import { TABS_NAMES, ACTIVE_TABS, ACTIVE_TABS_CLASS } from '../const.js';
import AbstractView from '../framework/abstract-view.js';

const createTabsItem = (tabsName, isActive) => {
	return `<a class="trip-tabs__btn  ${isActive ? ACTIVE_TABS_CLASS : ''}" href="#">${tabsName}</a>`
}
const mainMenuTemplate = () => {
	const tabsItemsTemplate = TABS_NAMES.map((tabs, item) => createTabsItem(tabs, item === ACTIVE_TABS));
	return `<div class="trip-controls__navigation">
						<h2 class="visually-hidden">Switch trip view</h2>
						<!-- Меню -->
					<nav class="trip-controls__trip-tabs  trip-tabs">
                ${tabsItemsTemplate.join('')}
              </nav>
				</div>`;
};

export default class TabsMenuView extends AbstractView {
	getTemplate() {
		return mainMenuTemplate();
	}
}
