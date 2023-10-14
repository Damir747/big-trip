const getOffersTemplate = (offers, isDisabled) => {
	let offersList = "";
	offers.forEach((el) => offersList += `<div class="event__offer-selector">
	                     <input class="event__offer-checkbox  visually-hidden" id="event-offer-${el.short}-1" type="checkbox" name="event-offer-${el.short}" ${(!el.hasOwnProperty('checked') || el.checked) ? 'checked' : ''} ${isDisabled ? 'disabled' : ''}>
	                     <label class="event__offer-label" for="event-offer-${el.short}-1">
	                       <span class="event__offer-title">${el.title}</span>
	                       &plus;&euro;&nbsp;
	                       <span class="event__offer-price">${el.price}</span>
	                     </label>
	                   </div>`);
	return offersList;
}

// Показывает в общем списке точек выбранные опции
const getSelectedOffersTemplate = (checkedOffer) => {
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

export { getOffersTemplate, getSelectedOffersTemplate };