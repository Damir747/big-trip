import { VISUALLY_HIDDEN } from '../const.js';
import { createElement } from '../utils/common.js';

const SHAKE_ANIMATION_TIMEOUT = 600;
const DURATION_MULTIPLIER = 1000;
class AbstractView {
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
	show() {
		this.getElement().classList.remove(VISUALLY_HIDDEN);
	}
	hide() {
		this.getElement().classList.add(VISUALLY_HIDDEN);
	}
	shake(callback) {
		this.getElement().style.animation = `shake ${SHAKE_ANIMATION_TIMEOUT / DURATION_MULTIPLIER}s`;
		setTimeout(() => {
			this.getElement().style.animation = '';
			callback();
		}, SHAKE_ANIMATION_TIMEOUT);
	}
}

export default AbstractView;