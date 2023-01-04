import { getRandomPositiveInteger } from './utils.js';
import dayjs from 'dayjs';
import { POINTS_COUNT, GENERATED_POINTS_COUNT, DIR_PICTURE, TYPES, CITIES, PLACE_DESCRIPTION, COUNT_PICTURE, MAX_RANDOM_PICTURE, ADD_DATE, ADD_TIME } from './const.js'
import { nanoid } from 'nanoid';
import { RenderPosition } from './const.js';

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
const generateDate = () => {
	const start = dayjs().add(getRandomPositiveInteger(0, ADD_DATE) * (getRandomPositiveInteger(0, 1) ? 1 : -1), 'hour');
	const end = start.add(getRandomPositiveInteger(0, ADD_TIME), 'minute');
	return { start, end };
}

const checkedFavorite = () => Boolean(getRandomPositiveInteger(0, 1)) ? 'event__favorite-btn--active' : '';
const checkedOrders = () => [
	{
		title: 'Add luggage',
		price: 50,
		checked: Boolean(getRandomPositiveInteger(0, 1)),
	},
	{
		title: 'Switch to comfort',
		price: 80,
		checked: Boolean(getRandomPositiveInteger(0, 1)),
	},
	{
		title: 'Add meal',
		price: 15,
		checked: Boolean(getRandomPositiveInteger(0, 1)),
	},
	{
		title: 'Choose seats',
		price: 5,
		checked: Boolean(getRandomPositiveInteger(0, 1)),
	},
	{
		title: 'Travel by train',
		price: 40,
		checked: Boolean(getRandomPositiveInteger(0, 1)),
	}
];

export const generatePoint = () => {
	const point = generatePointTypes();
	const date = generateDate();

	return {
		'id': nanoid(),
		'type': point.title,
		'price': point.price,
		'city': generateCity(),
		'start': date.start,
		'end': date.end,
		'description': generateDescription(),
		'photos': generatePhotos(),
		'checkedOffer': checkedOrders(),
		'checkedFavorite': checkedFavorite(),
		'isPast': date.start < new Date()
	}
}

export const points = new Array(GENERATED_POINTS_COUNT).fill().map(() => generatePoint());

// ?контейнеры надо для каждой функции
export const markup = [

	{
		container: '.trip-main',
		position: RenderPosition.AFTERBEGIN,
		count: 1,
	},
	{
		container: '.trip-controls__navigation',
		position: RenderPosition.BEFOREEND,
		count: 1,
	},
	{
		container: '.trip-controls__filters',
		position: RenderPosition.BEFOREEND,
		count: 1,
	},
	{
		container: '.trip-events',
		position: RenderPosition.AFTERBEGIN,
		count: 1,
	},
	{
		container: '.trip-events__list',
		position: RenderPosition.BEFOREEND,
		count: 1,
	},
	{
		container: '.trip-events__list',
		position: RenderPosition.BEFOREEND,
		count: POINTS_COUNT,
	},
	{
		container: '.trip-events',
		position: RenderPosition.BEFOREEND,
		count: 1,
	},
];
