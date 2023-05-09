import { DEFAULT_TAB, UpdateType } from "../const.js";
import AbstractView from "../framework/abstract-view.js";
import TabView from "../view/tab-view.js";
import { render } from "../view/render.js";
import { remove, replace } from '../framework/render.js';
import { RenderPosition } from '../const.js';

export default class TabPresenter extends AbstractView {
	constructor(tabContainer, statContainer, tabModel, pointsModel, tripPresenter, statPresenter) {
		super();
		this._tabComponent = null;
		this._tabContainer = tabContainer;

		this._handleTabChange = this._handleTabChange.bind(this);
		this._handleModelEvent = this._handleModelEvent.bind(this);

		this._statComponent = null;
		this._statContainer = statContainer;
		this._pointsModel = pointsModel;
		this._tabModel = tabModel;
		this._tripPresenter = tripPresenter;
		this._statPresenter = statPresenter;

		this._moneyChart = null;
		this._typeChart = null;
		this._timeChart = null;
		this._tabModel.addObserver(this._handleModelEvent);	// при изменении данных табуляции обновить переключение таба
	}

	init() {
		const previousTabComponent = this._tabComponent;
		this._tabComponent = new TabView(this._tabModel.getActiveTab());
		this._tabComponent.setTabChangeListener(this._handleTabChange);

		if (this._tabModel.getActiveTab() === DEFAULT_TAB) {
			this._tripPresenter.show();
			this._statPresenter.hide();
		}
		else {
			this._tripPresenter.hide();
			this._statPresenter.show();
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