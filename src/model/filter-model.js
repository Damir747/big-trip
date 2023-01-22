import { FILTER_NAMES } from "../const.js";
import Observer from "../utils/observer.js";

export default class FilterModel extends Observer() {
	constructor() {
		super();
		this._activeFilter = FILTER_NAMES[0];
	}

	setActiveFilter(updateType, activeFilter) {
		this._activeFilter = activeFilter;
		this._notify(updateType, activeFilter);
	}

	getActiveFilter() {
		return this._activeFilter;
	}


}