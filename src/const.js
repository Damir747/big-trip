const DEFAULT_POINT_COUNT = 5;
const ICON_DIRECTION = 'img/icons/';
const Method = {
	GET: 'GET',
	PUT: 'PUT',
	POST: 'POST',
	DELETE: 'DELETE',
}
const SuccessHTTPStatusRange = {
	MIN: 200,
	MAX: 299
}
const UpdateType = {
	FULL: 'FULL',
	POINTS: 'POINTS',
	PATCH: 'PATCH',
	INIT: 'INIT'
};
const UserAction = {
	UPDATE_POINT: 'UPDATE_POINT',
	ADD_POINT: 'ADD_POINT',
	DELETE_POINT: 'DELETE_POINT',
}
const DateFormat = {
	FORMAT_HOUR: 'HH:mm',
	FORMAT_FULL_DATE: 'DD/MM/YY HH:mm',
	FORMAT_DATE: 'YYYY-MM-DD',
	FORMAT_SHORT_DATE: 'MMM DD',
	FORMAT_DIF: 'HH[H] mm[M]',
	FORMAT_PICKER: 'd/m/y H:i',
	FORMAT_MDHM: 'MM[M] DD[D] HH[H] mm[M]',
	FORMAT_DHM: 'DD[D] HH[H] mm[M]',
	FORMAT_HM: 'HH[H] mm[M]',
	FORMAT_M: 'mm[M]',
}

const NO_TRIP_STOP_MESSAGE = 'Click New Event to create your first point';

const FAVORITE_ACTIVE_CLASS = 'event__favorite-btn--active';
const FilterNames = {
	EVERYTHING: 'everything',
	FUTURE: 'future',
	PAST: 'past'
};
const DEFAULT_FILTER = FilterNames.EVERYTHING;
const SortNames = [{
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
const DEFAULT_SORT = SortNames[0].value;
const TabNames = ['Table', 'Stats'];
const DEFAULT_TAB = TabNames[0];
const ACTIVE_TAB_CLASS = 'trip-tabs__btn--active';

const RenderPosition = {
	AFTERBEGIN: 'afterbegin',
	BEFOREEND: 'beforeend',
};

const Mode = {
	VIEW: 'view',
	EDIT: 'edit',
}
const EditMode = {
	NEW: 'new',
	EDIT: 'edit',
}

const EMPTY_POINT = 'EMPTY';

const EVENT_TYPE = ['taxi', 'bus', 'train', 'ship', 'transport', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];

const CUT_FILTER_NAME = 'filter-';

const ChartMode = {
	MONEY: 'money',
	TYPE: 'type',
	TIME: 'time',
};

const BAR_HEIGHT = 55;
const BACKGROUND_COLOR = '#ffffff';
const HOVER_BACKGROUND_COLOR = '#ffffff';
const ANCHOR_START = 'start';
const ANCHOR_END = 'end';
const TYPE_HORIZONTAL_BAR = 'horizontalBar';

const Container = {
	TRIP: '.page-body__container',
	TRIPINFO: '.trip-main',
	HEADER: '.page-header__container',
	TAB: '.trip-main__trip-controls',
	STAT: '.statistics',
	FILTER: '.trip-main__trip-controls',
	SORT: '.trip-events',
}

const State = {
	SAVING: 'SAVING',
	DELETING: 'DELETING',
	ABORTING: 'ABORTING',
}

const OFFER_SECTION_CLASS = '.event__section--offers';
const VISUALLY_HIDDEN = 'visually-hidden';

export {
	DEFAULT_POINT_COUNT, ICON_DIRECTION, Method, SuccessHTTPStatusRange, UpdateType, UserAction, DateFormat,
	NO_TRIP_STOP_MESSAGE, FAVORITE_ACTIVE_CLASS, FilterNames, DEFAULT_FILTER, SortNames, DEFAULT_SORT, TabNames,
	DEFAULT_TAB, ACTIVE_TAB_CLASS, RenderPosition, Mode, EditMode, EMPTY_POINT, EVENT_TYPE, CUT_FILTER_NAME, ChartMode,
	BAR_HEIGHT, BACKGROUND_COLOR, HOVER_BACKGROUND_COLOR, ANCHOR_START, ANCHOR_END, TYPE_HORIZONTAL_BAR, Container,
	State, OFFER_SECTION_CLASS, VISUALLY_HIDDEN
};
