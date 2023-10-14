import { UpdateType } from "../const.js";
import AbstractView from "../framework/abstract-view.js";
import FilterView from "../view/filter-view.js";
import { render, remove, replace } from '../framework/render.js';
import { RenderPosition } from '../const.js';
import { getFilterCount } from '../utils/filter.js';

class FilterPresenter extends AbstractView {
	constructor(filterContainer, pointsModel, filterModel) {
		super();
		this._filterComponent = null;

		this._filterContainer = filterContainer;
		this._pointsModel = pointsModel;
		this._filterModel = filterModel;

		this._handleModelEvent = this._handleModelEvent.bind(this);
		this._handleFilterTypeChange = this._handleFilterTypeChange.bind(this);

		this._pointsModel.addObserver(this._handleModelEvent);	// При изменении точек обновляет цифры в фильтре
		this._filterModel.addObserver(this._handleModelEvent);	// при попытке создать новую точку вызывается filterModel, как следствие, перерисовывается filterView
	}
	init() {
		const previousFilterComponent = this._filterComponent;

		this._filterComponent = new FilterView(this._filterModel.getActiveFilter(), this._pointsModel.getPoints());
		this._filterComponent.setFilterClickListener(this._handleFilterTypeChange);

		if (previousFilterComponent === null) {
			render(this._filterContainer, this._filterComponent, RenderPosition.BEFOREEND);
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
		if (getFilterCount(this._pointsModel.getPoints(), filterType) === 0) {
			return;
		}
		this._filterModel.setActiveFilter(UpdateType.FULL, filterType);
	}
}

export default FilterPresenter;