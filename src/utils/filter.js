import { FILTER_NAMES, DEFAULT_FILTER } from "../const.js";
import { sortPointDateUp, sortPointDateDown, sortPointTimeUp, sortPointTimeDown, sortPointCostUp, sortPointCostDown } from '../utils/sort.js';
import { SORT_NAMES } from '../const.js';
import dayjs from "dayjs";

const utilFilter = (points, filterName) => {
	const filteredPoints = points.slice();
	switch (filterName) {
		case FILTER_NAMES.EVERYTHING:
			return filteredPoints;
		case FILTER_NAMES.FUTURE:
			return filteredPoints.filter(el => dayjs(el.end).diff(dayjs()) > 0);
		case FILTER_NAMES.PAST:
			return filteredPoints.filter(el => dayjs(el.start).diff(dayjs()) < 0);
		default:
			throw new Error('Unknown filterName', filterName);
	}
}

export const filterCount = (points, filterName) => utilFilter(points, filterName).length;

export const utilFilterSort = (points, filterName = DEFAULT_FILTER, sortName = sortPointDateUp, upSort = true) => {
	const filteredPoints = utilFilter(points, filterName);
	switch (sortName) {
		case SORT_NAMES[0].value:
			return filteredPoints.sort(upSort ? sortPointDateUp : sortPointDateDown);
		case SORT_NAMES[1].value:
			return filteredPoints;
		case SORT_NAMES[2].value:
			return filteredPoints.sort(upSort ? sortPointTimeUp : sortPointTimeDown);
		case SORT_NAMES[3].value:
			return filteredPoints.sort(upSort ? sortPointCostUp : sortPointCostDown);
		case SORT_NAMES[4].value:
			return filteredPoints;
		default:
			return filteredPoints;
	}

}