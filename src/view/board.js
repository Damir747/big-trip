import AbstractView from '../framework/abstract-view.js';

const createBoardTemplate = () => '<section class="trip-events"></section>';

export default class BoardView extends AbstractView {
	getTemplate() {
		return createBoardTemplate();
	}
}