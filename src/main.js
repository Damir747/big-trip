import { markup, points } from './data.js';
import { findElement } from './utils.js';
import { render } from './view/render.js';
import TabsMenuView from './view/main-menu.js';
import FilterMenuView from './view/filter.js';
import TripInfo from './view/trip-info.js';
import TripPresenter from './presenter/trip.js';

// import SortMenuView from './view/trip-board.js';
// import PointListView from './view/point-list.js';
// import Point from './view/point.js';
// import EditPoint from './view/edit-point.js';

const tabsMenu = new TabsMenuView();
render(findElement(document, markup[1].container), tabsMenu.getElement(), markup[1].position);
const tripInfo = new TripInfo(points);
render(findElement(document, markup[0].container), tripInfo.getElement(), markup[0].position);
const filterMenu = new FilterMenuView();
render(findElement(document, markup[2].container), filterMenu.getElement(), markup[2].position);

const tripPresenter = new TripPresenter(findElement(document, '.trip-events'));
tripPresenter.init(points);

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

const changeFilter = (elem) => {
	console.log(`Сработал addEventListener для фильтра ${elem.control.value}`);
}
const btnFilter = document.querySelectorAll('.trip-filters__filter-label');
btnFilter.forEach((elem) =>
	elem.addEventListener('click', (evt) => {
		changeFilter(elem);
	})
);

const changeSort = (elem) => {
	console.log(`Сработал addEventListener для сортировки ${elem.control.value}`);
}
const btnSort = document.querySelectorAll('.trip-sort__btn');
btnSort.forEach((elem) =>
	elem.addEventListener('click', (evt) => {
		changeSort(elem);
	})
);