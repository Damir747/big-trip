import { TabNames, ACTIVE_TAB_CLASS, DEFAULT_TAB } from '../const.js';
import AbstractView from '../framework/abstract-view.js';

const createTabsItem = (tabName, isActive) => {
	return `<a class="trip-tabs__btn  ${isActive ? ACTIVE_TAB_CLASS : ''}" href="#" for="${tabName}">${tabName}</a>`
}
const tabTemplate = (activeTab) => {
	const tabsItemsTemplate = TabNames.map((item) => createTabsItem(item, item === activeTab));
	return `<div class="trip-controls__navigation">
						<h2 class="visually-hidden">Switch trip view</h2>
						<!-- Меню -->
					<nav class="trip-controls__trip-tabs  trip-tabs">
                ${tabsItemsTemplate.join('')}
              </nav>
				</div>`;
};

class TabView extends AbstractView {
	constructor(activeTab = DEFAULT_TAB) {
		super();
		this._activeTab = activeTab;
		this._tabChangeHandle = this._tabChangeHandle.bind(this);
	}
	getTemplate() {
		return tabTemplate(this._activeTab);
	}

	_tabChangeHandle(evt) {
		this._callback.tabChangeHandle(evt.target.attributes.for.value);
	}
	setTabChangeListener(callback) {
		this._callback.tabChangeHandle = callback;
		this.getElement().addEventListener('click', this._tabChangeHandle);
	}

}

export default TabView;