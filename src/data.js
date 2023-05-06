import { getRandomPositiveInteger } from './utils/common.js';
import dayjs from 'dayjs';
import { POINTS_COUNT, GENERATED_POINTS_COUNT, DIR_PICTURE, TYPES, CITIES, PLACE_DESCRIPTION, COUNT_PICTURE, MAX_RANDOM_PICTURE, ADD_DATE, ADD_TIME } from './const.js'
import { nanoid } from 'nanoid';
import { RenderPosition, POSSIBLE_OFFERS } from './const.js';

const generatePointTypes = () => TYPES[getRandomPositiveInteger(0, TYPES.length - 1)];
const generateCityDescription = () => PLACE_DESCRIPTION[getRandomPositiveInteger(0, PLACE_DESCRIPTION.length - 1)];
const generateCityPhotos = () => {
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

const checkedFavorite = () => Boolean(getRandomPositiveInteger(0, 1));

// Генерация опций (для типов маршрутов)
const generateOrderType = () => {
	const typesOfPoints = [];
	for (let i = 0; i < POSSIBLE_OFFERS.length; i++) {
		if (getRandomPositiveInteger(0, 1)) {
			typesOfPoints.push({
				title: POSSIBLE_OFFERS[i].title,
				short: POSSIBLE_OFFERS[i].short,
				price: POSSIBLE_OFFERS[i].price,
				checked: false,
			});
		}
	}
	return typesOfPoints;
}

// Для всех типов маршрутов создать список возможных опций
const generateOrderTypes = () => {
	const types = [];
	for (let i = 0; i < TYPES.length; i++) {
		types.push({
			title: TYPES[i].title,
			offers: generateOrderType(),
		});
	}
	return types;
}
// Сохранить список маршрутов с возможными опциями
export const orderTypes = generateOrderTypes();

// Для типа маршрута включить из числа возможных опций те, которые выбраны
const generateOrders = (type) => {
	const order = orderTypes.filter((el) => el.title === type);
	if (order.length === 0) {
		return;
	}
	const offers = [];
	order[0].offers.forEach((el) => {
		offers.push(Object.assign(
			{},
			el,
			{ checked: Boolean(getRandomPositiveInteger(0, 1)) }));
	});
	return offers;
};

export const pickElementDependOnValue = (type, orderTypes) => orderTypes.filter((el) => el.title.toLowerCase() === type)[0].offers;

const generateCity = (index) => {
	return {
		'city': CITIES[index],
		'description': generateCityDescription(),
		'photos': generateCityPhotos(),
	}
}

export const generateCities = new Array(CITIES.length).fill().map((_, index) => generateCity(index));

export const pickElementDependOnValue2 = (city, generateCities) => generateCities.filter((el) => el.city === city)[0].description;
export const pickElementDependOnValue3 = (city, generateCities) => generateCities.filter((el) => el.city === city)[0].photos;
export const checkCityInList = (checkedCity) => { generateCities.filter((el) => el.city === checkedCity).length > 0 };
export const checkPriceIsNumber = (checkedPrice) => /^\d+$/.test(checkedPrice);

export const generatePoint = () => {
	const point = generatePointTypes();
	const date = generateDate();
	const town = generateCities[getRandomPositiveInteger(0, TYPES.length - 1)];

	return {
		'id': nanoid(),
		'type': point.title,
		'price': point.price,
		'city': town.city,
		'start': date.start,
		'end': date.end,
		'description': town.description,
		'photos': town.photos,
		'checkedOffer': generateOrders(point.title),
		'checkedFavorite': checkedFavorite(),
		'isPast': date.start < new Date()
	}
}

export const points = new Array(GENERATED_POINTS_COUNT).fill().map(() => generatePoint());

//?контейнеры надо для каждой функции
export const markup = [

	{
		container: '.trip-main',
		position: RenderPosition.AFTERBEGIN,
		count: 1,
	},
	{
		container: '.trip-main__trip-controls',
		position: RenderPosition.BEFOREEND,
		count: 1,
	},
	{
		container: '.trip-main__trip-controls',
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
	{
		container: '.page-header__container',
		position: RenderPosition.BEFOREEND,
		count: 1,
	},
	{
		container: '.page-body__container',
		position: RenderPosition.AFTERBEGIN,
		count: 1,
	},
];
