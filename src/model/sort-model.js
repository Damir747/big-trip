import { DEFAULT_SORT } from "../const.js";
import Observer from "../utils/observer.js";

export default class SortModel extends Observer {
	constructor() {
		super();
		this._activeSort = DEFAULT_SORT;
		this._upSort = true;
	}

	changeUpSort() {
		this._upSort = !this._upSort;
	}
	setActiveSort(updateType, activeSort) {
		this._activeSort = activeSort;
		this._notify(updateType, activeSort, this._upSort);
	}
	getActiveSort() {
		return this._activeSort;
	}
	getUpSort() {
		return this._upSort;
	}
	setDefaultUpSort(flag = true) {
		this._upSort = flag;
	}
}
