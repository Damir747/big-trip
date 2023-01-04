import AbstractView from '../framework/abstract-view.js';

const createBoardTemplate = () => `<section class="trip-events">
				<h2 class="visually-hidden">Trip events</h2>

				<!-- Сортировка -->

				<!-- Контент -->

			</section>`;

export default class BoardView extends AbstractView {
	getTemplate() {
		return createBoardTemplate();
	}
}