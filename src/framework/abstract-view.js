import { createElement } from '../utils.js';

export default class AbstractView {
	// _element = null;
	// _callback = {};
	constructor() {
		if (new.target === AbstractView) {
			throw new Error('Can\'t instantiate AbstractView, only concrete one.');
		}
		this._element = null;
		this._callback = {};
	}
	getTemplate() {
		throw new Error('AbstractView method not implemented: getTemplate');
	}
	getElement() {
		if (!this._element) {
			this._element = createElement(this.getTemplate());
		}
		return this._element;
	}
	removeElement() {
		this._element = null;
	}
}