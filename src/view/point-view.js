import { addListener, humanizeDate, humanizeTripTime, isOnline } from '../utils/common.js';
import { DateFormat, ICON_DIRECTION } from '../const.js';
import { getSelectedOffersTemplate } from '../utils/offer.js';
import AbstractView from '../framework/abstract-view.js';

const pointTemplate = (point) => {
	const checkedFavorite = point.checkedFavorite ? 'event__favorite-btn--active' : '';

	return `<li class="trip-events__item">
              <div class="event">
                <time class="event__date" datetime="${humanizeDate(point.start, DateFormat.FORMAT_DATE)}">${humanizeDate(point.start, DateFormat.FORMAT_SHORT_DATE)}</time>
                <div class="event__type">
                  <img class="event__type-icon" width="42" height="42" src="${ICON_DIRECTION}${point.type}.png" alt="Event type icon">
                </div>
                <h3 class="event__title">${point.type} ${point.city}</h3>
                <div class="event__schedule">
                  <p class="event__time">
                    <time class="event__start-time" datetime="${point.start}">${humanizeDate(point.start, DateFormat.FORMAT_HOUR)}</time>
                    &mdash;
                    <time class="event__end-time" datetime="${point.end}">${humanizeDate(point.end, DateFormat.FORMAT_HOUR)}</time>
                  </p>
                  <p class="event__duration">${humanizeTripTime(point.start, point.end)}</p>
                </div>
                <p class="event__price">
                  &euro;&nbsp;<span class="event__price-value">${point.price}</span>
                </p>
                <h4 class="visually-hidden">Offers:</h4>
                <ul class="event__selected-offers">
					 	${getSelectedOffersTemplate(point.checkedOffers)}
                </ul>
                <button class="event__favorite-btn ${checkedFavorite}" type="button">
                  <span class="visually-hidden">Add to favorite</span>
                  <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
                    <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
                  </svg>
                </button>

					 <button class="event__rollup-btn" type="button">
                  <span class="visually-hidden">Open event</span>
                </button>
              </div>
            </li>`;
};

class PointView extends AbstractView {
	constructor(point) {
		super();
		this._point = point;
		this._onRollUpClick = this._onRollUpClick.bind(this);
		this._onFavoriteClick = this._onFavoriteClick.bind(this);
	}
	getTemplate() {
		return pointTemplate(this._point);
	}
	_onRollUpClick() {
		this._callback.rollUpClick();
	}
	setModeToEditClickHandler(callback) {
		this._callback.rollUpClick = callback;
		addListener(this.getElement(), '.event__rollup-btn', 'click', this._onRollUpClick);
	}
	_onFavoriteClick() {
		this._callback.favoriteClick();
	}
	setFavoriteClickHandler(callback) {
		this._callback.favoriteClick = callback;
		addListener(this.getElement(), '.event__favorite-btn', 'click', this._onFavoriteClick);
	}

}

export default PointView;