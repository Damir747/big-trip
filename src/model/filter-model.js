import { ACTIVE_FILTER } from "../const.js";
import Observer from "../utils/observer.js";

export default class FilterModel extends Observer {
	constructor() {
		super();
		this._activeFilter = ACTIVE_FILTER;
	}

	setActiveFilter(updateType, activeFilter) {
		this._activeFilter = activeFilter;
		this._notify(updateType, activeFilter);
	}

	getActiveFilter() {
		return this._activeFilter;
	}

}
