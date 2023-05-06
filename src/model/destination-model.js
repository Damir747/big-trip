import Observer from "../utils/observer.js";

export default class Destinations extends Observer {
	constructor() {
		super();
		this._destinations = [];
	}
	setDestinations(destinations) {
		this._destinations = destinations;
	}
	getDestinations() {
		return this._destinations;
	}
	getDestination(idDestination) {
		return this._destinations.slice()[idDestination];
	}
}