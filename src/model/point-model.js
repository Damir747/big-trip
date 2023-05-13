import Observer from "../utils/observer.js";
import { utilFilterSort } from '../utils/filter.js';
import dayjs from 'dayjs';

//? Обратите внимание, что, если вы следовали нашим рекомендациям и выделили дополнительные опции в отдельную структуру, для них нужно завести отдельную модель и провести похожие манипуляции.
//? а при смене типа точки цена должна ли меняться?

export default class PointsModel extends Observer {
	constructor() {
		super();
		this._points = [];
		this._offers = [];
	}
	setPoints(updateType, points) {
		this._points = points;
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
	// Изменить/установить/вернуть offers для точки.
	// Актуально: при смене типа точки. И при отрисовке PointEditorView(type по умолчанию равен type точки)

	//? Ещё надо будет сделать для новой точки
	getOfferByType(type) {
		const indexType = this._offers.findIndex((offer) => offer.title === type);
		if (indexType === -1) {
			return;
		}
		const offersByType = this._offers[indexType].offers;
		const arr = [];
		offersByType.forEach((element) => {
			const obj = Object.assign(
				{},
				element,
				{ checked: false },
			);
			arr.push(obj);
		});
		return arr;
	}

	getOffer(point) {
		const index = this._points.findIndex(el => el.id === point.id);
		if (index === -1) {
			return;
		}
		const indexType = this._offers.findIndex((offer) => offer.title === this._points[index].type);
		if (indexType === -1) {
			return;
		}
		const offersByType = this._offers[indexType].offers;
		const arr = [];
		offersByType.forEach((element) => {
			const obj = Object.assign(
				{},
				element,
				{ checked: this._points[index].checkedOffers.findIndex(elem => elem.title === element.title) !== -1 },
			);
			arr.push(obj);
		});
		this._points[index].offers = arr;
		return this._points[index].offers;
		//? для смены типа точки теперь не работает
	}
	setCheckedOffer(point) {
		const index = this._points.findIndex(el => el.id === point.id);
		if (index === -1) {
			return;
		}
		point.checkedOffers = [];
		console.log(point.offers);
		this._points[index].checkedOffers = [];
		point.offers.forEach(el => {
			if (el.checked) {
				this._points[index].checkedOffers.push(el);
			}
		});
	}

	updatePoint(updateType, modifiedPoint) {
		const index = this._points.findIndex(el => el.id === modifiedPoint.id);
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
		this._points = this._points.filter(el => el.id !== point.id);
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
				checkedOffers: point.offers,
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
				'offers': point.checkedOffers,
			}
		);
		delete adaptedPoint.price;
		delete adaptedPoint.start;
		delete adaptedPoint.end;
		delete adaptedPoint.checkedFavorite;
		delete adaptedPoint.checkedOffers;

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
	static adaptOffersToServer(point) {
		const arr = [];
		point.offers.forEach(el => {
			if (el.checked) {
				arr.push(el);
			}
		});
		const adaptedPoint = Object.assign(
			{},
			point,
			{
				'checkedOffers': arr,
			}
		);
		delete adaptedPoint.offers;

		return adaptedPoint;
	}

}
