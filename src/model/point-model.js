import Observer from "../utils/observer.js";
import { utilFilterSort } from '../utils/filter.js';
import dayjs from 'dayjs';

//? Обратите внимание, что, если вы следовали нашим рекомендациям и выделили дополнительные опции в отдельную структуру, для них нужно завести отдельную модель и провести похожие манипуляции.

export default class Points extends Observer {
	constructor() {
		super();
		this._points = [];
		this._offers = [];
	}
	setPoints(updateType, points) {
		this._points = points.slice();
		this.setAllOffers();
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
	// для всех точек делает offers под PointEditView
	// ? Ещё надо будет сделать для новой точки
	setAllOffers() {
		this._points.forEach((point) => {
			const arr = [];
			const offersByType = this._offers.filter((offer) => offer.title === point.type)[0].offers;

			offersByType.forEach((element) => {
				const obj = Object.assign(
					{},
					element,
					{ checked: point.checkedOffer.filter((elem) => elem.title === element.title).length === 1 },
				);
				arr.push(obj);
			})
			point.offers = arr;
		});
	}
	//? при смене типа точки надо обновлять все offers
	setOffer(point) {
		// console.log(point);	// неправильные
		// console.log(this._points);	// правильные
		const modifiedPoint = this._points.filter((el) => el.id === point.id);
		// console.log(modifiedPoint);
		if (modifiedPoint.length > 0) {
			modifiedPoint[0].checkedOffer = modifiedPoint[0].offers.filter((el) => {
				if (el.checked) {
					return el;
				}
			});
		}
	}

	updatePoint(updateType, modifiedPoint) {
		// точка modifiedPoint с сервера в "серверном" виде (не адаптирована под View)
		// console.log(modifiedPoint);	//? Почему в старом неадаптированном виде точка?
		// Потому что сначала идёт отправка на сервер, получение с сервера, и потом идёт обновление здесь в PointModel
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

	static adaptToClient(point) {
		const adaptedPoint = Object.assign(
			{},
			point,
			{
				price: point.base_price,
				start: point.date_from !== null ? new Date(point.date_from) : point.date_from,
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
		// delete adaptedPoint.offers;	//сохранить. offers для PointEditView, а checkedOffers для общего списка

		return adaptedPoint;
	}
	static adaptToServer(point) {
		// console.log(point);
		// console.log(point.checkedOffer);
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
		// console.log(adaptedPoint.offers);
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
	static adaptOffersToClient(offer) {
		const adaptOnlyOffers = (offers) => {
			const adaptedOffers = [];
			offers.forEach(offer => {
				const adaptedOffer = Object.assign(
					{},
					offer,
					{
						title: offer.title,
						price: offer.price,
						short: offer.title.toLowerCase().replace(/\s/g, '-'),
						checked: false,
					}
				);
				adaptedOffers.push(adaptedOffer);
			});

			return adaptedOffers;
		}

		const adaptedType = Object.assign(
			{},
			offer,
			{
				title: offer.type,
				offers: adaptOnlyOffers(offer.offers),
			}
		);

		delete adaptedType.type;

		return adaptedType;
	}
	static adaptOffersToServer(offer) {
		console.log(offer);
		const adaptedOffer = Object.assign(
			{},
			offer,
			{
				'title': offer.title,
				'price': offer.price,
			}
		);
		console.log(offer);
		return adaptedOffer;
	}

}
