import Observer from "../utils/observer.js";
import { utilFilterSort } from '../utils/filter.js';

//? Обратите внимание, что, если вы следовали нашим рекомендациям и выделили дополнительные опции в отдельную структуру, для них нужно завести отдельную модель и провести похожие манипуляции.
//? New Event опции считает неверно. Не учитывает отключенные опции


export default class Points extends Observer {
	constructor() {
		super();
		this._points = [];
	}
	setPoints(points) {
		this._points = points.slice();
	}
	getPoints(activeFilter, activeSort, upSort) {
		return utilFilterSort(this._points, activeFilter, activeSort, upSort);
	}
	updatePoint(updateType, modifiedPoint) {
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
		this._points = this._points.filter((el) => el.id !== point.id);
		// Ещё может быть такой способ: найти по id и сделать slice - как в updatePoint
		this._notify(updateType);
	}
}
