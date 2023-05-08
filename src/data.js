export const generatePoint = () => {
	// const point = generatePointTypes();
	// const date = generateDate();
	// const town = generateCities[getRandomPositiveInteger(0, TYPES.length - 1)];

	return {
		'id': nanoid(),
		'type': point.title,
		'price': point.price,
		'city': town.city,
		'start': date.start,
		'end': date.end,
		'description': town.description,
		'photos': town.photos,
		'checkedOffers': generateOrders(point.title),
		'checkedFavorite': checkedFavorite(),
		'isPast': date.start < new Date()
	}
}

