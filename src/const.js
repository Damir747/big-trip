export const POINTS_COUNT = 20;	//сколько точек показывать на экране
export const DIR_ICONS = 'img/icons/';
export const COUNT_PICTURE = 4;
export const Method = {
	GET: 'GET',
	PUT: 'PUT',
	POST: 'POST',
	DELETE: 'DELETE',
}
export const SuccessHTTPStatusRange = {
	'MIN': 200,
	'MAX': 299
}
export const UpdateType = {
	FULL: 'FULL',
	POINTS: 'POINTS',
	PATCH: 'PATCH',
	INIT: 'INIT'
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

export const NO_TRIP_STOP_MESSAGE = "Click New Event to create your first point";

// const OFFERS_NUMBER = 5;

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

export const CONTAINER = {
	'trip': '.page-body__container',
	'tripInfo': '.trip-main',
	'tripDetail': '.trip-main__trip-controls',
	'header': '.page-header__container',
	'tab': '.trip-main__trip-controls',
	'stat': '.statistics',
	'filter': '.trip-main__trip-controls',
	'sort': '.trip-events',
}
