
import AbstractView from '../framework/abstract-view.js';

export default class SmartView extends AbstractView {
	constructor() {
		super();
		this._state = {};
	}
	updateElement() {
		const previousElement = this.getElement();
		const parentElement = previousElement.parentElement;
		//? такой костыль при сохранении
		// trip-events__item
		if (parentElement === null) {
			return;
			// throw new Error(`Для ${previousElement.className} не найден parent`);
		}
		this.removeElement();
		const newElement = this.getElement();
		parentElement.replaceChild(newElement, previousElement);
	}
	updateData(update, justDataUpdate) {
		if (!update) {
			return;
		}
		this._point = Object.assign(
			{},
			this._point,
			update,
		);
		if (justDataUpdate) {
			return;
		}
		this.updateElement();
		this.restoreListeners();
	}
	restoreListeners() {
		throw new Error('Abstarct method not implemented: restoreListeners');
	}
}