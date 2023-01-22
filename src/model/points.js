import Observer from "../utils/observer.js";

export default class Points extends Observer {
	constructor() {
		super();
		this._points = [];
	}
	setPoints(points) {
		this._points = points.slice();
	}
	getPoints() {
		return this._points;
	}
	updatePoint(updateType, modifiedPoint) {
		console.log('Обновляем точку маршрута', modifiedPoint);
		const index = this._points.findIndex((el) => el.id === modifiedPoint.id);
		if (index === -1) {
			throw new Error('Не удается обновить данную точку');
		}
		this._points = [
			...this._points.slice(0, index),
			modifiedPoint,
			...this._points.slice(index + 1)
		];
		this._notify(updateType, modifiedPoint);
	}
	addPoint(updateType, point) {
		this._points = [
			point,
			...this._points
		];
		this._notify(updateType, point);
	}
	deletePoint(updateType, point) {
		console.log(point);
		console.log(point.id);
		this._points = this._points.filter((el) => el.id !== point.id);
		//? Ещё может быть такой способ: найти по id и сделать slice - как в updatePoint
		this._notify(updateType);
	}
}
