export const createOffers = (checkedOffer) => {
	let offersList = "";
	checkedOffer.forEach((el) => offersList += `<div class="event__offer-selector">
	                     <input class="event__offer-checkbox  visually-hidden" id="event-offer-comfort-1" type="checkbox" name="event-offer-comfort" ${el.checked ? 'checked' : ''}>
	                     <label class="event__offer-label" for="event-offer-comfort-1">
	                       <span class="event__offer-title">${el.title}</span>
	                       &plus;&euro;&nbsp;
	                       <span class="event__offer-price">${el.price}</span>
	                     </label>
	                   </div>`);
	return offersList;
}

export const selectedOffers = (checkedOffer) => {
	let offersList = "";
	checkedOffer.forEach((el) => {
		if (el.checked) {
			offersList += `<li class="event__offer">
                    <span class="event__offer-title">${el.title}</span>
                    &plus;&euro;&nbsp;
                    <span class="event__offer-price">${el.price}</span>
                  </li>`;
		}
	});
	return offersList;
}