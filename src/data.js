import dayjs from 'dayjs';

export const generatePoint = (points, destinations) => {
	// в тех.задании ничего не сказано про значения по умолчанию для новой точки
	if (points.getOffers().length === 0 || destinations.length === 0) {
		//? ошибку надо выдать, что без points/destinations невозможно создать новую точку
		let endDate = new Date();
		endDate.setDate(endDate.getDate() + 7);
		return {
			'type': 'taxi',
			'price': 0,
			'city': '',
			'start': new Date(),
			'end': endDate,
			'description': '',
			'photos': '',
			'offers': [],
			'checkedOffers': [],
			'checkedFavorite': false,
			'isPast': false,
		};
	}
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

// Проверить:
// формат времени для точки
// После выбора пункта назначения появляется блок «Destination».
// А если данные изменил другой пользователь ? Удаление или сохранение уже удаленной точки.
// Создание и редактирование точки маршрута в режиме офлайн недоступно.Единственное доступное действие — добавление точки маршрута в избранное.
// в PointView описан формат нахождения на маршруте
// похоже, неверно считает цену поездки. удаляю точки, цена отображается без опций
// время продолжительность проездки (точки) проверить формат