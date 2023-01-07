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
export const sortPointDateUp = (dateA, dateB) => {
	const weight = getWeightForNullDate(dateA.dueDate, dateB.dueDate);
	if (weight !== null) {
		return weight;
	}
	return dayjs(dateA.start).diff(dayjs(dateB.start));
}

export const sortPointDateDown = (dateA, dateB) => sortPointDateUp(dateB, dateA);

export const sortPointTimeUp = (timeA, timeB) => {
	const weight = getWeightForNullDate(timeA.dueDate, timeB.dueDate);
	if (weight !== null) {
		return weight;
	}
	const timerOfTripA = timeA.end.diff(timeA.start);
	const timerOfTripB = timeB.end.diff(timeB.start);

	return dayjs(timerOfTripA).diff(dayjs(timerOfTripB));

}

export const sortPointTimeDown = (timeA, timeB) => sortPointTimeUp(timeB, timeA);

export const sortPointCostUp = (costA, costB) => costA.price - costB.price;
export const sortPointCostDown = (costA, costB) => costB.price - costA.price;
