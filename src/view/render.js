import { RenderPosition } from '../const.js';
import AbstractView from '../framework/abstract-view.js';

export const render = (container, element, place = 'beforeend') => {
	if (container instanceof AbstractView) {
		container = container.getElement();
	}

	if (element instanceof AbstractView) {
		element = element.getElement();
	}

	switch (place) {
		case RenderPosition.AFTERBEGIN:
			container.prepend(element);
			break;
		case RenderPosition.BEFOREEND:
			container.append(element);
			break;
		default:
			throw new Error(`Unknown render position ${place}`);
	}
};
