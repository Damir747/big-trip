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
	console.log(dateA.start);
	return dayjs(dateA.start).diff(dayjs(dateB.start));
}

export const sortPointTimeUp = (timeA, timeB) => {
	const weight = getWeightForNullDate(timeA.dueDate, timeB.dueDate);
	if (weight !== null) {
		return weight;
	}
	const timerOfTripA = timeA.end.diff(timeA.start);
	const timerOfTripB = timeB.end.diff(timeB.start);

	return dayjs(timerOfTripA).diff(dayjs(timerOfTripB));

}

export const sortPointCostUp = (costA, costB) => costB.price - costA.price;