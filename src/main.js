import { markup, points } from './data.js';
import { findElement } from './utils/common.js';
import { render } from './view/render.js';
import TabsMenuView from './view/main-menu.js';
import TripPresenter from './presenter/trip.js';
import HeaderView from './view/header-view.js';
import PointsModel from './model/points-model.js';
import FilterPresenter from './presenter/filter-presenter.js';
import FilterModel from './model/filter-model.js';
import SortPresenter from './presenter/sort-presenter.js';
import SortModel from './model/sort-model.js';
import { RenderPosition, DEFAULT_SORT } from './const.js';

const headerView = new HeaderView();	// Заголовок (header) для: Маршрут и стоимость, Меню, Фильтры
render(findElement(document, markup[7].container), headerView.getElement(), RenderPosition.BEFOREEND);
const tabsMenu = new TabsMenuView();	// Меню: Table/Stats
render(findElement(document, markup[1].container), tabsMenu.getElement(), RenderPosition.BEFOREEND);

//? offersModel инициализировать 36:31

const pointsModel = new PointsModel();
pointsModel.setPoints(points);

// Фильтры: Everything, Future, Past
const filterModel = new FilterModel();
// Сортировки
const sortModel = new SortModel();

const tripPresenter = new TripPresenter(findElement(document, '.page-body__container'), findElement(document, markup[0].container), findElement(document, markup[1].container), pointsModel, filterModel, sortModel);
tripPresenter.init();

const filterPresenter = new FilterPresenter(findElement(document, '.trip-main__trip-controls'), filterModel, pointsModel);
filterPresenter.init();	//? ничего не передаёт?

const sortPresenter = new SortPresenter(findElement(document, '.trip-events'), sortModel, filterModel);	//? не уверен в контейнере
sortPresenter.init(points);

const btnAddEvent = document.querySelector('.trip-main__event-add-btn');
btnAddEvent.addEventListener('click', (evt) => {
	evt.preventDefault();
	tripPresenter.createPoint();
});

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


