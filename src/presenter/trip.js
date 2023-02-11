import BoardView from '../view/board.js'
import PointListView from '../view/point-list.js'
import NoPointView from '../view/no-point.js';
import SortMenuView from '../view/sort-view.js';
import TripInfo from '../view/trip-info.js';
import TabsMenuView from '../view/main-menu.js';
import PointPresenter from './point-presenter.js';
import { markup } from '../data.js';
import { POINTS_COUNT, SORT_NAMES, FILTER_NAMES, ACTIVE_FILTER } from '../const.js';
import { render } from '../view/render.js';
import { sortPointDateUp, sortPointDateDown, sortPointTimeUp, sortPointTimeDown, sortPointCostUp, sortPointCostDown } from '../utils/sort.js';
import { UserAction, UpdateType } from '../const.js';
import { utilFilter } from '../utils/filter.js';
import PointNewPresenter from './point-new-presenter.js';
import { remove } from '../framework/render.js';

export default class TripPresenter {
	constructor(tripContainer, tripInfoContainer, tripDetailsContainer, pointsModel, filterModel) {
		this._pointsModel = pointsModel;
		this._filterModel = filterModel;
		this._tripContainer = tripContainer;				// Контейнер для точек маршрута
		this._tripInfoContainer = tripInfoContainer;		// Контейнер для Инфо маршрута
		this._tripDetailsContainer = tripDetailsContainer;	// Контейнер для Фильтр
		this._currentSortType = SORT_NAMES[0].value;		// Начальная сортировка
		this._upSort = true;										// Начальное направление сортировки: по возрастанию 
		this._currentFilterType = ACTIVE_FILTER;			// Начальный фильтр
		this._boardViewComponent = new BoardView();		// сортировка и контент
		this._pointListComponent = new PointListView();	// точки маршрута

		this._sortMenu = new SortMenuView();				// Сортировка
		this._noPoint = new NoPointView();					// Нет точек маршрута

		this._pointPresenter = {};

		this._onPointModeChange = this._onPointModeChange.bind(this);
		this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
		this._handleViewAction = this._handleViewAction.bind(this);
		this._handleModelEvent = this._handleModelEvent.bind(this);

		this._pointsModel.addObserver(this._handleModelEvent);
		this._filterModel.addObserver(this._handleModelEvent);

		this._pointNewPresenter = new PointNewPresenter(this._pointListComponent, this._handleViewAction);
	}
	init() {
		// this._defaultSortPoints = tripPoints.slice();
		// render(findElement(document, markup[0].container), tripInfo.getElement(), markup[0].position);
		// render(this._tripDetailsContainer, this._tripInfo, markup[0].position);
		render(this._tripContainer, this._boardViewComponent, markup[8].position);
		render(this._boardViewComponent, this._pointListComponent, markup[5].position);	//? не надо?
		this._renderBoard();
	}
	getModel() {
		return this._pointsModel;
	}

	_getPoints() {
		const activeFilter = this._filterModel.getActiveFilter();
		const points = this.getModel().getPoints();
		const filteredPoints = utilFilter(points, activeFilter);
		this._upSort = false;
		switch (this._currentSortType) {
			case SORT_NAMES[0].value:
				return filteredPoints.slice().sort(!this._upSort ? sortPointDateUp : sortPointDateDown);
			case SORT_NAMES[1].value:
				return;
			case SORT_NAMES[2].value:
				return filteredPoints.slice().sort(!this._upSort ? sortPointTimeUp : sortPointTimeDown);
			case SORT_NAMES[3].value:
				return filteredPoints.slice().sort(!this._upSort ? sortPointCostUp : sortPointCostDown);
			case SORT_NAMES[4].value:
				return;
			default:
				return filteredPoints;
		}
	}
	_renderTripInfo() {
		this._tripInfo = new TripInfo(this._getPoints());	// Информация - описание поездки
		render(this._tripInfoContainer, this._tripInfo, markup[0].position);
	}
	_renderPoint(point) {
		const pointPresenter = new PointPresenter(this._pointListComponent, this._handleViewAction, this._handleModelEvent);
		pointPresenter.init(point);
		this._pointPresenter[point.id] = pointPresenter;	// Для сохранения ссылки на презентер
	}
	_renderPoints(from, to) {
		this._getPoints().slice(from, to).forEach((tripPoint) => this._renderPoint(tripPoint));
		//? надо переделать на параметр points (вместо from / to) и работу с ним

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
	_renderBoard() {
		if (this._getPoints().length === 0) {
			this._renderNoPoints();
			return;
		}
		this._renderSortMenu();
		this._renderPointList();
		this._renderTripInfo();
		// Теперь, когда _renderBoard рендерит доску не только на старте,
		// но и по ходу работы приложения, нужно заменить
		// константу TASK_COUNT_PER_STEP на свойство _renderedTaskCount,
		// чтобы в случае перерисовки сохранить N-показанных карточек
		// Load More Button
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
		this._onPointModeChange();
		switch (updateType) {
			case UpdateType.FULL:
				this._clearBoard(true);
				this._renderBoard();
				break;
			case UpdateType.POINTS:
				this._clearBoard();
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
		this._clearBoard();
		this._renderBoard();
	}
	_onPointModeChange() {
		this._pointNewPresenter.destroy();
		//? это она сбрасывает все редакторы к просмотру
		Object
			.values(this._pointPresenter)
			.forEach((pointPresenter) => pointPresenter.resetView());
	}
	_clearBoard(resetSort = false) {
		this._pointNewPresenter.destroy();
		Object
			.values(this._pointPresenter)
			.forEach((pointPresenter) => pointPresenter.resetView());
		Object.values(this._pointPresenter).forEach((pointPresenter) => pointPresenter.destroy());
		this._pointPresenter = {};

		remove(this._sortMenu);
		remove(this._tripInfo);
		// remove Empty
		// remove Cost
		if (resetSort) {
			this._currentSortType = SORT_NAMES[0].value;
		}
	}

	_onChangeSort() {

	}
	_renderTripSort() {

	}
	createPoint() {
		this._currentSortType = SORT_NAMES[0].value;
		this._filterModel.setActiveFilter(UpdateType.FULL, ACTIVE_FILTER);
		this._pointNewPresenter.init();
	}
}