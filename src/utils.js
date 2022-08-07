export const findElement = (container, selector) => {
	if (container === null) {
		return null;
	}
	return container.querySelector(selector);
};

export render = (container, template, position = 'beforeend') => {
	container.insertAdjacentHTML(position, template);
}
