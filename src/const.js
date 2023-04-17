export const POINTS_COUNT = 20;	//сколько точек показывать на экране
export const GENERATED_POINTS_COUNT = 20;		// сколько точек генерировать
export const DIR_PICTURE = 'http://picsum.photos/248/152?r=';
export const DIR_ICONS = 'img/icons/';
export const MAX_RANDOM_PICTURE = 9999;
export const COUNT_PICTURE = 4;
export const UpdateType = {
	FULL: 'FULL',
	POINTS: 'POINTS',
	PATCH: 'PATCH',
};
export const UserAction = {
	UPDATE_POINT: 'UPDATE_POINT',
	ADD_POINT: 'ADD_POINT',
	DELETE_POINT: 'DELETE_POINT',
}
export const DateFormat = {
	FORMAT_HOUR: 'HH:mm',
	FORMAT_FULL_DATE: 'DD/MM/YY HH:mm',
	FORMAT_DATE: 'YYYY-MM-DD',
	FORMAT_SHORT_DATE: 'MMM DD',
	FORMAT_DIF: 'HH[H] mm[M]',
	FORMAT_PICKER: 'd/m/y H:i',
}
export const ADD_DATE = 7 * 24;
export const ADD_TIME = 600;

export const TRANSPORT = [
	{
		'title': 'Taxi',
		'price': 50,
	},
	{
		'title': 'Bus',
		'price': 10,
	},
	{
		'title': 'Train',
		'price': 30,
	},
	{
		'title': 'Ship',
		'price': 100,
	},
	{
		'title': 'Transport',
		'price': 200,
	},
	{
		'title': 'Drive',
		'price': 150,
	},
	{
		'title': 'Flight',
		'price': 300,
	}
];
export const TRIP_STOP = [
	{
		'title': 'Check-in',
		'price': 0,
	},
	{
		'title': 'Sightseeing',
		'price': 0,
	},
	{
		'title': 'Restaurant',
		'price': 0,
	}
];
export const TYPES = TRANSPORT.concat(TRIP_STOP);

export const TYPES_PICTURE = TYPES.map((el) => el.title.toLowerCase());

export const NO_TRIP_STOP_MESSAGE = "Click New Event to create your first point";
export const CITIES = ['Козова',
	'Рапла',
	'Христиансбург',
	'Стара Загора',
	'Геленджик',
	'Севилья',
	'Рио-Галльегос',
	'Кискунфелегихаза',
	'Уинта',
	'Камень-Каширский',
	'Габрово',
	'Марианна',
	'Сант-Хеленс',
	'Токушима',
	'Саут-Белмар',
	'Тилбург',
	'Пущино',
	'Радищево',
	'Зары',
	'Литтлетон']
export const PLACE_DESCRIPTION = ['Почему это место называется так, совершенно не понятно. Вообще никакого сходства с названием.',
	'Название связано с внешними особенностями этого места.',
	'Название - дословный перевод с языка актеонов, прежде живших в этих краях.',
	'Это название как-то связано с событиями полувековой давности.',
	'Самое обычное название для подобного места.',
	'Это название как-то связано с событиями полувековой давности.',
	'Аборигены называли это место совсем по другому, я даже не выговорю это словечко.',
	'Это название как-то связано с ближайшим городом.']

const destination = {
	"description": "Chamonix, is a beautiful city, a true asian pearl, with crowded streets.",
	"name": "Chamonix",
	"pictures": [
		{
			"src": "http://picsum.photos/300/200?r=0.0762563005163317",
			"description": "Chamonix parliament building"
		}
	]
}
const offer = {
	"type": TYPES,
	"offers": [
		{
			"title": "Upgrade to a business class",
			"price": 120
		},
		{
			"title": "Choose the radio station",
			"price": 60
		}
	]
}

// const OFFERS_NUMBER = 5;
// Видимо не нужно
export const POSSIBLE_OFFERS = [
	{
		title: 'Add luggage',
		short: 'luggage',
		price: 50,
		checked: false,
	},
	{
		title: 'Switch to comfort',
		short: 'comfort',
		price: 80,
		checked: false,
	},
	{
		title: 'Add meal',
		short: 'meal',
		price: 15,
		checked: false,
	},
	{
		title: 'Choose seats',
		short: 'seats',
		price: 5,
		checked: false,
	},
	{
		title: 'Travel by train',
		short: 'train',
		price: 40,
		checked: false,
	}
]

const point = {
	"base_price": 1100,
	"date_from": "2019-07-10T22:55:56.845Z",
	"date_to": "2019-07-11T11:22:13.375Z",
	// "destination": $Destination$,
	"id": "0",
	"is_favorite": false,
	"offers": [
		{
			"title": "Choose meal",
			"price": 180
		}, {
			"title": "Upgrade to comfort class",
			"price": 50
		}
	],
	"type": TYPES
}

const localPoint = {
	"base_price": 222,
	"date_from": "2019-07-10T22:55:56.845Z",
	"date_to": "2019-07-11T11:22:13.375Z",
	// "destination": $Destination$,
	"is_favorite": false,
	"offers": [
		{
			"title": "Choose meal",
			"price": 180
		},
		{
			"title": "Upgrade to comfort class",
			"price": 50
		}
	],
	"type": TYPES
}

const authorizationError = {
	"error": 401,
	"message": "Header Authorization is not correct"
}

const notFoundError = {
	"error": 404,
	"message": "Not found"
}

export const FAVORITE_ACTIVE_CLASS = 'event__favorite-btn--active';
export const FILTER_NAMES = ['everything', 'future', 'past'];
export const DEFAULT_FILTER = FILTER_NAMES[0];
export const SORT_NAMES = [{
	value: 'day',
	disabled: false,
},
{
	value: 'event',
	disabled: true,
},
{
	value: 'time',
	disabled: false,
},
{
	value: 'price',
	disabled: false,
},
{
	value: 'offer',
	disabled: true,
}];
export const DEFAULT_SORT = SORT_NAMES[0].value;
export const TAB_NAMES = ['Table', 'Stats'];
export const DEFAULT_TAB = TAB_NAMES[0];
export const ACTIVE_TAB_CLASS = 'trip-tabs__btn--active';

export const RenderPosition = {
	AFTERBEGIN: 'afterbegin',
	BEFOREEND: 'beforeend',
};

export const Mode = {
	VIEW: 'view',
	EDIT: 'edit',
}
export const EditMode = {
	NEW: 'new',
	EDIT: 'edit',
}

export const EMPTY_POINT = 'EMPTY';

export const EVENT_TYPE = ['taxi', 'bus', 'train', 'ship', 'transport', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];

export const CUT_FILTER_NAME = 'filter-';

export const ChartMode = {
	MONEY: 'money',
	TYPE: 'type',
	TIME: 'time',
};

export const BAR_HEIGHT = 55;
export const BACKGROUND_COLOR = '#ffffff';
export const HOVER_BACKGROUND_COLOR = '#ffffff';
export const ANCHOR_START = 'start';
export const ANCHOR_END = 'end';
export const TYPE_HORIZONTAL_BAR = 'horizontalBar';
