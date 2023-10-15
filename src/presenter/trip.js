import BoardView from '../view/board.js'
import PointListView from '../view/point-list.js'
import NoPointView from '../view/no-point.js';
import TripInfo from '../view/trip-info.js';
import PointPresenter from './point-presenter.js';
import { render, remove } from '../framework/render.js';
import LoadingView from '../view/loading.js';
import LoadMoreButton from '../view/load-more.js';
import { isOnline } from '../utils/common.js';
import { DEFAULT_POINT_COUNT, DEFAULT_FILTER, DEFAULT_SORT, State, UpdateType, RenderPosition, UserAction } from '../const.js';

class TripPresenter {
	constructor(tripContainer, tripInfoContainer, pointsModel, filterModel, sortModel, api, destinationsModel) {
		this._isLoading = true;
		this._pointsModel = pointsModel;
		this._filterModel = filterModel;
		this._sortModel = sortModel;
		this._api = api;
		this._destinationsModel = destinationsModel;
		this._tripContainer = tripContainer;					// Контейнер для точек маршрута
		this._tripInfoContainer = tripInfoContainer;			// Контейнер для Инфо маршрута
		this._sortModel.setActiveSort(UpdateType.FULL, DEFAULT_SORT);
		this._filterModel.setActiveFilter(UpdateType.FULL, DEFAULT_FILTER);

		this._boardViewComponent = new BoardView();			// сортировка и контент
		this._pointListComponent = new PointListView();		// точки маршрута
		this._noPoint = new NoPointView();						// Нет точек маршрута
		this._loadingComponent = new LoadingView();			// загрузка
		this._pointPresenter = {};

		this._resetPointMode = this._resetPointMode.bind(this);
		this._handleViewAction = this._handleViewAction.bind(this);
		this._handleModelEvent = this._handleModelEvent.bind(this);
		this._handleButton = this._handleButton.bind(this);

		this._pointsModel.addObserver(this._handleModelEvent);
		this._sortModel.addObserver(this._handleModelEvent);
		this._filterModel.addObserver(this._handleModelEvent);

		this._pointNewPresenter = new PointPresenter(this._pointListComponent, this._handleViewAction, this._handleModelEvent, this._destinationsModel, this._pointsModel);
		this._setHandleNewPointButton();
	}

	init() {
		render(this._tripContainer, this._boardViewComponent, RenderPosition.AFTERBEGIN);
		render(this._boardViewComponent, this._pointListComponent, RenderPosition.BEFOREEND);
		this._showPointsStart = 0;
		this._showPoints = DEFAULT_POINT_COUNT;
		this._renderBoard();
	}
	hide() {
		this._boardViewComponent.hide();
	}
	show() {
		this._boardViewComponent.show();
	}
	_getAllPoints() {
		return this._pointsModel.getPoints();
	}
	_getPoints() {
		return this._pointsModel.getPoints(
			this._filterModel.getActiveFilter(),
			this._sortModel.getActiveSort(),
			this._sortModel.getUpSort()
		);
	}

	_toggleButton() {
		if (this._getPoints().length > this._showPoints) {
			this._loadMoreButton.show();
		}
		else {
			this._loadMoreButton.hide();
		}
	}

	_handleButton() {
		this._showPointsStart += DEFAULT_POINT_COUNT;
		this._showPoints = Math.min(this._getPoints().length, this._showPoints + DEFAULT_POINT_COUNT);
		this._renderPointList(this._showPointsStart);
		this._toggleButton();
	}

	_renderLoadMoreButton() {
		this._loadMoreButton = new LoadMoreButton();
		render(this._boardViewComponent, this._loadMoreButton, RenderPosition.BEFOREEND);
		this._loadMoreButton.setButtonCLickListener(this._handleButton);
		this._toggleButton();
	}
	_renderTripInfo() {
		this._tripInfo = new TripInfo(this._getAllPoints());	// Информация - описание поездки
		render(this._tripInfoContainer, this._tripInfo, RenderPosition.AFTERBEGIN);
	}
	_renderPoint(point) {
		const pointPresenter = new PointPresenter(this._pointListComponent, this._handleViewAction, this._handleModelEvent, this._destinationsModel, this._pointsModel);
		pointPresenter.init(point);
		this._pointPresenter[point.id] = pointPresenter;	// Для сохранения ссылки на презентер
	}
	_renderPoints(from, to) {
		this._getPoints().slice(from, to).forEach((tripPoint) => this._renderPoint(tripPoint));
	}
	_renderNoPoints() {
		render(this._boardViewComponent, this._noPoint, RenderPosition.BEFOREEND);
	}

