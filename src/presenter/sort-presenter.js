import { UpdateType } from "../const.js";
import AbstractView from "../framework/abstract-view.js";
import SortMenuView from '../view/sort-view.js';
import { render } from "../view/render.js";
import { remove, replace } from '../framework/render.js';
import { RenderPosition, DEFAULT_SORT } from '../const.js';

export default class SortPresenter extends AbstractView {
	constructor(sortContainer, filterModel, sortModel, tabModel) {
		super();
		this._sortComponent = null;
		this._sortContainer = sortContainer;
		this._sortModel = sortModel;
		this._filterModel = filterModel;
		this._tabModel = tabModel;

		this._handleModelEvent = this._handleModelEvent.bind(this);
		this._handleSortTypeChange = this._handleSortTypeChange.bind(this);

		this._filterModel.addObserver(this._handleModelEvent);	// при переключении фильтров должна сбрасываться сортировка.
		this._tabModel.addObserver(this._handleModelEvent);		// при переключении на экран статистики и обратно сбрасывается выбранная сортировка.
	}
	init(points) {
		const previousSortComponent = this._sortComponent;

		this._points = points;
		this._sortModel.setDefaultUpSort(true);
		this._sortModel.setActiveSort(UpdateType.FULL, DEFAULT_SORT);
		this._sortComponent = new SortMenuView(DEFAULT_SORT, this._points);
		this._sortComponent.setSortClickListener(this._handleSortTypeChange);

		if (previousSortComponent === null) {
			render(this._sortContainer, this._sortComponent, RenderPosition.AFTERBEGIN);
			return;
		}
		replace(this._sortComponent, previousSortComponent);
		remove(previousSortComponent);
	}

	_handleModelEvent() {
		this.init();
	}

	_handleSortTypeChange(sortType) {
		if (this._sortModel.getActiveSort() === sortType) {
			this._sortModel.changeUpSort();		// изменение направления сортировки
		}
		else {
			this._sortModel.setDefaultUpSort();
		}
		this._sortModel.setActiveSort(UpdateType.FULL, sortType);
	}
}