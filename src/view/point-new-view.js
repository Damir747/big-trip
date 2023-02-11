import { humanizeDate } from '../utils/common.js';
import { CITIES, DateFormat, DIR_ICONS, EVENT_TYPE } from '../const.js';
import { createOffers } from '../mock/offer-data.js';
import { selectedOffers } from '../mock/offer-data.js';
import SmartView from './smart.js';
import { firstLetterUpperCase } from '../utils/common.js';
import he from 'he';
import dayjs from 'dayjs';

const datalistCity = (city) => {
	return `<option value="${city}"></option>`
}
const datalistCities = (cities) => {
	let citiesList = "";
	cities.forEach((el) => citiesList += datalistCity(el));
	return citiesList;
}
const eventPhotoTemplate = (el) => `<img class="event__photo" src="${el}" alt="Event photo">`;
const eventTypeTemplate = (eventType, checkedType) => {
	return `<div class="event__type-item">
                          <input id="event-type-${eventType}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${eventType}" ${checkedType ? 'checked' : ''}>
                          <label class="event__type-label  event__type-label--${eventType}" for="event-type-${eventType}-1">${firstLetterUpperCase(eventType)}</label>
                        </div>
`
}
const newPointTemplate = (point) => {
	let photosList = "";
	point.photos.forEach((el) => photosList += eventPhotoTemplate(el));
	let eventTypeList = "";
	EVENT_TYPE.forEach((el) => eventTypeList += eventTypeTemplate(el, (el === point.type.toLowerCase())));
	return `<li class="trip-events__item">
              <form class="event event--edit" action="#" method="post">
                <header class="event__header">
                  <div class="event__type-wrapper">
                    <label class="event__type  event__type-btn" for="event-type-toggle-1">
                      <span class="visually-hidden">Choose event type</span>
                      <img class="event__type-icon" width="17" height="17" src="${DIR_ICONS}${point.type}.png" alt="Event type icon">
                    </label>
                    <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

                    <div class="event__type-list">
                      <fieldset class="event__type-group">
                        <legend class="visually-hidden">Event type</legend>

                        ${eventTypeList}
                      </fieldset>
                    </div>
                  </div>

                  <div class="event__field-group  event__field-group--destination">
                    <label class="event__label  event__type-output" for="event-destination-1">
                      ${point.type[0].toUpperCase() + point.type.slice(1)}
                    </label>
                    <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${he.decode(point.city)}" list="destination-list-1">
                    <datalist id="destination-list-1">
                      ${datalistCities(CITIES)}
                    </datalist>
                  </div>

                  <div class="event__field-group  event__field-group--time">
                    <label class="visually-hidden" for="event-start-time-1">From</label>
                    <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${humanizeDate(point.start, DateFormat.FORMAT_FULL_DATE)}">
                    &mdash;
                    <label class="visually-hidden" for="event-end-time-1">To</label>
                    <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${humanizeDate(point.end, DateFormat.FORMAT_FULL_DATE)}">
                  </div>

                  <div class="event__field-group  event__field-group--price">
                    <label class="event__label" for="event-price-1">
                      <span class="visually-hidden">Price</span>
                      &euro;
                    </label>
                    <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${point.price}">
                  </div>

                  <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
                  <button class="event__reset-btn" type="reset">Delete</button>
                  <button class="event__rollup-btn" type="button">
                    <span class="visually-hidden">Open event</span>
                  </button>
                </header>
                <section class="event__details">
                  <section class="event__section  event__section--offers">
                    <h3 class="event__section-title  event__section-title--offers">Offers</h3>

                    <div class="event__available-offers">
								${createOffers(point.checkedOffer)}
                    </div>
                  </section>

                  <section class="event__section  event__section--destination">
                    <h3 class="event__section-title  event__section-title--destination">Destination</h3>
                    <p class="event__destination-description">${point.description}</p>

                    <div class="event__photos-container">
                      <div class="event__photos-tape">
                        ${photosList}
                      </div>
                    </div>
						</section>
                </section>
              </form>
            </li>`;
};

export default class PointNewView extends SmartView {
	constructor(point) {
		super();
		this._pointState = PointNewView.parsePointDataToState(point);
		this._onNewEventClick = this._onNewEventClick.bind(this);
		this._onFormSubmit = this._onFormSubmit.bind(this);
		this._onFormDelete = this._onFormDelete.bind(this);
	}
	static parsePointDataToState(pointData) {
		return Object.assign(
			{},
			pointData,
		);
	}
	static parseStateToPointData(state) {
		return Object.assign(
			{},
			state,
		);
	}
	getTemplate() {
		return newPointTemplate(this._pointState);
	}

	_onNewEventClick() {
		this._callback.onNewEventClick();
	}

	setModeToEditClickHandler(callback) {
		this._callback.onNewEventClick = callback;
		//? надо будет сделать в Board или в более глобальном
		document.querySelector('.trip-main__event-add-btn').addEventListener('click', this._onNewEventClick);
	}

	_onFormSubmit(evt) {
		evt.preventDefault();
		this._callback.onFormSubmit(PointNewView.parseStateToPointData(this._pointState));
	}

	setFormSubmitHandler(callback) {
		this._callback.onFormSubmit = callback;
		this.getElement().querySelector('.event--edit').addEventListener('submit', this._onFormSubmit);
	}

	_onFormDelete(evt) {
		evt.preventDefault();
		this._callback.onFormDelete(PointNewView.parseStateToPointData(this._pointState));
	}

	setFormDeleteHandler(callback) {
		this._callback.onFormDelete = callback;
		this.getElement().querySelector('.event__reset-btn').addEventListener('click', this._onFormDelete);
	}

}