import { humanizeDate, compareTwoDates, findElement } from '../utils/common.js';
import { createOffers } from '../utils/offer.js';
import { DateFormat, DIR_ICONS, EMPTY_POINT, EVENT_TYPE, EditMode } from '../const.js';
import SmartView from './smart.js';
import flatpickr from 'flatpickr';
import '../../node_modules/flatpickr/dist/flatpickr.min.css';
import { firstLetterUpperCase } from '../utils/common.js';
import { checkPriceIsNumber } from '../utils/point.js';
import he from 'he';
import { render } from './render.js';

const datalistCity = (city) => {
	return `<option value="${city}">`;
}
const datalistCities = (destinations) => {
	let citiesList = "";
	// console.log(destinations);
	destinations.forEach((el) => citiesList += datalistCity(el.city));
	// console.log(citiesList);
	return citiesList;
}
const eventPhotoTemplate = (el) => `<img class="event__photo" src="${el.src}" alt="${el.description}">`;
const eventTypeTemplate = (eventType, checkedType, isDisabled) => {
	return `<div class="event__type-item">
                          <input id="event-type-${eventType}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${eventType}" ${checkedType ? 'checked' : ''}  ${isDisabled ? 'disabled' : ''}>
                          <label class="event__type-label  event__type-label--${eventType}" for="event-type-${eventType}-1">${firstLetterUpperCase(eventType)}</label>
                        </div>
`
}
//? isDisabled не доделан
const editPointTemplate = (point, editMode, destinations, isDisabled) => {
	let photosList = "";
	point.photos.forEach((el) => {
		el.src = el.src.replace('http://', 'https://');
		photosList += eventPhotoTemplate(el);
	});
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
                      ${firstLetterUpperCase(point.type)}
                    </label>
                    <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${he.decode(point.city)}" list="destination-list-1">
                    <datalist id="destination-list-1">
                      ${datalistCities(destinations)}
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

                  <button class="event__save-btn  btn  btn--blue" type="submit" ${isDisabled ? 'disabled' : ''}>${isDisabled ? 'Saving...' : 'Save'}</button>
                  <button class="event__reset-btn" type="reset"  ${isDisabled ? 'disabled' : ''}>${editMode === EditMode.EDIT ? (isDisabled ? 'Deleting...' : 'Delete') : 'Cancel'}</button>
                  <button class="event__rollup-btn" type="button">
                    <span class="visually-hidden">Open event</span>
                  </button>
                </header>
                <section class="event__details">
                  <section class="event__section  event__section--offers">
                    <h3 class="event__section-title  event__section-title--offers">Offers</h3>

                    <div class="event__available-offers">
								${createOffers(point.offers)}
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
	constructor(point = EMPTY_POINT, editMode = EditMode.EDIT, destinationsModel, pointsModel) {
		super();
		this._dateStart = point.start;
		this._dateEnd = point.end;
		this._type = point.type;
		this._point = point;
		this._editMode = editMode;
		this._destinationsModel = destinationsModel;
		this._pointsModel = pointsModel;
		this._offers = this._pointsModel.getOffer(point);

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

		this.refreshDatalist = this.refreshDatalist.bind(this);
		this._destinationsModel.addObserver(this.refreshDatalist);		//? при обновлении данных о городах обновить datalist
	}

	refreshDatalist() {
		console.log('refreshDatalist');
		const containerDestinations = findElement(this.getElement(), '.event__field-group--destination');
		const containerDatalist = findElement(this.getElement(), 'datalist');
		console.log(containerDestinations, containerDatalist);
		render(containerDestinations, containerDatalist);	//? может убирать старый datalist надо?
		console.log(this._destinationsModel.getDestinations());
	}

	init() {
		console.log('Edit Component Init');
	}

	getTemplate() {
		this._pointsModel.getOffer(this._point);
		return editPointTemplate(this._point, this._editMode, this._destinationsModel.getDestinations());
	}
	reset(point) {
		this._offers = this._point.offers.slice();
		this.updateElement(point);
	}
	resetInput(point) {
		this.updateData(point);
	}
	restoreListeners() {
		this._setInnerListeners();
		this.setTypePointHandler(this._callback.changeTypePoint);
		this.setModeToViewClickHandler(this._callback.onRollUpClick);
		this.setFormSubmitHandler(this._callback.onFormSubmit);
		this.setFormDeleteHandler(this._callback.onFormDelete);
		this._setDatePicker(this._dateStart, true);
		this._setDatePicker(this._dateEnd);
	}

	_setInnerListeners() {
		findElement(this.getElement(), '.event__input--destination').addEventListener('change', this._onPointInput)
		findElement(this.getElement(), '.event__input--price').addEventListener('change', this._onPriceChange);
		findElement(this.getElement(), '.event__available-offers').addEventListener('change', this._onCheckedOffers);
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
		findElement(this.getElement(), '.event__input--destination').removeEventListener('change', this._onPointInput)
		findElement(this.getElement(), '.event__input--price').removeEventListener('change', this._onPriceChange);

		findElement(this.getElement(), '.event__type-group').removeEventListener('change', this._changeTypePoint);
		findElement(this.getElement(), '.event__rollup-btn').removeEventListener('click', this._onRollUpClick);
		findElement(this.getElement(), 'form').removeEventListener('submit', this._onFormSubmit);
		findElement(this.getElement(), '.event__reset-btn').removeEventListener('click', this._onFormDelete);

	}

	_onPointInput(evt) {
		evt.preventDefault();
		const index = this._destinationsModel.getDestinations().findIndex(el => el.city === evt.target.value);
		if (index === -1) {
			evt.target.setCustomValidity(`Города ${evt.target.value} нет в списке`);
			return;
		}
		this.updateData({
			city: evt.target.value,
			description: this._destinationsModel.getDestinations().find(el => el.city === evt.target.value).description,
			photos: this._destinationsModel.getDestinations().find(el => el.city === evt.target.value).photos,
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
			checkedOffers: [],
			offers: this._pointsModel.getOfferByType(evt.target.value),
		});
		this._offers = this._pointsModel.getOfferByType(evt.target.value);	//?костыль?
		console.log(this._offers);
	}

	setTypePointHandler(callback) {
		this._callback.changeTypePoint = callback;
		findElement(this.getElement(), '.event__type-group').addEventListener('change', this._changeTypePoint);
	}

	_onRollUpClick(evt) {
		this.reset(this._point);
		this._callback.onRollUpClick();
	}

	setModeToViewClickHandler(callback) {
		this._callback.onRollUpClick = callback;
		findElement(this.getElement(), '.event__rollup-btn').addEventListener('click', this._onRollUpClick);
	}

	_onFormSubmit(evt) {
		evt.preventDefault();
		this._point.offers = this._offers.slice();
		console.log(this._point.offers);
		this._pointsModel.setCheckedOffer(this._point);
		this._callback.onFormSubmit(this._point);
	}

	setFormSubmitHandler(callback) {
		this._callback.onFormSubmit = callback;
		findElement(this.getElement(), 'form').addEventListener('submit', this._onFormSubmit);
	}

	_onFormDelete(evt) {
		evt.preventDefault();
		this._callback.onFormDelete(this._point);
	}

	setFormDeleteHandler(callback) {
		this._callback.onFormDelete = callback;
		findElement(this.getElement(), '.event__reset-btn').addEventListener('click', this._onFormDelete);
	}

	_setDatePicker(datePicker, flag) {
		if (datePicker) {
			// datePicker.destroy();
			datePicker = null;
		}
		if (flag) {
			datePicker = flatpickr(findElement(this.getElement(), '#event-start-time-1'),
				{
					dateFormat: DateFormat.FORMAT_PICKER,
					defaultDate: new Date(this._point.start),
					onChange: this._onDateStartChange,
				},
			);
			return;
		}
		datePicker = flatpickr(findElement(this.getElement(), '#event-end-time-1'),
			{
				dateFormat: DateFormat.FORMAT_PICKER,
				defaultDate: new Date(this._point.end),
				onChange: this._onDateEndChange,
			},
		);

	}
	_onDateStartChange(inputDate) {
		if (compareTwoDates(inputDate, this._point.end) < 0) {
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
		if (compareTwoDates(this._point.start, inputDate) < 0) {
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
		// this._point.offers - это все доступные offers для точки
		// this._point.checkedOffers - это только выбранные - хранятся на сервере
		const index = this._offers.findIndex(el => el.short === evt.target.name.replace('event-offer-', ''));
		if (index === -1) {
			return;
		}
		this._offers[index].checked = evt.target.checked;
	}

}