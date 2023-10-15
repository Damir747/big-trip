import { DEFAULT_FILTER } from '../const.js';
import Observer from '../utils/observer.js';

class FilterModel extends Observer {
	constructor() {
		super();
		this._activeFilter = DEFAULT_FILTER;
	}

	setActiveFilter(updateType, activeFilter) {
		this._activeFilter = activeFilter;
		this._notify(updateType, activeFilter);
	}

	getActiveFilter() {
		return this._activeFilter;
	}
}

export default FilterModel;