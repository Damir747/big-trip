import { ChartMode } from '../const.js';
import { compareTwoDates, sortByDecreasing } from '../utils/common.js';

const getSortedData = (points, uniqueTypes, chartMode) => {
	const data = {};

	uniqueTypes.forEach((type) => data[type] = 0);
	switch (chartMode) {
		case ChartMode.MONEY:
			points.forEach((point) => data[point.type] += point.price);
			break;
		case ChartMode.TYPE:
			points.forEach((point) => data[point.type]++);
			break;
		case ChartMode.TIME:
			points.forEach((point) => data[point.type] += compareTwoDates(point.end, point.start));
			break;
		default:
			throw new Error('Unknown chartMode');
	}
	const sortedData = Object.entries(data).slice().sort(sortByDecreasing);

	const transferToObject = (previousObject, [type, value]) => {
		return Object.assign(
			previousObject,
			previousObject.types.push(type.toUpperCase()),
			previousObject.values.push(value),
		);
	};
	return sortedData.reduce(transferToObject, { types: [], values: [] });
};

export { getSortedData };