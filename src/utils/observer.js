export default class Observer {
	constructor() {
		this._observers = [];
	}
	addObserver(observer) {
		this._observers.push(observer);
	}
	removeObsever(observer) {
		this._observers = this._observers.filter((observerItem) => observerItem !== observer);
	}
	_notify(event, payload) {
		this._observers.forEach((observer) => observer(event, payload));
	}
}