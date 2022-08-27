export const findElement = (container, selector) => {
	if (container === null) {
		return null;
	}
	return container.querySelector(selector);
};

export const render = (container, template, position = 'beforeend') => {
	console.log(container);
	console.log(position);
	console.log(template);
	container.insertAdjacentHTML(position, template);
};
