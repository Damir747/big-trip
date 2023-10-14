import dayjs from 'dayjs';

const getWeightForNullDate = (dateA, dateB) => {
	if (dateA === null && dateB === null) {
		return 0;
	}
	if (dateA === null) {
		return 1;
	}
	if (dateB === null) {
		return -1;
	}
	return null;
}
const sortPointDateUp = (dateA, dateB) => {
	const weight = getWeightForNullDate(dateA.dueDate, dateB.dueDate);
	if (weight !== null) {
		return weight;
	}
	return dayjs(dateA.start).diff(dayjs(dateB.start));
}

const sortPointDateDown = (dateA, dateB) => sortPointDateUp(dateB, dateA);

const sortPointTimeUp = (timeA, timeB) => {
	const weight = getWeightForNullDate(timeA.dueDate, timeB.dueDate);
	if (weight !== null) {
		return weight;
	}
	const timerOfTripA = dayjs(timeA.end).diff(dayjs(timeA.start));
	const timerOfTripB = dayjs(timeB.end).diff(dayjs(timeB.start));

	return dayjs(timerOfTripA).diff(dayjs(timerOfTripB));

}

const sortPointTimeDown = (timeA, timeB) => sortPointTimeUp(timeB, timeA);

const sortPointCostUp = (costA, costB) => costA.price - costB.price;
const sortPointCostDown = (costA, costB) => costB.price - costA.price;

export { sortPointDateUp, sortPointDateDown, sortPointTimeUp, sortPointTimeDown, sortPointCostUp, sortPointCostDown }