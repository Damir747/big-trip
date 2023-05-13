export const generatePoint = (points, destinations) => {
	// в тех.задании ничего не сказано про значения по умолчанию для новой точки
	let endDate = new Date();
	endDate.setDate(endDate.getDate() + 7);
	if (points.getOffers().length === 0 || destinations.length === 0) {
		//? ошибку надо выдать, что без points/destinations невозможно создать новую точку
		return {
			'type': '',
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
		'start': new Date(),
		'end': endDate,
		'description': destinations[0].description,
		'photos': destinations[0].photos,
		'offers': points.getOfferByType(points.getOffers()[0].title),
		'checkedOffers': [],
		'checkedFavorite': false,
		'isPast': false,
	}
}

// 8.13.Пришёл, увидел, загрузил(часть 1):
// destinations - видимо, не подгружаются данные
// логика при незагрузке каких - то данных
// 8.14.Пришёл, увидел, загрузил(часть 2):
// проверить, что при отключенной сети добавление, редактирование, удаление отрабатывает корректно
// Обратная связь - реализовать
// Проверить:
// После выбора пункта назначения появляется блок «Destination».
// 	Сортировка.Посмотреть оранжевую точку, заменить её на стрелку или треугольник, показывающий порядок сортировки
// А если данные изменил другой пользователь ? Удаление или сохранение уже удаленной точки.
// Создание и редактирование точки маршрута в режиме офлайн недоступно.Единственное доступное действие — добавление точки маршрута в избранное.
// в PointView описан формат нахождения на маршруте