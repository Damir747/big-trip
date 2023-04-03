import { DEFAULT_SORT } from "../const.js";
import Observer from "../utils/observer.js";

export default class SortModel extends Observer {
	constructor() {
		super();
		this._activeSort = DEFAULT_SORT;
	}

	setActiveSort(updateType, activeSort) {
		this._activeSort = activeSort;
		this._notify(updateType, activeSort);
	}

	getActiveSort() {
		return this._activeSort;
	}

}
