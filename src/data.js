export const generatePoint = (points, destinations) => {
	//? читать тех.задание на предмет новой точки
	return {
		'type': points.getOffers().length > 0 ? points.getOffers()[0].title : '',
		'price': 0,
		'city': destinations.length > 0 ? destinations[0].city : '',
		'start': new Date(),
		'end': new Date(),	//? добавить день
		'description': destinations.length > 0 ? destinations[0].description : '',
		'photos': destinations.length > 0 ? destinations[0].photos : '',
		'offers': [],	//? если выставлен тип, то offers надо присвоить
		'checkedOffers': [],
		'checkedFavorite': false,
		'isPast': false,
	}
}

