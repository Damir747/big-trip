import PointModel from '../model/point-model.js'
import { isOnline } from '../utils/common.js';

const getSyncedPoints = (items) => {
	return items.filter(({ success }) => success)
		.map(({ payload }) => payload.point);
}

const createStoreStructure = (items) => {
	return items.reduce((acc, current) => {
		return Object.assign({}, acc, {
			[current.id]: current,
		});
	}, {});
}

export default class Provider {
	constructor(api, store) {
		this._api = api;
		this._store = store;
	}
	getPoints() {
		if (isOnline()) {
			return this._api.getPoints()
				.then((points) => {
					const items = createStoreStructure(points.map(PointModel.adaptToServer));
					this._store.setItems(items);
					return points;
				})
		}
		const storePoints = Object.values(this._store.getItems());
		return Promise.resolve(storePoints.map(PointModel.adaptToClient));
	}
	updatePoints(point) {
		if (isOnline) {
			return this._api.updatePoints(point)
				.then((updatedPoint) => {
					this._store.setItem(updatedPoint.id, PointModel.adaptToServer(updatedPoint));
					return updatedPoint;
				})
		}
		this._store.setItem(point.id, PointModel.adaptToServer(Object.assign({}, point)));
		return Promise.resolve(point);
	}
	addPoint(point) {
		if (isOnline) {
			return this._api.addPoint(point)
				.then((newPoint) => {
					this._store.setItem(newPoint.id, PointModel.adaptToServer(newPoint))
					return newPoint;
				});
		}
		return Promise.reject(new Error('Add point failed'));
	}
	deletePoint(point) {
		if (isOnline) {
			return this._api.deletePoint(point)
				.then(() =>
					this._store.removeItem(point.id));
		}
		return Promise.reject(new Error('Delete point failed'));
	}
	sync() {
		if (isOnline) {
			const storePoints = Object.values(this._store.getItems());
			return this._api.sync(storePoints)
				.then((response) => {
					const createdPoints = getSyncedPoints(response.created);
					const updatedPoints = getSyncedPoints(response.updated);

					const items = createStoreStructure([...createdPoints, ...updatedPoints]);

					this._store.setItems(items);
				});
		}
		return Promise.reject(new Error('sync data failed'));
	}
}
