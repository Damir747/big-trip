import AbstractView from '../framework/abstract-view.js';

const createPointListTemplate = () => `<ul class="trip-events__list"></ul>`;

export default class PointListView extends AbstractView {
	getTemplate() {
		return createPointListTemplate();
	}
}