import AbstractView from '../framework/abstract-view.js';
import { Mode, UpdateType, UserAction, RenderPosition } from '../const.js';
import { render } from '../view/render.js';
import { remove } from '../framework/render.js';
import { isEscapeEvent } from '../utils/common.js';
import { generatePoint } from '../data.js';
import PointNewView from '../view/point-new-view.js';
import { nanoid } from 'nanoid';

//? Вопрос опций по умолчанию для новой точки. Город какой по умолчанию? Опции надо все выключить?
//? не дает выбрать тип точки маршрута. Вообще поработать с формой новой точки
//? дальше разобраться с разделом "Безопасность превыше всего"

export default class PointNewPresenter extends AbstractView {
	constructor(pointListContainer, changeData) {	// offers?
		super();

		this._pointListContainer = pointListContainer;
		this._changeData = changeData;
		this._pointEditorComponent = null;
		// this._offers = offers;

		this._onSubmitForm = this._onSubmitForm.bind(this);
		this._deletePoint = this._deletePoint.bind(this);
		this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
	}

	init() {
		this._point = generatePoint();
		if (this._pointEditorComponent !== null) {
			return;
		}

		this._pointEditorComponent = new PointNewView(this._point);
		// this._pointEditorComponent.restoreListeners();		//? а куда ещё его вписать?

		this._pointEditorComponent.setFormSubmitHandler(this._onSubmitForm);
		this._pointEditorComponent.setFormDeleteHandler(this._deletePoint);

		render(this._pointListContainer, this._pointEditorComponent, RenderPosition.AFTERBEGIN);

		document.addEventListener('keydown', this._escKeyDownHandler);
		console.log('при попытке пользователя добавить новую точку маршрута...');
	}

	destroy() {
		if (this._pointEditorComponent == null) {
			return;
		}
		remove(this._pointEditorComponent);
		this._pointEditorComponent = null;

		document.removeEventListener('keydown', this.__escKeyDownHandler);
	}
	resetView() {
		if (this._pointMode !== Mode.VIEW) {
			this._pointEditorComponent.reset(this._point);
			this._changeModeToView();
		}
	}
	_changeModeToView() {
		// replace(this._pointComponent, this._pointEditorComponent);
		document.removeEventListener('keydown', this._escKeyDownHandler);
		this._pointMode = Mode.VIEW;
	}
	_escKeyDownHandler(evt) {
		if (isEscapeEvent(evt)) {
			evt.preventDefault();
			this.destroy();
		}
	}

	_onSubmitForm(point) {
		this._changeData(
			UserAction.ADD_POINT,
			UpdateType.POINTS,
			Object.assign(
				{
					id: nanoid()
				},
				point
			)
		);
		this.destroy();
	}

	_deletePoint() {
		this.destroy();
	}

}