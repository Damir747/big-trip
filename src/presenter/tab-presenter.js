import { DEFAULT_TAB, UpdateType } from "../const.js";
import AbstractView from "../framework/abstract-view.js";
import TabView from "../view/tab-view.js";
import { render } from "../view/render.js";
import { remove, replace } from '../framework/render.js';
import { RenderPosition } from '../const.js';

export default class TabPresenter extends AbstractView {
	constructor(tabContainer, tabModel, tripPresenter) {
		super();
		this._tabComponent = null;
		this._tabContainer = tabContainer;
		this._tabModel = tabModel;
		this._tripPresenter = tripPresenter;

		this._handleTabChange = this._handleTabChange.bind(this);
		this._handleModelEvent = this._handleModelEvent.bind(this);
		this._tabModel.addObserver(this._handleModelEvent);
	}
	init() {
		const previousTabComponent = this._tabComponent;

		this._tabComponent = new TabView(this._tabModel.getActiveTab());
		this._tabComponent.setTabChangeListener(this._handleTabChange);
		if (this._tabModel.getActiveTab() === DEFAULT_TAB) {
			this._tripPresenter.show();
		}
		else {
			this._tripPresenter.hide();
		}

		if (previousTabComponent === null) {
			render(this._tabContainer, this._tabComponent, RenderPosition.AFTERBEGIN);
			return;
		}
		replace(this._tabComponent, previousTabComponent);
		remove(previousTabComponent);
	}
	_handleModelEvent() {
		this.init();
	}
	_handleTabChange(activeTab) {
		if (this._tabModel.getActiveTab() === activeTab) {
			return;
		}
		this._tabModel.setActiveTab(UpdateType.FULL, activeTab);

	}
}