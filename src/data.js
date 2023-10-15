import dayjs from 'dayjs';

const generatePoint = (points, destinations) => {
	return {
		'type': points.getOffers()[0].title,
		'price': 0,
		'city': destinations[0].city,
		'start': dayjs().toDate(),
		'end': dayjs().add(7, 'day').toDate(),
		'description': destinations[0].description,
		'photos': destinations[0].photos,
		'offers': points.getOfferByType(points.getOffers()[0].title),
		'checkedOffers': [],
		'checkedFavorite': false,
		'isPast': false,
	}
}

export { generatePoint };

//? А если данные изменил другой пользователь ? Удаление или сохранение уже удаленной точки.
//? Версии используемых зависимостей зафиксированы в package.json. Б19
//? нужна ли вообще генерация точки по умолчанию?