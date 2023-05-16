import { humanizeDate, compareTwoDates, findElement, addListener, removeListener } from '../utils/common.js';
import { createOffers } from '../utils/offer.js';
import { DateFormat, DIR_ICONS, EVENT_TYPE, EditMode } from '../const.js';
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
	destinations.forEach((el) => citiesList += datalistCity(el.city));
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

const editPointTemplate = (point, editMode, destinations) => {
	let photosList = "";
	if (point.photos !== '') {
		point.photos.forEach((el) => {
			el.src = el.src.replace('http://', 'https://');
			photosList += eventPhotoTemplate(el);
		});
	}
	let eventTypeList = "";
	EVENT_TYPE.forEach((el) => eventTypeList += eventTypeTemplate(el, (el === point.type.toLowerCase())));
	console.log(point.offers);
	return `<li class="trip-events__item">
              <form class="event event--edit" action="#" method="post">
                <header class="event__header">
                  <div class="event__type-wrapper">
                    <label class="event__type  event__type-btn" for="event-type-toggle-1">
                      <span class="visually-hidden">Choose event type</span>
                      <img class="event__type-icon" width="17" height="17" src="${DIR_ICONS}${point.type}.png" alt="Event type icon">
                    </label>
                    <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox" ${point.isDisabled ? 'disabled' : ''}>

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
                    <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${he.decode(point.city)}" list="destination-list-1" ${destinations.length === 0 ? 'readonly' : ''}  ${point.isDisabled ? 'disabled' : ''}>
                    <datalist id="destination-list-1">
                      ${datalistCities(destinations)}
                    </datalist>
                  </div>

                  <div class="event__field-group  event__field-group--time">
                    <label class="visually-hidden" for="event-start-time-1">From</label>
                    <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${humanizeDate(point.start, DateFormat.FORMAT_FULL_DATE)}" ${point.isDisabled ? 'disabled' : ''}>
                    &mdash;
                    <label class="visually-hidden" for="event-end-time-1">To</label>
                    <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${humanizeDate(point.end, DateFormat.FORMAT_FULL_DATE)}" ${point.isDisabled ? 'disabled' : ''}>
                  </div>

                  <div class="event__field-group  event__field-group--price">
                    <label class="event__label" for="event-price-1">
                      <span class="visually-hidden">Price</span>
                      &euro;
                    </label>
                    <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${point.price}"  ${point.isDisabled ? 'disabled' : ''}>
                  </div>

                  <button class="event__save-btn  btn  btn--blue" type="submit" ${point.isDisabled ? 'disabled' : ''}>${point.isSaving ? 'Saving...' : 'Save'}</button>
                  <button class="event__reset-btn" type="reset" ${point.isDisabled ? 'disabled' : ''}>${editMode === EditMode.EDIT ? (point.isDeleting ? 'Deleting...' : 'Delete') : 'Cancel'}</button>
                  <button class="event__rollup-btn" type="button">
                    <span class="visually-hidden">Open event</span>
                  </button>
                </header>
                <section class="event__details">
                  <section class="event__section  event__section--offers">
                    <h3 class="event__section-title  event__section-title--offers ${point.offers.length === 0 ? 'visually-hidden' : ''}">Offers</h3>

                    <div class="event__available-offers">
								${createOffers(point.offers, point.isDisabled)}
                    </div>
                  </section>

                  <section class="event__section  event__section--destination ${point.description.length === 0 ? 'visually-hidden' : ''}">
                    <h3 class="event__section-title  event__section-title--destination">Destination</h3>
                    <p class="event__destination-description">${point.description}</p>

                    <div class="event__photos-container ${photosList.length === 0 ? 'visually-hidden' : ''}">
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
	constructor(point, editMode = EditMode.EDIT, destinationsModel, pointsModel) {
		super();
		this._dateStart = point.start;
		this._dateEnd = point.end;
		this._type = point.type;
		this._point = PointEditorView.parsePointToState(point);
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

	init() {
		console.log('Edit Component Init');
	}

	refreshDatalist() {
		const containerDestinations = findElement(this.getElement(), '.event__field-group--destination');
		const containerDatalist = findElement(this.getElement(), 'datalist');
		render(containerDestinations, containerDatalist);	//? может убирать старый datalist надо?
	}

	getTemplate() {
		console.log(this._point.offers);
		console.log(this._point.checkedOffers);
		this._pointsModel.getOffer(this._point);	//? она здесь зануляет выбранные опции. зачем?
		console.log(this._point.offers);
		console.log(this._point.checkedOffers);
		return editPointTemplate(this._point, this._editMode, this._destinationsModel.getDestinations());
	}
	reset(point) {
		this._point = PointEditorView.parsePointToState(point);
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
		addListener(this.getElement(), '.event__input--destination', 'change', this._onPointInput)
		addListener(this.getElement(), '.event__input--price', 'change', this._onPriceChange);
		addListener(this.getElement(), '.event__available-offers', 'change', this._onCheckedOffers);
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
		removeListener(this.getElement(), '.event__input--destination', 'change', this._onPointInput)
		removeListener(this.getElement(), '.event__input--price', 'change', this._onPriceChange);

		removeListener(this.getElement(), '.event__type-group', 'change', this._changeTypePoint);
		removeListener(this.getElement(), '.event__rollup-btn', 'click', this._onRollUpClick);
		removeListener(this.getElement(), 'form', 'submit', this._onFormSubmit);
		removeListener(this.getElement(), '.event__reset-btn', 'click', this._onFormDelete);

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
		this._offers = this._pointsModel.getOfferByType(evt.target.value);
		this.updateData({
			type: evt.target.value,
			checkedOffers: [],
			// offers: this._pointsModel.getOfferByType(evt.target.value),
		});
		if (this._offers.length === 0) {
			document.querySelector('.event__section--offers').classList.add('visually-hidden');
		}
		else {
			document.querySelector('.event__section--offers').classList.remove('visually-hidden');
		}
	}

	setTypePointHandler(callback) {
		this._callback.changeTypePoint = callback;
		addListener(this.getElement(), '.event__type-group', 'change', this._changeTypePoint);
	}

	_onRollUpClick(evt) {
		evt.preventDefault();
		this._callback.onRollUpClick();
	}

	setModeToViewClickHandler(callback) {
		this._callback.onRollUpClick = callback;
		addListener(this.getElement(), '.event__rollup-btn', 'click', this._onRollUpClick);
	}

	_onFormSubmit(evt) {
		evt.preventDefault();
		this._point.offers = this._offers.slice();	//? а если нет сети, то ошибка
		console.log(this._point.offers);
		console.log(this._point.checkedOffers);
		this._pointsModel.setCheckedOffer(this._point);
		console.log(this._point.offers);
		console.log(this._point.checkedOffers);
		this._callback.onFormSubmit(PointEditorView.parseStateToPoint(this._point));
	}

	setFormSubmitHandler(callback) {
		this._callback.onFormSubmit = callback;
		addListener(this.getElement(), 'form', 'submit', this._onFormSubmit);
	}

	_onFormDelete(evt) {
		evt.preventDefault();
		this._callback.onFormDelete(PointEditorView.parseStateToPoint(this._point));
	}

	setFormDeleteHandler(callback) {
		this._callback.onFormDelete = callback;
		addListener(this.getElement(), '.event__reset-btn', 'click', this._onFormDelete);
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
					enableTime: true,
					time_24hr: true,
					onChange: this._onDateStartChange,
				},
			);
			return;
		}
		datePicker = flatpickr(findElement(this.getElement(), '#event-end-time-1'),
			{
				dateFormat: DateFormat.FORMAT_PICKER,
				defaultDate: new Date(this._point.end),
				enableTime: true,
				time_24hr: true,
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
	static parsePointToState(point) {
		return Object.assign(
			{},
			point,
			{
				isDisabled: false,
				isSaving: false,
				isDeleting: false,
			},
		);
	}
	static parseStateToPoint(state) {
		state = Object.assign(
			{},
			state,
		);
		delete state.isDisabled;
		delete state.isSaving;
		delete state.isDeleting;
		return state;
	}
}