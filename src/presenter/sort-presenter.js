import { UpdateType } from '../const.js';
import AbstractView from '../framework/abstract-view.js';
import SortMenuView from '../view/sort-view.js';
import { render, remove, replace } from '../framework/render.js';
import { RenderPosition, DEFAULT_SORT } from '../const.js';

class SortPresenter extends AbstractView {
	constructor(sortContainer, filterModel, sortModel, tabModel) {
		super();
		this._sortComponent = null;
		this._sortContainer = sortContainer;
		this._sortModel = sortModel;
		this._filterModel = filterModel;
		this._tabModel = tabModel;

		this._handleModelEvent = this._handleModelEvent.bind(this);
		this._handleModelEventSort = this._handleModelEventSort.bind(this);
		this._handleSortTypeChange = this._handleSortTypeChange.bind(this);

		this._filterModel.addObserver(this._handleModelEvent);		// при переключении фильтров должна сбрасываться сортировка.
		this._tabModel.addObserver(this._handleModelEvent);			// при переключении на экран статистики и обратно сбрасывается выбранная сортировка.
		this._sortModel.addObserver(this._handleModelEventSort);		// при изменении направления сортировки 
	}

	init() {
		this._sortModel.setDefaultUpSort();										// установка направления сортировки по умолчанию
		this._sortModel.setActiveSort(UpdateType.POINTS, DEFAULT_SORT);	// установка сортировки по умолчанию

		this._handleModelEventSort();
	}

	_handleModelEvent() {
		this.init();
	}

	_handleModelEventSort() {
		const previousSortComponent = this._sortComponent;

		this._sortComponent = new SortMenuView(this._sortModel.getActiveSort(), this._sortModel.getUpSort());
		this._sortComponent.setSortClickListener(this._handleSortTypeChange);

		if (previousSortComponent === null) {
			render(this._sortContainer, this._sortComponent, RenderPosition.AFTERBEGIN);
			return;
		}
		replace(this._sortComponent, previousSortComponent);
		remove(previousSortComponent);
	}

	_handleSortTypeChange(sortType) {
		if (this._sortModel.getActiveSort() === sortType) {	// тот же тип сортировки
			this._sortModel.changeUpSort();							// изменение направления сортировки
		}
		else {
			this._sortModel.setDefaultUpSort();						// установка направления сортировки по умолчанию
		}
		this._sortModel.setActiveSort(UpdateType.POINTS, sortType);
	}
}

export default SortPresenter;