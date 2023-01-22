import { markup, points } from './data.js';
import { findElement } from './utils/common.js';
import { render } from './view/render.js';
import TabsMenuView from './view/main-menu.js';
import TripInfo from './view/trip-info.js';
import TripPresenter from './presenter/trip.js';
import HeaderView from './view/header-view.js';
import PointsModel from './model/points-model.js';
import FilterPresenter from './presenter/filter-presenter.js';
import FilterModel from './model/filter-model.js';
import { ACTIVE_FILTER, FILTER_NAMES } from './const.js';

const headerView = new HeaderView();	// Заголовок (header) для: Маршрут и стоимость, Меню, Фильтры
render(findElement(document, markup[7].container), headerView.getElement(), markup[7].position);
const tabsMenu = new TabsMenuView();	// Меню: Table/Stats
render(findElement(document, markup[1].container), tabsMenu.getElement(), markup[1].position);

const pointsModel = new PointsModel();
pointsModel.setPoints(points);

// Фильтры: Everything, Future, Past
const filterModel = new FilterModel();

const tripPresenter = new TripPresenter(findElement(document, '.page-body__container'), findElement(document, markup[0].container), findElement(document, markup[1].container), pointsModel, filterModel);
tripPresenter.init();

const filterPresenter = new FilterPresenter(findElement(document, '.trip-main__trip-controls'), filterModel, pointsModel);
filterPresenter.init(points);

// Обработчики все вынести в классы
const changeStat = (elem) => {
	console.log(`Сработал addEventListener для статистики Stat ${elem}`)
}
const btnStat = document.querySelectorAll('.trip-tabs__btn');
btnStat.forEach((elem) =>
	elem.addEventListener('click', (evt) => {
		changeStat(elem);
	})
);

const btnAddEvent = document.querySelector('.trip-main__event-add-btn');
btnAddEvent.addEventListener('click', (evt) => {
	console.log('Click по кнопке + New Event');
})


