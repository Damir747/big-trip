import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
dayjs.extend(duration);

const isEscapeEvent = (evt) => {
	return (evt.key === ('Escape' || 'Esc'));
}

const firstLetterUpperCase = (str) => str ? str[0].toUpperCase() + str.slice(1) : '';

const humanizeDate = (date, format) => dayjs(date).format(format);

const humanizeTripTime = (start, end) => {
	const days = dayjs(end).diff(dayjs(start), 'day');
	const hours = dayjs(end).diff(dayjs(start), 'hour') % 24;
	const minutes = dayjs(end).diff(dayjs(start), 'minute') % 60;

	const daysString = (days > 99) ? '99' : ('0'.concat(days)).slice(-2);
	const hoursString = ('0'.concat(hours)).slice(-2);
	const minutesString = ('0'.concat(minutes)).slice(-2);

	if (days > 0) {
		return `${daysString}D ${hoursString}H ${minutesString}M`;
	}
	if (hours > 0) {
		return `${hoursString}H ${minutesString}M`;
	}
	return `${minutesString}M`;
};

const findElement = (container, selector) => {
	if (container === null) {
		return null;
	}
	return container.querySelector(selector);
};

const addListener = (container, selector, type, listener) => {
	findElement(container, selector).addEventListener(type, listener);
}

const removeListener = (container, selector, type, listener) => {
	findElement(container, selector).removeEventListener(type, listener);
}

const createElement = (template) => {
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

const getRandomPositiveInteger = (min, max) => {
	checkValidation(min, max);
	return Math.round(Math.random() * (max - min) + min);
};

const compareTwoDates = (start, end) => dayjs(end).diff(dayjs(start));
const sortByDecreasing = (elementA, elementB) => elementB[1] - elementA[1];

const isOnline = () => {
	return window.navigator.onLine;
}

export { isEscapeEvent, firstLetterUpperCase, humanizeDate, humanizeTripTime, findElement, addListener, removeListener, createElement, getRandomPositiveInteger, compareTwoDates, sortByDecreasing, isOnline };