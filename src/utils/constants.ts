export const API_URL = `${process.env.API_ORIGIN}/api/weblarek`;
export const CDN_URL = `${process.env.API_ORIGIN}/content/weblarek`;

export const settings = {

};

/** Константа событий */
export const EVENTS = {
	itemsChanged: 'items:changed',
	previewChange: 'preview:changed',
	counterChanged: 'counter:changed',
	basketChanged: 'basket:changed',
	formErrorsChange: 'formErrors:change',
	deliveryReady: 'delivery:ready',
	contactReady: 'contact:ready',
	paymentToggle: 'payment:toggle',
	productToggle: 'product:toggle',
	cardSelect: 'card:select',
	orderSubmit: 'order:submit',
	contactsSubmit: 'contacts:submit',
	orderOpen: 'order:open',
	productAdd: 'product:add',
	productDelete: 'product:delete',
	basketOpen: 'basket:open',
};

/** Методы оплаты */
export const PaymentMethods:{[key: string]: string} = {
	card: 'online',
	cash: 'cash'
}
