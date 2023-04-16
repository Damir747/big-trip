import BoardView from '../view/board.js'
import PointListView from '../view/point-list.js'
import NoPointView from '../view/no-point.js';
import TripInfo from '../view/trip-info.js';
import PointPresenter from './point-presenter.js';
import { POINTS_COUNT, DEFAULT_FILTER, DEFAULT_SORT } from '../const.js';
import { render } from '../view/render.js';
import { UserAction, UpdateType } from '../const.js';
import { remove } from '../framework/render.js';
import { RenderPosition } from '../const.js';

//? Надо ли отображать маршрут полностью (и расчет цены)? Или с учетом фильтра (как сейчас)?

export default class TripPresenter {
	constructor(tripContainer, tripInfoContainer, tripDetailsContainer, pointsModel, filterModel, sortModel) {
		this._pointsModel = pointsModel;
		this._filterModel = filterModel;
		this._sortModel = sortModel;
		this._tripContainer = tripContainer;					// Контейнер для точек маршрута
		this._tripInfoContainer = tripInfoContainer;			// Контейнер для Инфо маршрута
		this._tripDetailsContainer = tripDetailsContainer;	// Контейнер для Фильтр
		this._sortModel.setActiveSort(UpdateType.FULL, DEFAULT_SORT);
		this._filterModel.setActiveFilter(UpdateType.FULL, DEFAULT_FILTER);

		this._boardViewComponent = new BoardView();			// сортировка и контент
		this._pointListComponent = new PointListView();		// точки маршрута
		this._noPoint = new NoPointView();						// Нет точек маршрута

		this._pointPresenter = {};

		this._onPointModeChange = this._onPointModeChange.bind(this);
		this._handleViewAction = this._handleViewAction.bind(this);
		this._handleModelEvent = this._handleModelEvent.bind(this);

		this._pointsModel.addObserver(this._handleModelEvent);
		this._sortModel.addObserver(this._handleModelEvent);
		this._filterModel.addObserver(this._handleModelEvent);

		this._pointNewPresenter = new PointPresenter(this._pointListComponent, this._handleViewAction, this._handleModelEvent);
		this._setHandleNewPointButton();
	}
	init() {
		// this._defaultSortPoints = tripPoints.slice();
		// render(findElement(document, markup[0].container), tripInfo.getElement(), RenderPosition.AFTERBEGIN);
		// render(this._tripDetailsContainer, this._tripInfo, RenderPosition.AFTERBEGIN);
		render(this._tripContainer, this._boardViewComponent, RenderPosition.AFTERBEGIN);
		render(this._boardViewComponent, this._pointListComponent, RenderPosition.BEFOREEND);	//? не надо?
		this._renderBoard();
	}
	getModel() {
		return this._pointsModel;
	}
	getFilterModel() {
		return this._filterModel;
	}
	getSortModel() {
		return this._sortModel;
	}
	_getPoints() {
		return this.getModel().getPoints(this.getFilterModel().getActiveFilter(), this.getSortModel().getActiveSort(), this.getSortModel().getUpSort());
	}
	_renderTripInfo() {
		this._tripInfo = new TripInfo(this._getPoints());	// Информация - описание поездки
		render(this._tripInfoContainer, this._tripInfo, RenderPosition.AFTERBEGIN);
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
		render(this._boardViewComponent, this._noPoint, RenderPosition.BEFOREEND);
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
	_handleModelEvent(updateType, data, upSort = true) {
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

	_onPointModeChange() {
		this._pointNewPresenter.destroy();
		// сбрасывает все редакторы к просмотру
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
		// Если в фильтре удалить точки, будет отображаться NoPoints, и tripInfo будет null
		this._tripInfo.getElement();
		remove(this._tripInfo);
		this._noPoint.getElement();
		remove(this._noPoint);
		// remove Empty
		// remove Cost
		if (resetSort) {
			// this._upSort = false;
			// this._sortModel.setActiveSort(UpdateType.FULL, DEFAULT_SORT);
			// this._filterModel.setActiveFilter(UpdateType.FULL, DEFAULT_FILTER);
		}
	}

	_onChangeSort() {

	}
	_renderTripSort() {

	}

	_createPoint() {
		this._filterModel.setActiveFilter(UpdateType.FULL, DEFAULT_FILTER);	// сбрасывается фильтрация, как следствие, сбрасывается сортировка
		this._pointNewPresenter.init();

	}
	_setHandleNewPointButton() {
		const btnAddEvent = document.querySelector('.trip-main__event-add-btn');
		btnAddEvent.addEventListener('click', (evt) => {
			evt.preventDefault();
			this._createPoint();
		});
	}
}