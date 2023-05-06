
import AbstractView from '../framework/abstract-view.js';

export default class SmartView extends AbstractView {
	constructor() {
		super();
		this._state = {};
	}
	updateElement() {
		const previousElement = this.getElement();
		const parentElement = previousElement.parentElement;
		console.log(parentElement);
		if (parentElement === null) { return; }	//? такой костыль при сохранении
		this.removeElement();
		const newElement = this.getElement();
		parentElement.replaceChild(newElement, previousElement);
	}
	updateData(update, justDataUpdate) {
		if (!update) {
			return;
		}
		this._pointState = Object.assign(
			{},
			this._pointState,
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