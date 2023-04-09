import { FILTER_NAMES, DEFAULT_FILTER } from "../const.js";
import { sortPointDateUp, sortPointDateDown, sortPointTimeUp, sortPointTimeDown, sortPointCostUp, sortPointCostDown } from '../utils/sort.js';
import { SORT_NAMES } from '../const.js';
import dayjs from "dayjs";

const utilFilter = (points, filterName) => {
	const filteredPoints = points.slice();
	switch (filterName) {
		case FILTER_NAMES[0]:
			return filteredPoints;
		case FILTER_NAMES[1]:
			return filteredPoints.filter((el) => dayjs(el.start).diff(dayjs()) >= 0);
		case FILTER_NAMES[2]:
			return filteredPoints.filter((el) => dayjs(el.start).diff(dayjs()) < 0);
		default:
			throw new Error('Unknown filterName', filterName);
	}
}

export const filterCount = (points, filterName) => {
	return utilFilter(points, filterName).length;
}
export const utilFilterSort = (points, filterName = DEFAULT_FILTER, sortName = sortPointDateUp) => {
	const filteredPoints = utilFilter(points, filterName);
	switch (sortName) {
		case SORT_NAMES[0].value:
			return filteredPoints.sort(sortName ? sortPointDateUp : sortPointDateDown);
		case SORT_NAMES[1].value:
			return filteredPoints;
		case SORT_NAMES[2].value:
			return filteredPoints.sort(sortName ? sortPointTimeUp : sortPointTimeDown);
		case SORT_NAMES[3].value:
			return filteredPoints.sort(sortName ? sortPointCostUp : sortPointCostDown);
		case SORT_NAMES[4].value:
			return filteredPoints;
		default:
			return filteredPoints;
	}

}