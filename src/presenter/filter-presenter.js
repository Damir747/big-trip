import { FILTER_NAMES, ACTIVE_FILTER, UpdateType } from "../const.js";
import AbstractView from "../framework/abstract-view.js";
import FilterView from "../view/filter-view.js";
import { render } from "../view/render.js";
import { remove, replace } from '../framework/render.js';
import { markup } from "../data.js";

export default class FilterPresenter extends AbstractView {
	constructor(filterContainer, filterModel, pointsModel) {
		super();
		this._filterComponent = null;

		this._filterContainer = filterContainer;
		this._filterModel = filterModel;
		this._pointsModel = pointsModel;
		this._activeFilter = ACTIVE_FILTER;

		this._handleModelEvent = this._handleModelEvent.bind(this);
		this._handleFilterTypeChange = this._handleFilterTypeChange.bind(this);

		this._filterModel.addObserver(this._handleModelEvent);
		this._pointsModel.addObserver(this._handleModelEvent);
	}
	init() {
		const previousFilterComponent = this._filterComponent;

		this._filterComponent = new FilterView(FILTER_NAMES, this._filterModel.getActiveFilter(), this._pointsModel.getPoints());
		this._filterComponent.setFilterClickListener(this._handleFilterTypeChange);

		if (previousFilterComponent === null) {
			render(this._filterContainer, this._filterComponent, markup[2].position);
			return;
		}
		replace(this._filterComponent, previousFilterComponent);
		remove(previousFilterComponent);
	}

	_handleModelEvent() {
		this.init();
	}
	_handleFilterTypeChange(filterType) {
		if (this._filterModel.getActiveFilter() === filterType) {
			return;
		}
		this._filterModel.setActiveFilter(UpdateType.FULL, filterType);
	}
}