export const API_URL = `${process.env.API_ORIGIN}/api/weblarek`;
export const CDN_URL = `${process.env.API_ORIGIN}/content/weblarek`;

export const settings = {

};

/** Константа событий */
export const EVENTS = {
	itemsChanged: 'items:changed',
	previewChanged: 'preview:changed',
	counterChanged: 'counter:changed',
	basketChanged: 'basket:changed',
	formErrorsChanged: 'formErrors:changed',
	deliveryReady: 'delivery:ready',
	contactsReady: 'contacts:ready',
	paymentToggle: 'payment:toggle',
	productToggle: 'product:toggle',
	orderOpen: 'order:open',
	basketOpen: 'basket:open',
	orderSubmit: 'order:submit',
	contactsSubmit: 'contacts:submit',
	cardSelect: 'card:select',
	productAdd: 'product:add',
	productDelete: 'product:delete',
};

/** Методы оплаты */
export const PaymentMethods:{[key: string]: string} = {
	card: 'online',
	cash: 'cash'
}
