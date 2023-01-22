import { FILTER_NAMES } from "../const.js";
import dayjs from "dayjs";

export const utilFilter = (points, filterName) => {
	switch (filterName) {
		case FILTER_NAMES[0]:
			return points;
		case FILTER_NAMES[1]:
			return points.filter((el) => dayjs(el.start).diff(dayjs()) >= 0);
		case FILTER_NAMES[2]:
			return points.filter((el) => dayjs(el.start).diff(dayjs()) < 0);
		default:
			throw new Error('Unknown filterName', filterName);
	}
}