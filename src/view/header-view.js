import AbstractView from '../framework/abstract-view.js';

const createSectionTemplate = () => {
	return `<div class="trip-main">
				<!-- Маршрут и стоимость -->

				<div class="trip-main__trip-controls  trip-controls">
				<!-- Навигация и фильтры -->

				</div>

				<button class="trip-main__event-add-btn  btn  btn--big  btn--yellow" type="button">New event</button>
			</div>`;
}
export default class HeaderView extends AbstractView {
	getTemplate() {
		return createSectionTemplate();
	}
}