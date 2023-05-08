export const createOffers = (checkedOffer) => {
	let offersList = "";
	checkedOffer.forEach((el) => offersList += `<div class="event__offer-selector">
	                     <input class="event__offer-checkbox  visually-hidden" id="event-offer-${el.short}-1" type="checkbox" name="event-offer-${el.short}" ${el.checked ? 'checked' : ''}>
	                     <label class="event__offer-label" for="event-offer-${el.short}-1">
	                       <span class="event__offer-title">${el.title}</span>
	                       &plus;&euro;&nbsp;
	                       <span class="event__offer-price">${el.price}</span>
	                     </label>
	                   </div>`);
	return offersList;
}

// Показывает в общем списке точек выбранные опции
export const selectedOffers = (checkedOffer) => {
	let offersList = "";
	checkedOffer.forEach((el) => {
		offersList += `<li class="event__offer">
	                 <span class="event__offer-title">${el.title}</span>
	                 &plus;&euro;&nbsp;
	                 <span class="event__offer-price">${el.price}</span>
	               </li>`;
	});
	return offersList;
}

export const checkedOffers = (point, offers) => {
	const arr = [];
	offers.offers.forEach(el => {
		arr.push(Object.assign(
			{},
			el,
			{ checked: point.checkedOffers.filter((elem) => elem.title === el.title).length > 0 }
		));
	});
	return arr;
}
