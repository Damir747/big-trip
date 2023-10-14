import AbstractView from '../framework/abstract-view.js';

const createNoPointTemplate = () => {
	// const filterMenu = new FilterMenu();
	// console.log(filterMenu.getElement());
	return '<p class="trip-events__msg" style="color:black">Click New Event to create your first point</p>';
	// 'There are no past events now'
	// 'There are no future events now'
};

class NoPointView extends AbstractView {
	getTemplate() {
		return createNoPointTemplate();
	}
}

export default NoPointView;