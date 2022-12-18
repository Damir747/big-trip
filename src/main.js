import { markup, points } from './data.js';
import { findElement, render } from './utils.js';
import TabsMenu from './view/main-menu.js';
import FilterMenu from './view/filter.js';
import SortMenu from './view/trip-board.js';
import Point from './view/point.js';
import EditPoint from './view/edit-point.js';
import TripInfo from './view/trip-info.js';

const tabsMenu = new TabsMenu();
render(findElement(document, markup[1].container), tabsMenu.getElement(), markup[1].position);
const tripInfo = new TripInfo(points);
render(findElement(document, markup[0].container), tripInfo.getElement(), markup[0].position);
const filterMenu = new FilterMenu();
render(findElement(document, markup[2].container), filterMenu.getElement(), markup[2].position);
const sortMenu = new SortMenu();
render(findElement(document, markup[3].container), sortMenu.getElement(), markup[3].position);

const renderPoints = function (pointListElement, point) {
	const pointComponent = new Point(point);
	const pointEditComponent = new EditPoint(point);
	const replaceCardToForm = () => {
		pointListElement.replaceChild(pointEditComponent.getElement(), pointComponent.getElement());
	}
	const replaceFormToCard = () => {
		pointListElement.replaceChild(pointComponent.getElement(), pointEditComponent.getElement());
	}

	pointComponent.getElement().querySelector('.event__rollup-btn').addEventListener('click', () => {
		replaceCardToForm();
	});

	pointEditComponent.getElement().querySelector('.event__rollup-btn').addEventListener('click', () => {
		replaceFormToCard();
	})
	pointEditComponent.getElement().querySelector('.event__save-btn').addEventListener('click', () => {
		replaceFormToCard();
	});
	pointEditComponent.getElement().querySelector('.event__reset-btn').addEventListener('click', () => {
		console.log('Нажата кнопка Delete/Reset');
	});

	render(pointListElement, pointComponent.getElement(), markup[5].position);
}
// 3.1.7 Выделит показ задач в функцию. WIP Сделать загрузку дополнительных точек по нажатию кнопки Ещё
const pointListComponent = new Point(points[0]);
render(findElement(document, markup[4].container), pointListComponent.getElement(), markup[4].position);
for (let i = 0; i <= markup[5].count; i++) {
	renderPoints(pointListComponent.getElement(), points[i]);
}

const changeStat = (elem) => {
	console.log(`Сработал addEventListener для статистики Stat ${elem}`)
}
const btnStat = document.querySelectorAll('.trip-tabs__btn');
btnStat.forEach((elem) =>
	elem.addEventListener('click', (evt) => {
		changeStat(elem);
	})
);

const changeFavorite = (elem) => {
	console.log(`Сработал addEventListener для звездочки Favorite ${elem}`);
}
const btnFavorite = document.querySelectorAll('.event__favorite-btn');
btnFavorite.forEach((elem) =>
	elem.addEventListener('click', (evt) => {
		changeFavorite(elem);
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