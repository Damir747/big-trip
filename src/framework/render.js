import AbstractView from './abstract-view.js';

export const remove = (component) => {
	if (component === null) {
		return;
	}

	if (!(component instanceof AbstractView)) {
		throw new error('Can remove only components');
	}
	component._element.remove();
	component.removeElement();

}
export const replace = (newComponent, oldComponent) => {
	if (!(newComponent instanceof AbstractView && oldComponent instanceof AbstractView)) {
		throw new Error('Can replace only components');
	}
	const parent = oldComponent._element.parentElement;
	if (parent === null) {
		throw new Error('Parent element is not find');
	}
	parent.replaceChild(newComponent._element, oldComponent._element);
}