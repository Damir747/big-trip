import AbstractView from '../framework/abstract-view.js';

const createNoPointTemplate = (activeFilter) => {
	return `<p class="trip-events__msg" style="color:black">There are no ${activeFilter} events now.<br>
	Click New Event to create your first point</p>`;
};

class NoPointView extends AbstractView {
	constructor(activeFilter) {
		super();
		this._activeFilter = activeFilter;
	}
	getTemplate() {
		return createNoPointTemplate(this._activeFilter);
	}
}

export default NoPointView;