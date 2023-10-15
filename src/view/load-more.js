import AbstractView from '../framework/abstract-view';

const createLoadMoreButtonTemplate = () => '<div><button class="btn  btn--big  btn--yellow" type="button">Load More Points</button></div>';

class LoadMoreButton extends AbstractView {
	constructor() {
		super();
		this._buttonHandle = this._buttonHandle.bind(this);
	}
	getTemplate() {
		return createLoadMoreButtonTemplate();
	}

	_buttonHandle(evt) {
		this._callback.buttonHandle();
	}

	setButtonCLickListener(callback) {
		this._callback.buttonHandle = callback;
		this.getElement().addEventListener('click', this._buttonHandle);
	}
}

export default LoadMoreButton;