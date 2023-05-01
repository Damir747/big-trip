import AbstractView from "../framework/abstract-view.js";
import StatView from '../view/stat-view.js';
import { render } from "../view/render.js";
import { replace, remove } from "../framework/render.js";
import { RenderPosition } from '../const.js';

export default class StatPresenter extends AbstractView {
	constructor(statContainer, pointsModel) {
		super();
		this._statComponent = null;
		this._statContainer = statContainer;
		this._pointsModel = pointsModel;
		this._moneyChart = null;
		this._typeChart = null;
		this._timeChart = null;
		this._refreshCharts = this._refreshCharts.bind(this);
		this._pointsModel.addObserver(this._refreshCharts);		// при обновлении данных - обновить график
	}
	init() {
		const previousStatComponent = this._statComponent;
		this._statComponent = new StatView(this._pointsModel);
		this._statComponent.init();

		if (previousStatComponent === null) {
			render(this._statContainer, this._statComponent, RenderPosition.BEFOREEND);
			return;
		}
		replace(this._statComponent, previousStatComponent);
		remove(previousStatComponent);
	}
	getStatView() {
		return this._statComponent;
	}
	show() {
		this._statComponent.show();
	}

	hide() {
		this._statComponent.hide();
	}

	_refreshCharts() {
		this.init();
	}
}
