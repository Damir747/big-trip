import { DEFAULT_TAB } from "../const.js";
import Observer from "../utils/observer.js";

export default class TabModel extends Observer {
	constructor() {
		super();
		this._activeTab = DEFAULT_TAB;
	}

	setActiveTab(updateType, activeTab) {
		this._activeTab = activeTab;
		this._notify(updateType, activeTab);
	}

	getActiveTab() {
		return this._activeTab;
	}

}
