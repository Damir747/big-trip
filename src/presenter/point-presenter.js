import AbstractView from '../framework/abstract-view.js';
import PointView from '../view/point-view.js';
import PointEditorView from '../view/point-editor-view.js';
import { Mode } from '../const.js';
import { render } from '../view/render.js';
import { remove, replace } from '../framework/render.js';
import { isEscapeEvent } from '../utils/common.js';

export default class Point extends AbstractView {
	constructor(pointListContainer, changeData, changeMode) {
		super();

		this._pointListContainer = pointListContainer;
		this._changeData = changeData;
		this._changeMode = changeMode;

		this._pointComponent = null;
		this._pointEditorComponent = null;
		this._pointMode = Mode.VIEW;

		this._changeModeToView = this._changeModeToView.bind(this);
		this._changeModeToEdit = this._changeModeToEdit.bind(this);
		this._changeFavoriteStatus = this._changeFavoriteStatus.bind(this);
		this._onSubmitForm = this._onSubmitForm.bind(this);
		this._deletePoint = this._deletePoint.bind(this);
		this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
	}

	init(point) {
		this._point = point;
		const previousPointComponent = this._pointComponent;
		const previousPointEditorComponent = this._pointEditorComponent;

		this._pointComponent = new PointView(point);
		this._pointEditorComponent = new PointEditorView(point);

		this._pointComponent.setModeToEditClickHandler(this._changeModeToEdit);
		this._pointComponent.setFavoriteClickHandler(this._changeFavoriteStatus);
		this._pointEditorComponent.setModeToViewClickHandler(this._changeModeToView);
		this._pointEditorComponent.setFormSubmitHandler(this._onSubmitForm);
		this._pointEditorComponent.setFormDeleteHandler(this._deletePoint);

		if (previousPointComponent === null || previousPointEditorComponent === null) {
			render(this._pointListContainer, this._pointComponent);
			return;
		}

		switch (this._pointMode) {
			case Mode.VIEW:
				replace(this._pointComponent, previousPointComponent);
				break;
			case Mode.EDIT:
				replace(this._pointComponent, previousPointEditorComponent);
				break;
			default:
				throw new Error(`Неизвестный _pointMode: ${this._pointMode}`);
		}
		remove(previousPointComponent);
		remove(previousPointEditorComponent);
	}

	destroy() {
		remove(this._pointComponent);
		remove(this._pointEditorComponent);
	}

	_onSubmitForm(point) {
		this._changeModeToView();
		this._changeData(point);
	}

	_changeModeToEdit() {
		replace(this._pointEditorComponent, this._pointComponent);
		this._pointEditorComponent.restoreListeners();
		document.addEventListener('keydown', this._escKeyDownHandler);
		this._changeMode();
		this._pointMode = Mode.EDIT;
	}

	_changeModeToView() {
		document.removeEventListener('keydown', this._escKeyDownHandler);
		replace(this._pointComponent, this._pointEditorComponent);
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
			Object.assign(
				{},
				this._point,
				{ 'checkedFavorite': this._point.checkedFavorite === '' ? 'event__favorite-btn--active' : '' }
			),
		);
	}
	_deletePoint(point) {
		console.log(point);
	}
}