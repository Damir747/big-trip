import { humanizeDate, compareTwoDates } from '../utils/common.js';
import { createOffers } from '../mock/offer-data.js';
import { CITIES, DateFormat, DIR_ICONS, EMPTY_POINT, EVENT_TYPE } from '../const.js';
import SmartView from './smart.js';
import flatpickr from 'flatpickr';
import '../../node_modules/flatpickr/dist/flatpickr.min.css';
import { firstLetterUpperCase } from '../utils/common.js';
import { orderTypes, pickElementDependOnValue, generateCities, pickElementDependOnValue2, pickElementDependOnValue3, checkPriceIsNumber } from '../data.js';
import dayjs from 'dayjs';
import he from 'he';
import { checkCityInList } from '../data.js';

const datalistCity = (city) => {
	return `<option value="${city}">`;
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

const editPointTemplate = (point) => {
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

export default class PointEditorView extends SmartView {
	constructor(point = EMPTY_POINT) {
		super();
		this._dateStart = point.start;
		this._dateEnd = point.end;

		this._pointState = PointEditorView.parsePointDataToState(point);
		this._onRollUpClick = this._onRollUpClick.bind(this);
		this._onFormSubmit = this._onFormSubmit.bind(this);
		this._onFormDelete = this._onFormDelete.bind(this);

		this._changeTypePoint = this._changeTypePoint.bind(this);
		this._onPointInput = this._onPointInput.bind(this);
		this._onDateStartChange = this._onDateStartChange.bind(this);
		this._onDateEndChange = this._onDateEndChange.bind(this);
		this._onPriceChange = this._onPriceChange.bind(this);
		this._onCheckedOffers = this._onCheckedOffers.bind(this);
		this.destroy = this.destroy.bind(this);

		this._setDatePicker(this._dateStart, true);
		this._setDatePicker(this._dateEnd);
	}
	// эти два метода нужны будут при работе с backend
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

	init() {
		console.log('Edit Component Init');
	}

	getTemplate() {
		return editPointTemplate(this._pointState);
	}
	reset(point) {
		this.updateElement(PointEditorView.parsePointDataToState(point));
	}
	resetInput(point) {
		this.updateData(PointEditorView.parsePointDataToState(point));	//? updateDate? может updateElement?
	}
	restoreListeners() {
		this._setInnerListeners();
		this.setTypePointHandler(this._callback.changeTypePoint);
		this.setModeToViewClickHandler(this._callback.onRollUpClick);
		this.setFormSubmitHandler(this._callback.onFormSubmit);
		this.setFormDeleteHandler(this._callback.onFormDelete);
		// console.log(this._dateStart);
		this._setDatePicker(this._dateStart, true);
		this._setDatePicker(this._dateEnd);
	}

	_setInnerListeners() {
		this.getElement().querySelector('.event__input--destination').addEventListener('change', this._onPointInput)
		this.getElement().querySelector('.event__input--price').addEventListener('change', this._onPriceChange);
		this.getElement().querySelector('.event__available-offers').addEventListener('change', this._onCheckedOffers);
	}

	removeElement() {
		super.removeElement();
		if (this._dateStart || this._dateEnd) {
			// this._dateStart.destroy();
			// this._dateStart = null;
			// this._dateEnd.destroy();
			// this._dateEnd = null;
		}
	}
	//? отображает только 20 точек. Надо бы сделать: или все, или с кнопкой "загрузить ещё"

	destroy() {
		this.getElement().querySelector('.event__input--destination').removeEventListener('change', this._onPointInput)
		this.getElement().querySelector('.event__input--price').removeEventListener('change', this._onPriceChange);

		this.getElement().querySelector('.event__type-group').removeEventListener('change', this._changeTypePoint);
		this.getElement().querySelector('.event__rollup-btn').removeEventListener('click', this._onRollUpClick);
		this.getElement().querySelector('form').removeEventListener('submit', this._onFormSubmit);
		this.getElement().querySelector('.event__reset-btn').removeEventListener('click', this._onFormDelete);

	}

	_onPointInput(evt) {
		evt.preventDefault();
		if (!checkCityInList(evt.target.value)) {
			evt.target.setCustomValidity(`Города ${evt.target.value} нет в списке`);
			return;
		}
		this.updateData({
			city: evt.target.value,
			description: pickElementDependOnValue2(evt.target.value, generateCities),
			photos: pickElementDependOnValue3(evt.target.value, generateCities),
		});
	}

	_onPriceChange(evt) {
		if (evt.target.tagName !== 'INPUT') {
			return;
		}
		evt.preventDefault();
		if (!checkPriceIsNumber(evt.target.value)) {
			evt.target.setCustomValidity('Цена должна быть цифрой');
			return;
		}
		this.updateData(
			{
				price: +evt.target.value
			}
		);
	}

	_changeTypePoint(evt) {
		evt.preventDefault();
		if (evt.target.tagName !== 'INPUT') {
			return;
		}
		this.updateData({
			type: evt.target.value,
			checkedOffer: pickElementDependOnValue(evt.target.value, orderTypes),
		});
	}

	setTypePointHandler(callback) {
		this._callback.changeTypePoint = callback;
		this.getElement().querySelector('.event__type-group').addEventListener('change', this._changeTypePoint);
	}

	_onRollUpClick(evt) {
		this._callback.onRollUpClick();
	}

	setModeToViewClickHandler(callback) {
		this._callback.onRollUpClick = callback;
		this.getElement().querySelector('.event__rollup-btn').addEventListener('click', this._onRollUpClick);
	}

	_onFormSubmit(evt) {
		evt.preventDefault();
		this._callback.onFormSubmit(PointEditorView.parseStateToPointData(this._pointState));
	}

	setFormSubmitHandler(callback) {
		this._callback.onFormSubmit = callback;
		this.getElement().querySelector('form').addEventListener('submit', this._onFormSubmit);
	}

	_onFormDelete(evt) {
		evt.preventDefault();
		this._callback.onFormDelete(PointEditorView.parseStateToPointData(this._pointState));
	}

	setFormDeleteHandler(callback) {
		this._callback.onFormDelete = callback;
		this.getElement().querySelector('.event__reset-btn').addEventListener('click', this._onFormDelete);
	}

	_setDatePicker(datePicker, flag) {
		if (datePicker) {
			// datePicker.destroy();
			datePicker = null;
		}
		if (flag) {
			datePicker = flatpickr(this.getElement().querySelector('#event-start-time-1'),
				{
					dateFormat: DateFormat.FORMAT_PICKER,
					defaultDate: new Date(this._pointState.start),
					onChange: this._onDateStartChange,
				},
			);
			return;
		}
		datePicker = flatpickr(this.getElement().querySelector('#event-end-time-1'),
			{
				dateFormat: DateFormat.FORMAT_PICKER,
				defaultDate: new Date(this._pointState.end),
				onChange: this._onDateEndChange,
			},
		);

	}
	_onDateStartChange(inputDate) {
		console.log(inputDate, this._pointState.end);
		if (compareTwoDates(inputDate, this._pointState.end) < 0) {
			this.updateData(
				{
					start: inputDate,
					end: inputDate,
				}
			);
			return;
		}
		this.updateData(
			{
				start: inputDate,
			}
		);
	}
	_onDateEndChange(inputDate) {
		console.log(this._pointState.start, inputDate);
		if (compareTwoDates(this._pointState.start, inputDate) < 0) {
			this.updateData(
				{
					start: inputDate,
					end: inputDate,
				}
			);
			return;
		}
		this.updateData(
			{
				end: inputDate,
			}
		);
	}

	_onCheckedOffers(evt) {
		if (evt.target.tagName !== 'INPUT') {
			return;
		}
		this._pointState.checkedOffer.filter((el) =>
			el.short === evt.target.name.replace('event-offer-', ''))[0].checked = evt.target.checked;
		// this.updateDate(
		// 	{
		// 		checkedOffer: this._pointState.checkedOffer,
		// 	}
		// );
	}
}