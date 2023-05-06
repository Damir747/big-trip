import Observer from "../utils/observer.js";

export default class Offers extends Observer {
	constructor() {
		super();
		this._offers = [];
	}
	setOffers(updateType, offers) {
		this._offers = offers;
		this._notify(updateType, offers);
	}
	getOffers() {
		return this._offers;
	}
	getOffer(type) {
		const copyOffers = this._offers.slice().filter((el) => el.title === type);
		return copyOffers;
	}

	static adaptOffersToClient(offer) {
		const adaptOnlyOffers = (offers) => {
			const adaptedOffers = [];
			offers.forEach(offer => {
				const adaptedOffer = Object.assign(
					{},
					offer,
					{
						title: offer.title,
						price: offer.price,
						short: offer.title.toLowerCase().replace(/\s/g, '-'),
						checked: false,
					}
				);
				adaptedOffers.push(adaptedOffer);
			});

			return adaptedOffers;
		}

		const adaptedType = Object.assign(
			{},
			offer,
			{
				title: offer.type,
				offers: adaptOnlyOffers(offer.offers),
			}
		);

		delete adaptedType.type;

		return adaptedType;
	}
	static adaptOffersToServer(offer) {
		const adaptedOffer = Object.assign(
			{},
			offer,
			{
				'title': offer.title,
				'price': offer.price,
			}
		);

		return adaptedOffer;
	}

}