	_renderPointList(start = 0) {
		this._renderPoints(start, this._showPoints);

		const buttonsRollDown = document.querySelectorAll('.event__rollup-btn');
		buttonsRollDown.forEach(button => button.disabled = !isOnline());

	}

	_renderLoading() {
		render(this._boardViewComponent, this._loadingComponent, RenderPosition.BEFOREEND)
	}

	_renderBoard() {
		if (this._isLoading) {
			this._renderLoading();
			return;
		}
		this._renderTripInfo();
		if (this._getPoints().length === 0) {
			this._renderNoPoints();
			return;
		}
		this._renderPointList();
		this._renderLoadMoreButton();
	}

	_handleViewAction(actionType, updateType, update) {
		switch (actionType) {
			case UserAction.UPDATE_POINT:
				this._pointPresenter[update.id].setViewState(State.SAVING);
				this._api.updatePoint(update)
					.then((response) => {
						this._pointsModel.updatePoint(updateType, response);
					})
					.catch(() => {
						this._pointPresenter[update.id].setViewState(State.ABORTING);
					});
				break;
			case UserAction.ADD_POINT:
				this._pointNewPresenter.setViewState(State.SAVING);
				this._api.addPoint(update)
					.then((response) => {
						this._pointsModel.addPoint(updateType, response);
					})
					.catch((err) => {
						this._pointNewPresenter.setViewState(State.ABORTING);
					});
				break;
			case UserAction.DELETE_POINT:
				this._pointPresenter[update.id].setViewState(State.DELETING);
				this._api.deletePoint(update)
					.then(() => {
						this._pointsModel.deletePoint(updateType, update);
					})
					.catch(() => {
						this._pointPresenter[update.id].setViewState(State.ABORTING);
					});
				break;
			default:
				throw new error('UserAction is not found');
		}
	}
	_handleModelEvent(updateType, data, upSort = true) {
		switch (updateType) {
			case UpdateType.INIT:
				this._resetPointMode();
				this._isLoading = false;
				remove(this._loadingComponent);
				this._renderBoard();
				break;
			case UpdateType.FULL:
				this._clearBoard(true);
				this._renderBoard();
				break;
			case UpdateType.POINTS:
				this._clearBoard(false);
				this._renderBoard();
				break;
			case UpdateType.PATCH:
				this._resetPointMode();
				// this._pointPresenter[data.id].init(data);
				break;
			default:
				throw new Error('UpdateType is not found');
		}
	}

	_resetPointMode() {
		this._pointNewPresenter.destroy();
		// сбрасывает все редакторы к просмотру
		Object
			.values(this._pointPresenter)
			.forEach((pointPresenter) => pointPresenter.resetView());
	}
	_clearBoard(resetSort = false) {
		this._resetPointMode();
		Object.values(this._pointPresenter).forEach((pointPresenter) => pointPresenter.destroy());
		this._pointPresenter = {};
		if (this._tripInfo !== undefined) {
			this._tripInfo.getElement();
			remove(this._tripInfo);
		}
		if (this._loadMoreButton !== undefined) {
			remove(this._loadMoreButton);
		}
		this._noPoint.getElement();
		remove(this._noPoint);
		// remove Empty
		// remove Cost
		if (resetSort) {
			this._showPointsStart = 0;
			this._showPoints = DEFAULT_POINT_COUNT;
			// this._upSort = false;
			// this._sortModel.setActiveSort(UpdateType.FULL, DEFAULT_SORT);
			// this._filterModel.setActiveFilter(UpdateType.FULL, DEFAULT_FILTER);
		}
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
			btnAddEvent.disabled = true;
		});
	}
}

export default TripPresenter;