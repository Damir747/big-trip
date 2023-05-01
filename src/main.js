import { markup, points } from './data.js';
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
import { RenderPosition } from './const.js';
import StatPresenter from './presenter/stat-presenter.js';

const headerView = new HeaderView();	// Заголовок (header) для: Маршрут и стоимость, Меню, Фильтры
render(findElement(document, markup[7].container), headerView.getElement(), RenderPosition.BEFOREEND);

//? offersModel инициализировать 36:31

const pointsModel = new PointsModel();
pointsModel.setPoints(points);

// Tab: Данные, Статистика
const tabModel = new TabModel();
// Фильтры: Everything, Future, Past
const filterModel = new FilterModel();
// Сортировки
const sortModel = new SortModel();

const tripPresenter = new TripPresenter(findElement(document, '.page-body__container'), findElement(document, markup[0].container), findElement(document, markup[1].container), pointsModel, filterModel, sortModel);
tripPresenter.init();

const statPresenter = new StatPresenter(findElement(document, '.page-body__container'), pointsModel);
statPresenter.init();

const tabPresenter = new TabPresenter(findElement(document, '.trip-main__trip-controls'), findElement(document, '.statistics'), tabModel, pointsModel, tripPresenter, statPresenter);
tabPresenter.init(tripPresenter);

const filterPresenter = new FilterPresenter(findElement(document, '.trip-main__trip-controls'), pointsModel, filterModel);
filterPresenter.init();

const sortPresenter = new SortPresenter(findElement(document, '.trip-events'), filterModel, sortModel, tabModel);
sortPresenter.init(points);

