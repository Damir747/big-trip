import dayjs from '../../node_modules/dayjs';

export const checkPriceIsNumber = (checkedPrice) => /^\d+$/.test(checkedPrice);

export const findElementByValue = (value, elements, descriptionFlag) => {
	if (descriptionFlag) {
		return elements.find((el) => el.name === value)
	}
	return elements.find((el) => el.type === value).offers;
}

export const updatePoint = (points, modifiedPoint) => {
	const index = points.findIndex(point => point.id === modifiedPoint.id);
	if (index === -1) {
		return points;
	}

	return [
		...points.slice(0, index),
		modifiedPoint,
		...points.slice(index + 1)
	];
}

const TimeFormat = {
	HOUR_PER_DAY: 1440,
	MINUTE_PER_HOUR: 60,
	MILLISECOND_PER_MINUTE: 60000,
};
const DAYS_COUNT = 10;
export const humanizeDateDuration = (tripTime) => {
	const duration = dayjs.duration(tripTime).$d;

	const day = duration.days < DAYS_COUNT ? `0${duration.days}D` : `${duration.days}D`;
	const hour = duration.hours < DAYS_COUNT ? `0${duration.hours}H` : `${duration.hours}H`;
	const minute = duration.minutes < DAYS_COUNT ? `0${duration.minutes}M` : `${duration.minutes}M`;
	const total = (tripTime / TimeFormat.MILLISECOND_PER_MINUTE) > TimeFormat.HOUR_PER_DAY ? `${day} ${hour} ${minute}` : (tripTime / TimeFormat.MILLISECOND_PER_MINUTE) > TimeFormat.MINUTE_PER_HOUR ? `${hour} ${minute}` : minute;
	return total;
};