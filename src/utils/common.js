import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
dayjs.extend(duration);

export const isEscapeEvent = (evt) => {
	return (evt.key === ('Escape' || 'Esc'));
}

export const firstLetterUpperCase = (str) => str[0].toUpperCase() + str.slice(1);

export const humanizeDate = (date, format) => dayjs(date).format(format);

export const findElement = (container, selector) => {
	if (container === null) {
		return null;
	}
	return container.querySelector(selector);
};

export const createElement = (template) => {
	const newElement = document.createElement('div');
	newElement.innerHTML = template;
	return newElement.firstElementChild;
}

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

export const compareTwoDates = (start, end) => dayjs(end).diff(dayjs(start));
export const sortByDecreasing = (elementA, elementB) => elementB[1] - elementA[1];

export const isOnline = () => {
	return window.navigator.onLine;
}
