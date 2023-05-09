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
	//? а при смене типа точки цена должна ли меняться?
	getOffers() {
		return this._offers;
	}
	// Изменить/установить offers для точки.
	// Актуально: при смене типа точки. И при отрисовке PointEditorView(type по умолчанию равен type точки)
	getOffer(point, type = point.type) {
		this.setOffer(point);
		return this._offers.find((el) => el.title === type).offers;
	}
	setOffer(point) {
		const index = this._points.findIndex(el => el.id === point.id);
		if (index === -1) {
			return;
		}
		//? вероятно, лучше заменить filter на findIndex
		const offersByType = this._offers.filter((offer) => offer.title === this._points[index].type)[0].offers;
		console.log(offersByType);
		const arr = [];
		offersByType.forEach((element) => {
			const obj = Object.assign(
				{},
				element,
				{ checked: this._points[index].checkedOffers.filter((elem) => elem.title === element.title).length === 1 },
			);
			arr.push(obj);
		});
		this._points[index].offers = arr;
	}
	// для всех точек делает offers под PointEditView
	// ? Ещё надо будет сделать для новой точки
	// ? если изменил тип точки, выбрал опции, сохранил, открыл, отображаются только выбранные опции. Надо подгружать все.
	setAllOffers() {
		this._points.forEach((point) => {
			const arr = [];
			// ? при перезагрузке страницы F5 выдает ошибку
			const offersByType = this._offers.filter((offer) => offer.title === point.type)[0].offers;

			offersByType.forEach((element) => {
				const obj = Object.assign(
					{},
					element,
					{ checked: point.checkedOffers.filter((elem) => elem.title === element.title).length === 1 },
				);
				arr.push(obj);
			});
			point.offers = arr;
		});
	}
	//? при смене типа точки надо обновлять все offers
	setCheckedOffer(point) {
		const modifiedPoint = this._points.filter((el) => el.id === point.id);
		if (modifiedPoint.length > 0) {
			modifiedPoint[0].checkedOffers = modifiedPoint[0].offers.filter((el) => {
				if (el.checked) {
					return el;
				}
			});
		}
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
		console.log(adaptedPoint);
		return adaptedPoint;
	}

}
