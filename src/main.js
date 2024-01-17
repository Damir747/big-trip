import { Container } from './const.js';
import { findElement } from './utils/common.js';
import { render } from './framework/render.js';
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
console.log('start');
render(findElement(document, Container.HEADER), headerView.getElement(), RenderPosition.BEFOREEND);

//? offersModel инициализировать 36:31
const pointsModel = new PointsModel();
const destinationsModel = new Destinations();

// Tab: Данные, Статистика
const tabModel = new TabModel();
// Фильтры: Everything, Future, Past
const filterModel = new FilterModel();
// Сортировки
const sortModel = new SortModel();

const tripPresenter = new TripPresenter(findElement(document, Container.TRIP), findElement(document, Container.TRIPINFO), pointsModel, filterModel, sortModel, apiWithProviderPoints, destinationsModel);
tripPresenter.init();

const statPresenter = new StatPresenter(findElement(document, Container.TRIP), pointsModel);
statPresenter.init();

const tabPresenter = new TabPresenter(findElement(document, Container.TAB), findElement(document, Container.STAT), tabModel, pointsModel, tripPresenter, statPresenter);
tabPresenter.init(tripPresenter);

const filterPresenter = new FilterPresenter(findElement(document, Container.FILTER), pointsModel, filterModel);
filterPresenter.init();

const sortPresenter = new SortPresenter(findElement(document, Container.SORT), filterModel, sortModel, tabModel);
sortPresenter.init();

apiWithProviderOffers.getOffers()
	.then((offers) => {
		console.log('apiWithProviderOffers.getOffers');
		pointsModel.setOffers(offers);
	})
	.catch((err) => {
		toast('Offers are not loaded');
	});
apiWithProviderPoints.getPoints()
	.then((points) => {
		pointsModel.setPoints(UpdateType.INIT, points);
	})
	.catch((err) => {
		toast('Points are not loaded');
		pointsModel.setPoints(UpdateType.INIT, []);
	});

apiWithProviderDestinations.getDestinations()
	.then((destinations) => {
		destinationsModel.setDestinations(destinations);
	})
	.catch((err) => {
		toast('Destinations are not loaded');
	});


window.addEventListener('load', () => {
	navigator.serviceWorker.register('/sw.js');
	if (!isOnline()) {
		toast('we are offline', true);
	}
});

window.addEventListener('online', (_evt) => {
	document.title = document.title.replace('[offline]', '');
	toastRemove();
	apiWithProviderPoints.sync();
	document.querySelector('.trip-main__event-add-btn').disabled = false;
	const buttonsRollDown = document.querySelectorAll('.event__rollup-btn');
	buttonsRollDown.forEach(button => button.disabled = false);
});
window.addEventListener('offline', (_evt) => {
	document.title += ' [offline]';
	toast('we are offline', true);
	document.querySelector('.trip-main__event-add-btn').disabled = true;
	const buttonsRollDown = document.querySelectorAll('.event__rollup-btn');
	buttonsRollDown.forEach(button => button.disabled = true);
});
