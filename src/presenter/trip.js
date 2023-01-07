import { markup } from '../data.js';
import FilterMenuView from '../view/filter.js';
import TabsMenuView from '../view/main-menu.js';
import SortMenuView from '../view/sort-view.js';
import NoPointView from '../view/no-point.js';
import { POINTS_COUNT, SORT_NAMES, FILTER_NAMES } from '../const.js';
import { render } from '../view/render.js';
import PointListView from '../view/point-list.js'
import BoardView from '../view/board.js'
import { updatePoint } from '../utils/common.js';
import Point from './point-presenter.js';
import { sortPointDateUp, sortPointDateDown, sortPointTimeUp, sortPointTimeDown, sortPointCostUp, sortPointCostDown } from '../utils/sort.js';
import dayjs from 'dayjs';
import TripInfo from '../view/trip-info.js';

export default class TripPresenter {
	constructor(tripContainer, tripInfoContainer, tripDetailsContainer) {
		this._tripContainer = tripContainer;	// Контейнер для точек маршрута
		this._tripInfoContainer = tripInfoContainer;	// Контейнер для Инфо маршрута
		this._tripDetailsContainer = tripDetailsContainer;	// Контейнер для Фильтр
		this._currentSortType = SORT_NAMES[0].value;		// Начальная сортировка
		this._currentFilterType = FILTER_NAMES[0];	// Начальный фильтр
		this._boardViewComponent = new BoardView();	// сортировка и контент
		this._pointListComponent = new PointListView();	// точки маршрута

		this._tripInfo = new TripInfo();	// Информация - описание поездки
		this._filterMenu = new FilterMenuView();	// Фильтры: Everything, Future, Past
		this._sortMenu = new SortMenuView();	// Сортировка
		this._noPoint = new NoPointView();	// Нет точек маршрута

		this._pointPresenter = {};

		this._onPointChange = this._onPointChange.bind(this);
		this._onPointModeChange = this._onPointModeChange.bind(this);
		this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
		this._handleFilterTypeChange = this._handleFilterTypeChange.bind(this);
	}
	init(tripPoints) {
		this._tripPoints = tripPoints.slice();
		this._defaultSortPoints = tripPoints.slice();
		this._tripInfo = new TripInfo(tripPoints);	// Информация - описание поездки
		// render(findElement(document, markup[0].container), tripInfo.getElement(), markup[0].position);
		// render(this._tripDetailsContainer, this._tripInfo, markup[0].position);
		render(this._tripContainer, this._boardViewComponent, markup[8].position);
		render(this._boardViewComponent, this._pointListComponent, markup[5].position);	//? не надо?
		this._sortPoints(this._currentSortType, true);
		this._filterPoints(this._currentFilterType);
		this._renderBoard();
	}
	_renderTripInfo() {
		render(this._tripInfoContainer, this._tripInfo, markup[0].position);
	}
	_renderFilter() {
		render(this._tripDetailsContainer, this._filterMenu, markup[2].position);
		this._filterMenu.setFilterClickListener(this._handleFilterTypeChange);
	}
	_renderPoint(point) {
		const pointPresenter = new Point(this._pointListComponent, this._onPointChange, this._onPointModeChange);
		pointPresenter.init(point);
		this._pointPresenter[point.id] = pointPresenter;
	}
	_renderPoints(from, to) {
		this._tripPoints.slice(from, to).forEach((tripPoint) => this._renderPoint(tripPoint));

	}
	_renderNoPoints() {
		render(this._boardViewComponent, this._noPoint, markup[6].position);
	}
	_renderSortMenu() {
		render(this._boardViewComponent, this._sortMenu, markup[3].position);
		this._sortMenu.setSortClickListener(this._handleSortTypeChange);
	}
	_renderPointList() {
		this._renderPoints(0, Math.min(this._tripPoints.length, POINTS_COUNT));
		if (this._tripPoints.length > POINTS_COUNT) {
			console.log('Load More Button');
		}
	}
	_sortPoints(sortType, upSort = true) {
		switch (sortType) {
			case SORT_NAMES[0].value:
				this._tripPoints.sort(upSort ? sortPointDateUp : sortPointDateDown);
				break;
			case SORT_NAMES[1].value:
				break;
			case SORT_NAMES[2].value:
				this._tripPoints.sort(upSort ? sortPointTimeUp : sortPointTimeDown);
				break;
			case SORT_NAMES[3].value:
				this._tripPoints.sort(upSort ? sortPointCostUp : sortPointCostDown);
				break;
			case SORT_NAMES[4].value:
				break;
			default:
				this._tripPoints = this._defaultSortPoints.slice();
		}
		this._currentSortType = sortType;
	}
	_filterPoints(filterType) {
		switch (filterType) {
			case FILTER_NAMES[0]:
				this._tripPoints;
				break;
			case 'filter-' + FILTER_NAMES[1]:
				// elem => elem.data.dayjs(start).diff(dayjs()) > 0
				console.log('Фильтр Future');
				this._tripPoints.filter(elem => !elem.isPast);
				break;
			case 'filter-' + FILTER_NAMES[2]:
				console.log('Фильтр Past');
				this._tripPoints.filter(elem => elem.isPast);
				break;
			default:
				this._tripPoints = this._defaultSortPoints.slice();
		}
		this._currentFilterType = filterType;
	}
	_renderBoard() {
		if (this._tripPoints.length === 0) {
			this._renderNoPoints();
			return;
		}
		this._renderSortMenu();
		this._renderFilter();
		this._renderPointList();
		this._renderTripInfo();
	}
	_onPointChange(modifiedPoint) {
		this._tripPoints = updatePoint(this._tripPoints, modifiedPoint);
		this._pointPresenter[modifiedPoint.id].init(modifiedPoint);
	}
	_handleSortTypeChange(sortType) {
		const upSort = !(this._currentSortType === sortType);
		this._sortPoints(sortType, upSort);
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