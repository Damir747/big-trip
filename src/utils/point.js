const checkPriceIsNumber = (checkedPrice) => /^\d+$/.test(checkedPrice);

const findElementByValue = (value, elements, descriptionFlag) => {
	if (descriptionFlag) {
		return elements.find((el) => el.name === value)
	}
	return elements.find((el) => el.type === value).offers;
}

const updatePoint = (points, modifiedPoint) => {
	const index = points.findIndex(point => point.id === modifiedPoint.id);
	if (index === -1) {
		return points;
	}

	return [
		...points.slice(0, index),
		modifiedPoint,
		...points.slice(index + 1)
	];
}

export { checkPriceIsNumber, findElementByValue, updatePoint };