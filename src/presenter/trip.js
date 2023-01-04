import { markup } from '../data.js';
import FilterMenuView from '../view/filter.js';
import TabsMenuView from '../view/main-menu.js';
import SortMenuView from '../view/trip-board.js';
import NoPointView from '../view/no-point.js';
import { POINTS_COUNT } from '../const.js';
import { render } from '../view/render.js';
import PointListView from '../view/point-list.js'
import BoardView from '../view/board.js'
import TripInfo from '../view/trip-info.js';
import { updatePoint } from '../utils/common.js';
import Point from './point.js';

export default class Trip {
	constructor(tripContainer) {			// +tripDetailsContainer
		this._tripContainer = tripContainer;
		// this._tripDetailsContainer = tripDetailsContainer;
		this._boardComponent = new BoardView();
		this._pointListComponent = new PointListView();

		this._tabsMenu = new TabsMenuView();
		this._filterMenu = new FilterMenuView();
		this._sortMenu = new SortMenuView();
		this._tripInfo = new TripInfo();
		this._noPoint = new NoPointView();

		this._pointPresenter = {};

		this._onPointChange = this._onPointChange.bind(this);
		this._onPointModeChange = this._onPointModeChange.bind(this);

	}
	init(tripPoints) {
		this._tripPoints = tripPoints.slice();
		render(this._tripContainer, this._boardComponent, 'beforeend');
		render(this._boardComponent, this._pointListComponent, markup[5].position);	//? не надо?
		this._renderBoard();
	}
	_renderTripInfo() {
		render(this._boardComponent, this._tripInfo, markup[0].position);
		// здесь можно сделать два компонента: информация о поездке и стоимость поездки
	}
	_renderFilter() {
		render(this._boardComponent, this._filterMenu, markup[2].position);
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
		render(this._boardComponent, this._noPoint, markup[6].position);
	}
	_renderSortMenu() {
		render(this._boardComponent, this._sortMenu, markup[3].position);
	}
	_renderPointList() {
		this._renderPoints(0, Math.min(this._tripPoints.length, POINTS_COUNT));
		if (this._tripPoints.length > POINTS_COUNT) {
			console.log('Load More Button');
		}
	}
	_renderBoard() {
		if (this._tripPoints.length === 0) {
			this._renderNoPoints();
			return;
		}
		this._renderSortMenu();
		this._renderPointList();
		this._renderTripInfo();
	}
	_onPointChange(modifiedPoint) {
		this._tripPoints = updatePoint(this._tripPoints, modifiedPoint);
		this._pointPresenter[modifiedPoint.id].init(modifiedPoint);
	}

	_onPointModeChange() {
		console.log('On Point Mode Change');
		Object.values(this._pointPresenter).forEach((pointPresenter) => pointPresenter.resetView());
		this._pointPresenter = {};
	}

	_clearAllPoints() {
		console.log('Clear All Points');
		Object.values(this._pointPresenter).forEach((pointPresenter) => pointPresenter.destroy());
	}
}