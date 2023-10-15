import { FilterNames, DEFAULT_FILTER } from '../const.js';
import { sortPointDateUp, sortPointDateDown, sortPointTimeUp, sortPointTimeDown, sortPointCostUp, sortPointCostDown } from '../utils/sort.js';
import { SortNames } from '../const.js';
import dayjs from 'dayjs';

const getFilterPoints = (points, filterName) => {
	const filteredPoints = points.slice();
	switch (filterName) {
		case FilterNames.EVERYTHING:
			return filteredPoints;
		case FilterNames.FUTURE:
			return filteredPoints.filter(el => dayjs(el.end).diff(dayjs()) > 0);
		case FilterNames.PAST:
			return filteredPoints.filter(el => dayjs(el.start).diff(dayjs()) < 0);
		default:
			throw new Error('Unknown filterName', filterName);
	}
}

const getFilterCount = (points, filterName) => getFilterPoints(points, filterName).length;

const getFilterSortPoints = (points, filterName = DEFAULT_FILTER, sortName = sortPointDateUp, upSort = true) => {
	const filteredPoints = getFilterPoints(points, filterName);
	switch (sortName) {
		case SortNames[0].value:
			return filteredPoints.sort(upSort ? sortPointDateUp : sortPointDateDown);
		case SortNames[1].value:
			return filteredPoints;
		case SortNames[2].value:
			return filteredPoints.sort(upSort ? sortPointTimeUp : sortPointTimeDown);
		case SortNames[3].value:
			return filteredPoints.sort(upSort ? sortPointCostUp : sortPointCostDown);
		case SortNames[4].value:
			return filteredPoints;
		default:
			return filteredPoints;
	}

}

export { getFilterCount, getFilterSortPoints }