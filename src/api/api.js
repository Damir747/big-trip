import { Method, SuccessHTTPStatusRange } from "../const.js";
import PointsModel from "../model/point-model.js";

export default class Api {
	constructor(endPoint, authorization) {
		this._endPoint = endPoint;
		this._authorization = authorization;
	}

	getPoints() {
		return this._load({ url: 'points' })
			.then(Api.toJSON)
			.then((points) => points.map(PointsModel.adaptToClient));
	}
	getDestinations() {
		return this._load({ url: 'destinations' })
			.then(Api.toJSON)
			.then((destinations) => destinations.map(PointsModel.adaptDestinationsToClient));
	}
	getOffers() {
		return this._load({ url: 'offers' })
			.then(Api.toJSON)
			.then((offers) => offers.map(PointsModel.adaptOffersToClient));
	}

	updatePoint(point) {
		point = PointsModel.adaptOffersToServer(point);
		return this._load({
			url: `points/${point.id}`,
			method: Method.PUT,
			body: JSON.stringify(PointsModel.adaptToServer(point)),
			headers: new Headers({ 'Content-Type': 'application/json' })
		})
			.then(Api.toJSON)
			.then(PointsModel.adaptToClient);
	}
	addPoint(point) {
		point = PointsModel.adaptOffersToServer(point);
		return this._load({
			url: `points`,
			method: Method.POST,
			body: JSON.stringify(PointsModel.adaptToServer(point)),
			headers: new Headers({ 'Content-Type': 'application/json' }),
		})
			.then(Api.toJSON)
			.then(PointsModel.adaptToClient);
	}
	deletePoint(point) {
		return this._load({
			url: `points/${point.id}`,
			method: Method.DELETE,
		});
	}

	sync(data) {
		return this._load({
			url: '/points/sync',
			method: Method.POST,
			body: JSON.stringify(data),
			headers: new Headers({ 'Content-Type': 'application/json' }),
		})
			.then(Api.toJSON);
	}

	_load({
		url,
		method = Method.GET,
		body = null,
		headers = new Headers(),
	}) {
		headers.append('Authorization', this._authorization);
		return fetch(
			`${this._endPoint}/${url}`,
			{ method, body, headers },
		)
			.then(Api.checkStatus)
			.catch(Api.catchError);
	}

	static checkStatus(response) {
		if (response.status < SuccessHTTPStatusRange.MIN ||
			response.status > SuccessHTTPStatusRange.MAX) {
			throw new Error(`${response.status}: ${response.statusText}`);
		}
		return response;
	}
	static toJSON(response) {
		return response.json();
	}
	static catchError(err) {
		throw err;
	}
}
