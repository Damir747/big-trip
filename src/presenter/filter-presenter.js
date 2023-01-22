import { FILTER_NAMES } from "../const.js";
import AbstractView from "../framework/abstract-view.js";
import FilterMenuView from "../view/filter-view.js";
import { render } from "../view/render.js";
import { markup } from "../data.js";

export default class FilterPresenter extends AbstractView {
	constructor(tripContainer) {
		super();
		this._tripContainer = tripContainer;
		this._activeFilter = null;
	}
	init(points) {
		this._activeFilter = FILTER_NAMES[0];
		this._filterView = new FilterMenuView(points);
		this._handleFilterTypeChange = this._handleFilterTypeChange.bind(this);

		this._filterView.setFilterClickListener();
		this._renderFilter();
	}
	_renderFilter() {
		render(this._tripContainer, this._filterView, markup[2].position);
		this._filterView.setFilterClickListener(this._handleFilterTypeChange);
	}
	_changeFilter() {

	}
	setFilterChangeHandler() {

	}
	_handleFilterTypeChange(filterType) {
		this._filterPoints(filterType);
		this._clearAllPoints();
		this._renderBoard();
	}

}