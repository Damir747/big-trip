import AbstractView from './abstract-view.js';
import { RenderPosition } from '../const.js';

/**
 * Функция для отрисовки элемента
 * @param {HTMLElement} container Элемент в котором будет отрисован компонент
 * @param {AbstractView} element Элемент, который должен был отрисован
 * @param {string} place Позиция компонента относительно контейнера. По умолчанию - `beforeend`
 */
const render = (container, element, place = RenderPosition.BEFOREEND) => {
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

/**
 * Функция для удаления компонента
 * @param {AbstractView} component Компонент, который нужно удалить
 */
const remove = (component) => {
	if (component === null || component._element === null) {
		return;
	}

	if (!(component instanceof AbstractView)) {
		throw new error('Can remove only components');
	}
	component._element.remove();
	component.removeElement();

}

/**
 * Функция для замены одного компонента на другой
 * @param {AbstractView} newComponent Компонент, который нужно показать
 * @param {AbstractView} oldComponent Компонент, который нужно скрыть
 */
const replace = (newComponent, oldComponent) => {
	if (!(newComponent instanceof AbstractView && oldComponent instanceof AbstractView)) {
		throw new Error('Can replace only components');
	}
	newComponent = newComponent.getElement();
	oldComponent = oldComponent.getElement();
	const parent = oldComponent.parentElement;
	if (parent === null || newComponent === null || oldComponent === null) {
		throw new Error('One of the replaced elements does not exist ');
	}
	parent.replaceChild(newComponent, oldComponent);
}

export { render, remove, replace };