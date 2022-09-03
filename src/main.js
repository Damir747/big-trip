import { markup, points } from './const.js';
import { findElement, render } from './utils.js';

markup.forEach(element => {
	for (let i = 1; i <= element.count; i++) {
		render(findElement(document, element.container), element.fn(points), element.position);
	}
});
