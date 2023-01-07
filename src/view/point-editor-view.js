import { humanizeDate } from '../utils.js';
import { createOffers } from '../mock/offer-data.js';
import { DateFormat, DIR_ICONS, EMPTY_POINT } from '../const.js';
import SmartView from './smart.js';
import flatpickr from 'flatpickr';
import '../../node_modules/flatpickr/dist/flatpickr.min.css';
import { isEscapeEvent } from '../utils/common.js';

const editPointTemplate = (point) => {
	let photosList = "";
	point.photos.forEach((el) => photosList += `<img class="event__photo" src="${el}" alt="Event photo">`);
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

                        <div class="event__type-item">
                          <input id="event-type-taxi-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="taxi">
                          <label class="event__type-label  event__type-label--taxi" for="event-type-taxi-1">Taxi</label>
                        </div>

                        <div class="event__type-item">
                          <input id="event-type-bus-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="bus">
                          <label class="event__type-label  event__type-label--bus" for="event-type-bus-1">Bus</label>
                        </div>

                        <div class="event__type-item">
                          <input id="event-type-train-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="train">
                          <label class="event__type-label  event__type-label--train" for="event-type-train-1">Train</label>
                        </div>

                        <div class="event__type-item">
                          <input id="event-type-ship-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="ship">
                          <label class="event__type-label  event__type-label--ship" for="event-type-ship-1">Ship</label>
                        </div>

                        <div class="event__type-item">
                          <input id="event-type-transport-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="transport">
                          <label class="event__type-label  event__type-label--transport" for="event-type-transport-1">Transport</label>
                        </div>

                        <div class="event__type-item">
                          <input id="event-type-drive-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="drive">
                          <label class="event__type-label  event__type-label--drive" for="event-type-drive-1">Drive</label>
                        </div>

                        <div class="event__type-item">
                          <input id="event-type-flight-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="flight" checked>
                          <label class="event__type-label  event__type-label--flight" for="event-type-flight-1">Flight</label>
                        </div>

                        <div class="event__type-item">
                          <input id="event-type-check-in-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="check-in">
                          <label class="event__type-label  event__type-label--check-in" for="event-type-check-in-1">Check-in</label>
                        </div>

                        <div class="event__type-item">
                          <input id="event-type-sightseeing-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="sightseeing">
                          <label class="event__type-label  event__type-label--sightseeing" for="event-type-sightseeing-1">Sightseeing</label>
                        </div>

                        <div class="event__type-item">
                          <input id="event-type-restaurant-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="restaurant">
                          <label class="event__type-label  event__type-label--restaurant" for="event-type-restaurant-1">Restaurant</label>
                        </div>
                      </fieldset>
                    </div>
                  </div>

                  <div class="event__field-group  event__field-group--destination">
                    <label class="event__label  event__type-output" for="event-destination-1">
                      ${point.type[0].toUpperCase() + point.type.slice(1)}
                    </label>
                    <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${point.city}" list="destination-list-1">
                    <datalist id="destination-list-1">
                      <option value="${point.city}"></option>
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

// ? Не работают:
// Save и Delete - не удается найти id записи
// Escape
export default class PointEditorView extends SmartView {
	constructor(point = EMPTY_POINT) {
		super();
		this._pointState = PointEditorView.parsePointDataToState(point);
		this._editClikcHandler = this._editClikcHandler.bind(this);
		this._editFormSubmit = this._editFormSubmit.bind(this);
		this._editFormDelete = this._editFormDelete.bind(this);
		this._changeTypePoint = this._changeTypePoint.bind(this);
		this._onPointInput = this._onPointInput.bind(this);
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
		return editPointTemplate(this._pointState);
	}
	reset(point) {
		this.updateElement(PointEditorView.parsePointDataToState(point));
	}
	resetInput(point) {
		this.updateDate(PointEditorView.parsePointDataToState(point));	//? updateDate? может updateElement?
	}
	restoreListeners() {
		this.getElement().querySelector('.event--edit').addEventListener('submit', this._onPointInput);
		// setPointInputHandler(this._callback.onPointInput);
		this.getElement().querySelector('.event__type-btn').addEventListener('change', this._changeTypePoint);
		// setTypePointHandler(this._callback.changeTypePoint);
		this.getElement().querySelector('.event__rollup-btn').addEventListener('click', this._editClikcHandler);
		// setEditClickHandler(this._callback.editClick);
		this.getElement().querySelector('.event__save-btn').addEventListener('click', this._editFormSubmit);
	}
	_onPointInput() {
		this._callback.onPointInput();
	}
	setPointInputHandler(callback) {
		this._callback.onPointInput = callback;
		this.getElement().querySelector('.event--edit').addEventListener('submit', this._onPointInput);
	}
	_changeTypePoint(evt) {
		// evt.preventDefault();
		console.log('event__type-btn');
		this._callback.changeTypePoint();
	}

	setTypePointHandler(callback) {
		this._callback.changeTypePoint = callback;
		this.getElement().querySelector('.event__type-btn').addEventListener('change', this._changeTypePoint);
	}

	_editClikcHandler(evt) {
		evt.preventDefault();
		this._callback.editClick();
	}

	setModeToViewClickHandler(callback) {
		this._callback.editClick = callback;
		this.getElement().querySelector('.event__rollup-btn').addEventListener('click', this._editClikcHandler);
	}

	_editFormSubmit(evt) {
		evt.preventDefault();
		this._callback.submitFormClick(PointEditorView.parseStateToPointData(this._pointState));
	}

	setFormSubmitHandler(callback) {
		this._callback.submitFormClick = callback;
		this.getElement().querySelector('.event__save-btn').addEventListener('click', this._editFormSubmit);
	}

	_editFormDelete(evt) {
		evt.preventDefault();
		this._callback.deleteFormClick();
	}

	setFormDeleteHandler(callback) {
		this._callback.deleteFormClick = callback;
		this.getElement().querySelector('.event__reset-btn').addEventListener('click', this._editFormDelete);
	}

	_setDatepicker() {

	}
}