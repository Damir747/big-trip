import AbstractView from '../framework/abstract-view.js';
import { Mode, UpdateType, UserAction, RenderPosition, EMPTY_POINT, EditMode } from '../const.js';
import { render } from '../view/render.js';
import { remove, replace } from '../framework/render.js';
import { isEscapeEvent } from '../utils/common.js';
import PointView from '../view/point-view.js';
import PointEditorView from '../view/point-editor-view.js';
import { generatePoint } from '../data.js';
import { nanoid } from 'nanoid';

export default class PointPresenter extends AbstractView {
	constructor(pointListContainer, changeData, changeMode) {
		super();

		this._pointComponent = null;
		this._pointEditorComponent = null;
		this._pointMode = Mode.VIEW;
		this._emptyPoint = false;

		this._pointListContainer = pointListContainer;
		this._changeData = changeData;
		this._changeMode = changeMode;

		this._changeModeToView = this._changeModeToView.bind(this);
		this._changeModeToEdit = this._changeModeToEdit.bind(this);
		this._changeFavoriteStatus = this._changeFavoriteStatus.bind(this);
		this._onSubmitForm = this._onSubmitForm.bind(this);
		this._deletePoint = this._deletePoint.bind(this);
		this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
	}

	init(point = EMPTY_POINT) {
		const previousPointComponent = this._pointComponent;
		const previousPointEditorComponent = this._pointEditorComponent;

		this._emptyPoint = (point === EMPTY_POINT);
		if (this._emptyPoint) {
			this._point = generatePoint();
			this._pointMode = Mode.EDIT;
			this._pointComponent = new PointView(this._point);
			this._pointEditorComponent = new PointEditorView(this._point, EditMode.NEW);
		}
		else {
			this._point = point;
			this._pointComponent = new PointView(this._point);
			this._pointEditorComponent = new PointEditorView(this._point, EditMode.EDIT);
		}
		this._pointComponent.setModeToEditClickHandler(this._changeModeToEdit);
		this._pointComponent.setFavoriteClickHandler(this._changeFavoriteStatus);
		this._pointEditorComponent.setModeToViewClickHandler(this._changeModeToView);
		this._pointEditorComponent.setFormSubmitHandler(this._onSubmitForm);
		this._pointEditorComponent.setFormDeleteHandler(this._deletePoint);

		if (this._emptyPoint) {
			render(this._pointListContainer, this._pointEditorComponent, RenderPosition.AFTERBEGIN);
			document.addEventListener('keydown', this._escKeyDownHandler);
			return;
		}
		if (previousPointComponent === null || previousPointEditorComponent === null) {
			render(this._pointListContainer, this._pointComponent);
			return;
		}


		switch (this._pointMode) {
			case Mode.VIEW:
				replace(this._pointComponent, previousPointComponent);
				break;
			case Mode.EDIT:
				replace(this._pointEditorComponent, previousPointEditorComponent);
				break;
			default:
				throw new Error(`Неизвестный _pointMode: ${this._pointMode}`);
		}

		remove(previousPointComponent);
		remove(previousPointEditorComponent);
	}

	destroy() {
		if (this._pointEditorComponent == null) {
			return;
		}
		remove(this._pointEditorComponent);
		this._pointEditorComponent = null;

		if (this._pointComponent == null) {
			return;
		}
		remove(this._pointComponent);
		this._pointComponent = null;
	}

	_onSubmitForm(point) {
		this._changeModeToView();
		//? здесь ещё можно проверить, насколько крупное изменение, см. видео 7.1 28:05
		if (this._emptyPoint) {
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
		else {
			this._changeData(
				UserAction.UPDATE_POINT,
				UpdateType.POINTS,
				point);
		}
	}

	_changeModeToEdit() {
		replace(this._pointEditorComponent, this._pointComponent);
		this._pointEditorComponent.restoreListeners();
		document.addEventListener('keydown', this._escKeyDownHandler);
		this._changeMode(UpdateType.PATCH, this._point);	//???
		this._pointMode = Mode.EDIT;
	}

	_changeModeToView() {
		if (this._emptyPoint) {
			this.destroy();
		}
		else {
			replace(this._pointComponent, this._pointEditorComponent);
		}
		document.removeEventListener('keydown', this._escKeyDownHandler);
		this._pointMode = Mode.VIEW;
	}

	_escKeyDownHandler(evt) {
		if (isEscapeEvent(evt)) {
			evt.preventDefault();
			this._changeModeToView();
		}
	}

	resetView() {
		if (this._pointMode !== Mode.VIEW) {
			this._pointEditorComponent.reset(this._point);
			this._changeModeToView();
		}
	}
	_changeFavoriteStatus() {
		this._changeData(
			UserAction.UPDATE_POINT,
			UpdateType.POINTS,
			Object.assign(
				{},
				this._point,
				{ 'checkedFavorite': !this._point.checkedFavorite }
			),
		);
	}
	_deletePoint(point) {
		if (this._emptyPoint) {
			this.destroy();
		}
		else {
			this._changeData(
				UserAction.DELETE_POINT,
				UpdateType.POINTS,		// PATCH не обновляет, остается открытая форма редактирования
				point,
			)
		}
	}
}