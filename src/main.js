import { MARKUP, markup } from './const.js';
import { findElement } from './utils/common.js';
import { render } from './view/render.js';
import TripPresenter from './presenter/trip.js';
import HeaderView from './view/header-view.js';
import PointsModel from './model/point-model.js';
import FilterPresenter from './presenter/filter-presenter.js';
import FilterModel from './model/filter-model.js';
import SortPresenter from './presenter/sort-presenter.js';
import SortModel from './model/sort-model.js';
import TabPresenter from './presenter/tab-presenter.js';
import TabModel from './model/tab-model.js';
import { RenderPosition, UpdateType } from './const.js';
import StatPresenter from './presenter/stat-presenter.js';
import Api from './api.js';
import Destinations from './model/destination-model.js';

const AUTHORIZATION = 'Basic dadasdab7n89llghhswgqe4tdfgdg';
const END_POINT = 'https://14.ecmascript.pages.academy/big-trip';
const api = new Api(END_POINT, AUTHORIZATION);

const headerView = new HeaderView();	// Заголовок (header) для: Маршрут и стоимость, Меню, Фильтры
render(findElement(document, MARKUP.header.container), headerView.getElement(), RenderPosition.BEFOREEND);

//? offersModel инициализировать 36:31

const pointsModel = new PointsModel();
const destinationsModel = new Destinations();

// Tab: Данные, Статистика
const tabModel = new TabModel();
// Фильтры: Everything, Future, Past
const filterModel = new FilterModel();
// Сортировки
const sortModel = new SortModel();

const tripPresenter = new TripPresenter(findElement(document, MARKUP.trip.container), findElement(document, MARKUP.tripInfo.container), findElement(document, MARKUP.tripDetail.container), pointsModel, filterModel, sortModel, api, destinationsModel);
tripPresenter.init();

const statPresenter = new StatPresenter(findElement(document, MARKUP.trip.container), pointsModel);
statPresenter.init();

const tabPresenter = new TabPresenter(findElement(document, MARKUP.tab.container), findElement(document, MARKUP.stat.container), tabModel, pointsModel, tripPresenter, statPresenter);
tabPresenter.init(tripPresenter);

const filterPresenter = new FilterPresenter(findElement(document, MARKUP.filter.container), pointsModel, filterModel);
filterPresenter.init();

const sortPresenter = new SortPresenter(findElement(document, MARKUP.sort.container), filterModel, sortModel, tabModel);
sortPresenter.init([]);	//?points

//? поработать с пустыми данными (если ничего не пришло с сервера)
api.getOffers()
	.then((offers) => {
		console.log('Данные offers получены', offers);
		pointsModel.setOffers(offers);
	})
	.catch((err) => {
		console.log('Offers не загрузились.', err);
	});
api.getPoints()
	.then((points) => {
		console.log('Данные points получены', points);
		pointsModel.setPoints(UpdateType.INIT, points);
	})
	.catch((err) => {
		console.log('Points не загрузились', err);
		pointsModel.setPoints(UpdateType.INIT, []);
	});

api.getDestinations()
	.then((destinations) => {
		console.log('Данные destinations получены.', destinations);
		destinationsModel.setDestinations(destinations);
	})
	.catch((err) => {
		console.log('Destinations не загрузились.', err);
	});
