export const isEscapeEvent = (evt) => {
	return (evt.key === ('Escape' || 'Esc'));
}

export const updatePoint = (points, modifiedPoint) => {
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