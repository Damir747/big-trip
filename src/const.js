import { mainMenuTemplate } from './view/main-menu.js';
import { filterTemplate } from './view/filter.js';
import { tripBoardTemplate } from './view/trip-board.js';
import { newPointTemplate } from './view/new-point.js';
import { editPointTemplate } from './view/edit-point.js';
import { pointTemplate } from './view/point.js';
import { tripInfo } from './view/trip-info.js';
import { tripInfoCost } from './view/trip-cost.js';
import { getRandomPositiveInteger } from './utils.js';

const POINTS_COUNT = 3;
const GENERATED_POINTS_COUNT = 20;
export const DIR_PICTURE = 'http://picsum.photos/248/152?r=';
export const MAX_RANDOM_PICTURE = 9999;
export const COUNT_PICTURE = 4;
export const TRANSPORT = ['Taxi', 'Bus', 'Train', 'Ship', 'Transport', 'Drive', 'Flight'];
export const TRIP_STOP = ['Check-in', 'Sightseeing', 'Restaurant'];
export const TYPES = TRANSPORT.concat(TRIP_STOP);
export const TYPES_PICTURE = TYPES.map((el) => el.toLowerCase());

export const NO_TRIP_STOP_MESSAGE = "Click New Event to create your first point";
export const CITIES = ['Козова',
	'Рапла',
	'Христиансбург',
	'Стара Загора',
	'Геленджик',
	'Севилья',
	'Рио-Галльегос',
	'Кискунфелегихаза',
	'Уинта',
	'Камень-Каширский',
	'Габрово',
	'Марианна',
	'Сант-Хеленс',
	'Токушима',
	'Саут-Белмар',
	'Тилбург',
	'Пущино',
	'Радищево',
	'Зары',
	'Литтлетон']
export const PLACE_DESCRIPTION = ['Почему это место называется так, совершенно не понятно. Вообще никакого сходства с названием.',
	'Название связано с внешними особенностями этого места.',
	'Название - дословный перевод с языка актеонов, прежде живших в этих краях.',
	'Это название как-то связано с событиями полувековой давности.',
	'Самое обычное название для подобного места.',
	'Это название как-то связано с событиями полувековой давности.',
	'Аборигены называли это место совсем по другому, я даже не выговорю это словечко.',
	'Это название как-то связано с ближайшим городом.']

const destination = {
	"description": "Chamonix, is a beautiful city, a true asian pearl, with crowded streets.",
	"name": "Chamonix",
	"pictures": [
		{
			"src": "http://picsum.photos/300/200?r=0.0762563005163317",
			"description": "Chamonix parliament building"
		}
	]
}
const offer = {
	"type": TYPES,
	"offers": [
		{
			"title": "Upgrade to a business class",
			"price": 120
		}, {
			"title": "Choose the radio station",
			"price": 60
		}
	]
}

const point = {
	"base_price": 1100,
	"date_from": "2019-07-10T22:55:56.845Z",
	"date_to": "2019-07-11T11:22:13.375Z",
	// "destination": $Destination$,
	"id": "0",
	"is_favorite": false,
	"offers": [
		{
			"title": "Choose meal",
			"price": 180
		}, {
			"title": "Upgrade to comfort class",
			"price": 50
		}
	],
	"type": TYPES
}

const generatePointTypes = () => TYPES[getRandomPositiveInteger(0, TYPES.length - 1)];
const generateCity = () => CITIES[getRandomPositiveInteger(0, CITIES.length - 1)];
const generateDescription = () => PLACE_DESCRIPTION[getRandomPositiveInteger(0, PLACE_DESCRIPTION.length - 1)];
const generatePhotos = () => {
	const arr = [];
	for (let i = 0; i < COUNT_PICTURE; i++) {
		arr.push(DIR_PICTURE + getRandomPositiveInteger(0, MAX_RANDOM_PICTURE));
	}
	return arr;
}


export const generatePoint = () => {
	return {
		'point': generatePointTypes(),
		'city': generateCity(),
		'description': generateDescription(),
		'photos': generatePhotos(),
	}
}

export const points = new Array(GENERATED_POINTS_COUNT).fill().map(() => generatePoint());

const localPoint = {
	"base_price": 222,
	"date_from": "2019-07-10T22:55:56.845Z",
	"date_to": "2019-07-11T11:22:13.375Z",
	// "destination": $Destination$,
	"is_favorite": false,
	"offers": [
		{
			"title": "Choose meal",
			"price": 180
		}, {
			"title": "Upgrade to comfort class",
			"price": 50
		}
	],
	"type": TYPES
}

const authorizationError = {
	"error": 401,
	"message": "Header Authorization is not correct"
}

const notFoundError = {
	"error": 404,
	"message": "Not found"
}

export const markup = [

	{
		container: '.trip-main',
		position: 'afterbegin',
		fn: tripInfo,
		count: 1,
	},
	{
		container: '.trip-controls__navigation',
		position: 'beforeend',
		fn: mainMenuTemplate,
		count: 1,
	},
	{
		container: '.trip-info',
		position: 'beforeend',
		fn: tripInfoCost,
		count: 1,
	},
	{
		container: '.trip-controls__filters',
		position: 'beforeend',
		fn: filterTemplate,
		count: 1,
	},
	{
		container: '.trip-events',
		position: 'beforeend',
		fn: tripBoardTemplate,
		count: 1,
	},
	{
		container: '.trip-events__list',
		position: 'beforeend',
		fn: editPointTemplate,
		count: 1,
	},
	{
		container: '.trip-events__list',
		position: 'beforeend',
		fn: newPointTemplate,
		count: 1,
	},
	{
		container: '.trip-events__list',
		position: 'beforeend',
		fn: pointTemplate,
		count: POINTS_COUNT,
	},
];
