import Observer from "../utils/observer.js";
import { utilFilterSort } from '../utils/filter.js';
import Offers from "./offer-model.js";
import dayjs from 'dayjs';

//? Обратите внимание, что, если вы следовали нашим рекомендациям и выделили дополнительные опции в отдельную структуру, для них нужно завести отдельную модель и провести похожие манипуляции.

export default class Points extends Observer {
	constructor() {
		super();
		this._points = [];
	}
	init(offersModel) {
		this._offersModel = offersModel;
		console.log(this._offersModel);
	}
	setPoints(updateType, points) {
		this._points = points.slice();
		this._notify(updateType);
	}
	getPoints(activeFilter, activeSort, upSort) {
		return utilFilterSort(this._points, activeFilter, activeSort, upSort);
	}
	setOffers(offers) {
		this._offers = offers;
	}
	getOffers() {
		return this._offers;
	}
	getOffer(type) {
		return this._offers.find((el) => el.title === type);
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

	// есть parsePointDataToState в PointEditorView
	static adaptToClient(point) {
		const adaptedPoint = Object.assign(
			{},
			point,
			{
				price: point.base_price,
				start: point.date_from !== null ? new Date(point.date_from) : point.date_from,	//Object и 2023-05-03T12:01:30.656Z
				end: point.date_to !== null ? new Date(point.date_to) : point.date_to,
				id: point.id,
				checkedFavorite: point.is_favorite,
				type: point.type,
				city: point.destination.name,
				description: point.destination.description,
				photos: point.destination.pictures,
				checkedOffer: point.offers,
			}
		);

		delete adaptedPoint.base_price;
		delete adaptedPoint.date_from;
		delete adaptedPoint.date_to;
		delete adaptedPoint.is_favorite;
		delete adaptedPoint.destination;

		return adaptedPoint;
	}
	static adaptToServer(point) {
		const adaptedPoint = Object.assign(
			{},
			point,
			{
				'base_price': point.price,
				'date_from': dayjs(point.start).isValid() ? dayjs(point.start).toISOString() : null,
				'date_to': dayjs(point.end).isValid() ? dayjs(point.end).toISOString() : null,
				'id': point.id,
				'is_favorite': point.checkedFavorite,
				'type': point.type,
				'destination': {
					'name': point.city,
					'description': point.description,
					'pictures': point.photos,
				},
				'offers': point.checkedOffer,
			}
		);

		delete adaptedPoint.price;
		delete adaptedPoint.start;
		delete adaptedPoint.end;
		delete adaptedPoint.checkedFavorite;
		return adaptedPoint;
	}

	static adaptDestinationsToClient(destination) {
		const adaptedDestination = Object.assign(
			{},
			destination,
			{
				city: destination.name,
				description: destination.description,
				photos: destination.pictures,
			}
		);

		delete adaptedDestination.name;
		delete adaptedDestination.pictures;

		return adaptedDestination;
	}
}
