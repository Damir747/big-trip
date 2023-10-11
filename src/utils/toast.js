const SHOW_TIME = 5000;

const toastContainerElement = document.createElement('div');
toastContainerElement.classList.add('toast-container');
document.body.append(toastContainerElement);

const toast = (message, permanent = false) => {
	const toastItemElement = document.createElement('div');
	toastItemElement.textContent = message;
	toastItemElement.classList.add('toast-container__item', 'toast-container__item--permanent');
	toastContainerElement.append(toastItemElement);
	if (!permanent) {
		setTimeout(() => {
			toastItemElement.remove();
		}, SHOW_TIME);
	}
};

const toastRemove = () => {
	const toastItemElement = toastContainerElement.querySelector('.toast-container__item--permanent');
	if (toastItemElement) {
		toastItemElement.remove();
	}
};

export { toast, toastRemove };