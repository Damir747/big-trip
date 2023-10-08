import { CONTAINER } from './const.js';
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
import Destinations from './model/destination-model.js';
import { isOnline } from './utils/common.js';
import Store from './api/store.js';
import Api from './api/api.js';
import Provider from './api/provider.js';
import { toast, toastRemove } from './utils/toast.js';

const AUTHORIZATION = 'Basic dadasdab7n89llghhswgqe4tdfgdg';
const END_POINT = 'https://14.ecmascript.pages.academy/big-trip';
const STORE_PREFIX = 'big-trip-storage';
const STORE_POINTS = 'points';
const STORE_OFFERS = 'offers';
const STORE_DESTINATIONS = 'destinations';
const STORE_VERSION = 'v14';
const STORE_POINTS_NAME = `${STORE_PREFIX}-${STORE_POINTS}-${STORE_VERSION}`;
const STORE_OFFERS_NAME = `${STORE_PREFIX}-${STORE_OFFERS}-${STORE_VERSION}`;
const STORE_DESTINATIONS_NAME = `${STORE_PREFIX}-${STORE_DESTINATIONS}-${STORE_VERSION}`;

const api = new Api(END_POINT, AUTHORIZATION);
const storePoints = new Store(STORE_POINTS_NAME, window.localStorage);
const apiWithProviderPoints = new Provider(api, storePoints);
const storeOffers = new Store(STORE_OFFERS_NAME, window.localStorage);
const apiWithProviderOffers = new Provider(api, storeOffers);
const storeDestinations = new Store(STORE_DESTINATIONS_NAME, window.localStorage);
const apiWithProviderDestinations = new Provider(api, storeDestinations);

const headerView = new HeaderView();	// Заголовок (header) для: Маршрут и стоимость, Меню, Фильтры
render(findElement(document, CONTAINER.HEADER), headerView.getElement(), RenderPosition.BEFOREEND);

//? offersModel инициализировать 36:31

const pointsModel = new PointsModel();
const destinationsModel = new Destinations();

// Tab: Данные, Статистика
const tabModel = new TabModel();
// Фильтры: Everything, Future, Past
const filterModel = new FilterModel();
// Сортировки
const sortModel = new SortModel();

const tripPresenter = new TripPresenter(findElement(document, CONTAINER.TRIP), findElement(document, CONTAINER.TRIPINFO), pointsModel, filterModel, sortModel, apiWithProviderPoints, destinationsModel);
tripPresenter.init();

const statPresenter = new StatPresenter(findElement(document, CONTAINER.TRIP), pointsModel);
statPresenter.init();

const tabPresenter = new TabPresenter(findElement(document, CONTAINER.TAB), findElement(document, CONTAINER.STAT), tabModel, pointsModel, tripPresenter, statPresenter);
tabPresenter.init(tripPresenter);

const filterPresenter = new FilterPresenter(findElement(document, CONTAINER.FILTER), pointsModel, filterModel);
filterPresenter.init();

const sortPresenter = new SortPresenter(findElement(document, CONTAINER.SORT), filterModel, sortModel, tabModel);
sortPresenter.init();

//? поработать с пустыми данными (если ничего не пришло с сервера)
//? да, если нет offers, обработчиков нет
apiWithProviderOffers.getOffers()
	.then((offers) => {
		console.log('Данные offers получены', offers);
		pointsModel.setOffers(offers);
	})
	.catch((err) => {
		console.log('Offers не загрузились.', err);
	});
apiWithProviderPoints.getPoints()
	.then((points) => {
		console.log('Данные points получены', points);
		pointsModel.setPoints(UpdateType.INIT, points);
	})
	.catch((err) => {
		console.log('Points не загрузились', err);
		pointsModel.setPoints(UpdateType.INIT, []);
	});

apiWithProviderDestinations.getDestinations()
	.then((destinations) => {
		console.log('Данные destinations получены.', destinations);
		destinationsModel.setDestinations(destinations);
	})
	.catch((err) => {
		console.log('Destinations не загрузились.', err);
	});

window.addEventListener('load', () => {
	navigator.serviceWorker.register('/sw.js');
	if (!isOnline) {
		toast('we are offline', true);
	}
});

window.addEventListener('online', () => {
	document.title = document.title.replace('[offline]', '');
	apiWithProviderPoints.sync();
	toastRemove();
});

window.addEventListener('offline', () => {
	document.title += ' [offline]';
	toast('we are offline', true);
});