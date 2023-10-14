import AbstractView from '../framework/abstract-view.js';
import { Mode, UpdateType, UserAction, RenderPosition, EMPTY_POINT, EditMode } from '../const.js';
import { render } from '../view/render.js';
import { remove, replace } from '../framework/render.js';
import { isEscapeEvent, isOnline } from '../utils/common.js';
import PointView from '../view/point-view.js';
import PointEditorView from '../view/point-editor-view.js';
import { generatePoint } from '../data.js';
import { toast } from '../utils/toast.js';

export const State = {
	SAVING: 'SAVING',
	DELETING: 'DELETING',
	ABORTING: 'ABORTING',
}
export default class PointPresenter extends AbstractView {
	constructor(pointListContainer, changeData, changeMode, destinationsModel, pointsModel) {
		super();

		this._pointComponent = null;
		this._pointEditorComponent = null;
		this._pointMode = Mode.VIEW;
		this._emptyPoint = false;

		this._pointListContainer = pointListContainer;
		this._changeData = changeData;
		this._changeMode = changeMode;
		this._destinationsModel = destinationsModel;
		this._pointsModel = pointsModel;

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
			if (this._pointsModel.getOffers().length === 0) {
				toast(`can't create new point because offers are not ready`)
				return;
			}
			if (this._destinationsModel.getDestinations().length === 0) {
				toast(`can't create new point because destinations are not ready`)
				return;
			}
			this._point = generatePoint(this._pointsModel, this._destinationsModel.getDestinations());
			this._pointMode = Mode.EDIT;
			this._pointComponent = new PointView(this._point);
			this._pointEditorComponent = new PointEditorView(this._point, EditMode.NEW, this._destinationsModel, this._pointsModel);
		}
		else {
			this._point = point;
			this._pointComponent = new PointView(this._point);
			this._pointEditorComponent = new PointEditorView(this._point, EditMode.EDIT, this._destinationsModel, this._pointsModel);
		}
		this._pointComponent.setModeToEditClickHandler(this._changeModeToEdit);
		this._pointComponent.setFavoriteClickHandler(this._changeFavoriteStatus);
		this._pointEditorComponent.setModeToViewClickHandler(this._changeModeToView);
		this._pointEditorComponent.setFormSubmitHandler(this._onSubmitForm);
		this._pointEditorComponent.setFormDeleteHandler(this._deletePoint);

		if (this._emptyPoint) {
			render(this._pointListContainer, this._pointEditorComponent, RenderPosition.AFTERBEGIN);
			this._pointEditorComponent.restoreListeners();
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
				replace(this._pointComponent, previousPointEditorComponent);
				this._pointMode = Mode.VIEW;
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

	resetView() {
		this._changeModeToView();
	}

	_changeModeToView() {
		if (this._pointEditorComponent) {
			if (this._pointMode !== Mode.VIEW) {
				this._pointEditorComponent.reset(this._point);
				replace(this._pointComponent, this._pointEditorComponent);
				document.removeEventListener('keydown', this._escKeyDownHandler);
				this._pointMode = Mode.VIEW;
			}
			this._pointEditorComponent.disableNewButton();
		}
	}

	setViewState(state) {
		const resetFormState = () => {
			this._pointEditorComponent.updateData({
				isDisabled: false,
				isSaving: false,
				isDeleting: false,
			})
		}
		switch (state) {
			case State.SAVING:
				this._pointEditorComponent.updateData({
					isDisabled: true,
					isSaving: true,
				});
				break;
			case State.DELETING:
				this._pointEditorComponent.updateData({
					isDisabled: true,
					isDeleting: true,
				});
				break;
			case State.ABORTING:
				this._pointComponent.shake(resetFormState);
				this._pointEditorComponent.shake(resetFormState);
				break;
		}
	}
	setSaving() {
		this._pointEditorComponent.updateData({
			isDisabled: true,
			isSaving: true,
		});
	}
	setAborting() {
		console.log(this._pointEditorComponent);	//! null
		const resetFormState = () => {
			this._pointEditorComponent.updateData({
				isDisabled: false,
				isSaving: false,
				isDeleting: false,
			});
		};
		this._pointEditorComponent.shake(resetFormState);
	}

	_changeModeToEdit() {
		replace(this._pointEditorComponent, this._pointComponent);
		this._pointEditorComponent.restoreListeners();
		document.addEventListener('keydown', this._escKeyDownHandler);
		this._changeMode(UpdateType.PATCH, this._point);	//???
		this._pointMode = Mode.EDIT;
	}

	_onSubmitForm(point) {
		//? здесь ещё можно проверить, насколько крупное изменение, см. видео 7.1 28:05

		if (!isOnline()) {
			toast(`Can't save point offline`);
			return;
		}
		if (this._emptyPoint) {
			this._changeData(
				UserAction.ADD_POINT,
				UpdateType.POINTS,
				point,
			);
		}
		else {
			this._changeData(
				UserAction.UPDATE_POINT,
				UpdateType.POINTS,
				point);
		}
	}

	_escKeyDownHandler(evt) {
		if (isEscapeEvent(evt)) {
			evt.preventDefault();
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
		if (!isOnline()) {
			toast(`Can't delete point offline`);
			return;
		}
		if (this._emptyPoint) {
			this.destroy();
		}
		else {
			this._changeData(
				UserAction.DELETE_POINT,
				UpdateType.POINTS,
				point,
			)
		}
	}
}
