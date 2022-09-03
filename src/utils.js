import { DIR_PICTURE, MAX_RANDOM_PICTURE } from "./const";
import dayjs from "dayjs";
import duration from 'dayjs/plugin/duration';
dayjs.extend(duration);

export const findElement = (container, selector) => {
	if (container === null) {
		return null;
	}
	return container.querySelector(selector);
};

export const render = (container, template, position = 'beforeend') => {
	container.insertAdjacentHTML(position, template);
};

const checkInteger = (number) => {
	if (!Number.isInteger(number)) {
		throw new Error(`Число ${number} не integer, не целое`);
	}
};

const checkPositive = (number) => {
	if (number < 0) {
		throw new Error(`Число ${number} отрицательное`);
	}
};
const checkMinMax = (left, right) => {
	if (left >= right) {
		throw new Error('Левый параметр не меньше правого');
	}
};

const checkValidation = (min, max) => {
	checkInteger(min);
	checkInteger(max);
	checkPositive(min);
	checkMinMax(min, max);
};

export const getRandomPositiveInteger = (min, max) => {
	checkValidation(min, max);
	return Math.round(Math.random() * (max - min) + min);
};

export const getRandomPicture = () => DIR_PICTURE + getRandomPositiveInteger(0, MAX_RANDOM_PICTURE);

export const getRandomElementFromArray = (array) => array[getRandomPositiveInteger(0, array.length - 1)];
