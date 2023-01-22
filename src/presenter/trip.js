import BoardView from '../view/board.js'
import PointListView from '../view/point-list.js'
import NoPointView from '../view/no-point.js';
import FilterMenuView from '../view/filter.js';
import SortMenuView from '../view/sort-view.js';
import TripInfo from '../view/trip-info.js';
import TabsMenuView from '../view/main-menu.js';
import PointPresenter from './point-presenter.js';
import PointsModel from '../model/points.js';
import { markup } from '../data.js';
import { POINTS_COUNT, SORT_NAMES, FILTER_NAMES } from '../const.js';
import { render } from '../view/render.js';
import { sortPointDateUp, sortPointDateDown, sortPointTimeUp, sortPointTimeDown, sortPointCostUp, sortPointCostDown } from '../utils/sort.js';
import { UserAction, UpdateType } from '../const.js';

export default class TripPresenter {
	constructor(tripContainer, tripInfoContainer, tripDetailsContainer, pointsModel) {
		this._pointsModel = pointsModel;
		this._tripContainer = tripContainer;				// Контейнер для точек маршрута
		this._tripInfoContainer = tripInfoContainer;		// Контейнер для Инфо маршрута
		this._tripDetailsContainer = tripDetailsContainer;	// Контейнер для Фильтр
		this._currentSortType = SORT_NAMES[0].value;		// Начальная сортировка
		this._upSort = true;										// Начальное направление сортировки: по возрастанию 
		this._currentFilterType = FILTER_NAMES[0];		// Начальный фильтр
		this._boardViewComponent = new BoardView();		// сортировка и контент
		this._pointListComponent = new PointListView();	// точки маршрута

		this._tripInfo = new TripInfo(this._getPoints());						// Информация - описание поездки
		this._filterMenu = new FilterMenuView(this._getPoints());			// Фильтры: Everything, Future, Past
		this._sortMenu = new SortMenuView();				// Сортировка
		this._noPoint = new NoPointView();					// Нет точек маршрута

		this._pointPresenter = {};

		this._onPointModeChange = this._onPointModeChange.bind(this);
		this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
		this._handleFilterTypeChange = this._handleFilterTypeChange.bind(this);
		this._handleViewAction = this._handleViewAction.bind(this);
		this._handleModelEvent = this._handleModelEvent.bind(this);

		this._pointsModel.addObserver(this._handleModelEvent);
	}
	init() {
		// this._defaultSortPoints = tripPoints.slice();
		// this._tripInfo = new TripInfo(tripPoints);	// Информация - описание поездки
		// render(findElement(document, markup[0].container), tripInfo.getElement(), markup[0].position);
		// render(this._tripDetailsContainer, this._tripInfo, markup[0].position);
		render(this._tripContainer, this._boardViewComponent, markup[8].position);
		render(this._boardViewComponent, this._pointListComponent, markup[5].position);	//? не надо?
		this._filterPoints(this._currentFilterType);
		this._renderBoard();
	}
	getModel() {
		return this._pointsModel;
	}

	_getPoints() {
		this._upSort = !this._upSort;
		switch (this._currentSortType) {
			case SORT_NAMES[0].value:
				return this.getModel().getPoints().slice().sort(!this._upSort ? sortPointDateUp : sortPointDateDown);
			case SORT_NAMES[1].value:
				return;
			case SORT_NAMES[2].value:
				return this.getModel().getPoints().slice().sort(!this._upSort ? sortPointTimeUp : sortPointTimeDown);
			case SORT_NAMES[3].value:
				return this.getModel().getPoints().slice().sort(!this._upSort ? sortPointCostUp : sortPointCostDown);
			case SORT_NAMES[4].value:
				return;
			default:
				return this.getModel().getPoints();
		}
	}
	_renderTripInfo() {
		render(this._tripInfoContainer, this._tripInfo, markup[0].position);
	}
	_renderFilter() {
		render(this._tripDetailsContainer, this._filterMenu, markup[2].position);
		this._filterMenu.setFilterClickListener(this._handleFilterTypeChange);
	}
	_renderPoint(point) {
		const pointPresenter = new PointPresenter(this._pointListComponent, this._handleViewAction, this._handleModelEvent);
		pointPresenter.init(point);
		this._pointPresenter[point.id] = pointPresenter;	//?
	}
	_renderPoints(from, to) {
		this._getPoints().slice(from, to).forEach((tripPoint) => this._renderPoint(tripPoint));

	}
	_renderNoPoints() {
		render(this._boardViewComponent, this._noPoint, markup[6].position);
	}
	_renderSortMenu() {
		render(this._boardViewComponent, this._sortMenu, markup[3].position);
		this._sortMenu.setSortClickListener(this._handleSortTypeChange);
	}
	_renderPointList() {
		this._renderPoints(0, Math.min(this._getPoints().length, POINTS_COUNT));
		if (this._getPoints().length > POINTS_COUNT) {
			console.log('Load More Button');
		}
	}
	_filterPoints(filterType) {
		switch (filterType) {
			case FILTER_NAMES[0]:
				this._getPoints();
				break;
			case 'filter-' + FILTER_NAMES[1]:
				// elem => elem.data.dayjs(start).diff(dayjs()) > 0
				console.log('Фильтр Future');
				this._getPoints().filter(elem => !elem.isPast);
				break;
			case 'filter-' + FILTER_NAMES[2]:
				console.log('Фильтр Past');
				this._getPoints().filter(elem => elem.isPast);
				break;
			default:
			// this._tripPoints = this._defaultSortPoints.slice();
			// присвоить сортировку по умолчанию
		}
		this._currentFilterType = filterType;
	}
	_renderBoard() {
		if (this._getPoints().length === 0) {
			this._renderNoPoints();
			return;
		}
		this._renderSortMenu();
		this._renderFilter();
		this._renderPointList();
		this._renderTripInfo();
	}

	_handleViewAction(actionType, updateType, update) {
		switch (actionType) {
			case UserAction.UPDATE_POINT:
				this._pointsModel.updatePoint(updateType, update);
				break;
			case UserAction.ADD_POINT:
				this._pointsModel.addPoint(updateType, update);
				break;
			case UserAction.DELETE_POINT:
				this._pointsModel.deletePoint(updateType, update);
				break;
			default:
				throw new error('UserAction is not found');
		}
	}
	_handleModelEvent(updateType, data) {
		switch (updateType) {
			case UpdateType.FULL:
				this._clearAllPoints(true);
				this._renderBoard();
				break;
			case UpdateType.POINTS:
				this._clearAllPoints();
				this._renderBoard();
				break;
			case UpdateType.PATCH:
				// this._pointPresenter[data.id].init(data);
				break;
			default:
				throw new Error('UpdateType is not found');
		}
	}

	_handleSortTypeChange(sortType) {
		this._upSort = !(this._currentSortType === sortType);
		this._currentSortType = sortType;
		this._clearAllPoints();
		this._renderBoard();
	}
	_handleFilterTypeChange(filterType) {
		this._filterPoints(filterType);
		this._clearAllPoints();
		this._renderBoard();
	}
	_onPointModeChange() {
		// this._pointPresenter.destroy();
		//this._pointPresenter.forEach((pointPresenter) => pointPresenter.resetView());
		Object
			.values(this._pointPresenter)
			.forEach((pointPresenter) => pointPresenter.resetView());
	}
	_clearAllPoints() {
		Object.values(this._pointPresenter).forEach((pointPresenter) => pointPresenter.destroy());
		this._pointPresenter = {};
	}
}