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
	const arr = points.getOffers().find((el) => el.title === points.getOffers()[0].title).offers;
	arr.forEach(el => {
		console.log(el.checked);
	});
	console.log(points.getOffers());
	const a = points.getOffers().find((el) => el.title === points.getOffers()[0].title).offers;
	console.log(a);
	const b = a.slice();
	console.log(b);
	return {
		'type': points.getOffers()[0].title,
		'price': 0,
		'city': destinations[0].city,
		'start': new Date(),
		'end': endDate,
		'description': destinations[0].description,
		'photos': destinations[0].photos,
		'offers': points.getOffers().find((el) => el.title === points.getOffers()[0].title).offers.slice(),
		'checkedOffers': [],
		'checkedFavorite': false,
		'isPast': false,
	}
}

//? при создании ещё одной точки в каком-то offers что-то выбрано
// 8.13.Пришёл, увидел, загрузил(часть 1):
// прикруить destinations к полю точки
// логика при незагрузке каких - то данных
// Вспомогательные:
// новая точка: читать тех.задание
// в дополнение к findElement сделать addEventListener - addListener(4 параметра)
// 8.14.Пришёл, увидел, загрузил(часть 2):
// проверить, что при отключенной сети добавление, редактирование, удаление отрабатывает корректно
// Обратная связь - реализовать
// Проверить:
// Для некоторых типов точек дополнительные опции могут отсутствовать.В этом случае контейнер для вывода дополнительных опций не отображается.
// После выбора пункта назначения появляется блок «Destination».
// блок с дополнительными опциями перерисовывается, если у нового выбранного типа точки есть опции; или скрывается, если опций нет.
// Если информация о пункте назначения отсутствует, блок «Destination» не отображается.
// (Это актуально, как для новой точки, так и для старой, если данные с сервера не получены.)
// Точки маршрута, у которых дата начала меньше текущей даты, а дата окончания — больше, отображаются во всех трёх списках: Everything, Future и Past.
// 	Сортировка.Посмотреть оранжевую точку, заменить её на стрелку или треугольник, показывающий порядок сортировки
// При(смене фильтра или) переключении с экрана со списком точек маршрута на экран статистики и обратно сортировка сбрасывается на состояние «Day».
// А если данные изменил другой пользователь ? Удаление или сохранение уже удаленной точки.
// Если городов больше 3 - х, то в наименовании маршрута отображается первый и последний город, разделённые многоточием: «Amsterdam —... — Chamonix».
// Создание и редактирование точки маршрута в режиме офлайн недоступно.Единственное доступное действие — добавление точки маршрута в избранное. 