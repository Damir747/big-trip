import { mainMenuTemplate } from './view/main-menu.js';
import { filterTemplate } from './view/filter.js';
import { tripBoardTemplate } from './view/trip-board.js';
import { newPointTemplate } from './view/new-point.js';
import { editPointTemplate } from './view/edit-point.js';
import { pointTemplate } from './view/point.js';
import { tripInfo } from './view/trip-info.js';
import { tripInfoCost } from './view/trip-cost.js';

const POINTS_COUNT = 3;

export const markup = [

	{
		container: '.trip-main',
		position: 'afterbegin',
		fn: tripInfo,
		count: 1,
	},
	{
		container: '.trip-controls__navigation',
		position: 'beforeend',
		fn: mainMenuTemplate,
		count: 1,
	},
	{
		container: '.trip-info',
		position: 'beforeend',
		fn: tripInfoCost,
		count: 1,
	},
	{
		container: '.trip-controls__filters',
		position: 'beforeend',
		fn: filterTemplate,
		count: 1,
	},
	{
		container: '.trip-events',
		position: 'beforeend',
		fn: tripBoardTemplate,
		count: 1,
	},
	{
		container: '.trip-events__list',
		position: 'beforeend',
		fn: editPointTemplate,
		count: 1,
	},
	{
		container: '.trip-events__list',
		position: 'beforeend',
		fn: newPointTemplate,
		count: 1,
	},
	{
		container: '.trip-events__list',
		position: 'beforeend',
		fn: pointTemplate,
		count: POINTS_COUNT,
	},
];
