// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace RemoteAPI {
	export interface IProduct {
		id: string;
		title: string;
		description: string;
		price: number | null;
		category: string;
		image: string;
	}
	export interface IOrder {
		id: string;
		total: number | null;
	}
}


export interface IContact {
	email: string;
	phone: string;
}

export interface IOrderForm {
	payment: string;
	address: string;
}

export interface IOrder extends IOrderForm, IContact {
	total: number | null;
	items: string[];
}

export interface ILarekAPI {
	getProductList: () => Promise<RemoteAPI.IProduct[]>;
	getProductItem: (id: string) => Promise<RemoteAPI.IProduct>;
	orderProducts: (order: IOrder) => Promise<RemoteAPI.IOrder>;
}

export interface FormErrors {
	address?: string;
	email?: string;
	phone?: string;
}

export interface IAppState {
	catalog: RemoteAPI.IProduct[];
	basket: RemoteAPI.IProduct[];
	order: IOrder | null;
	formErrors: FormErrors;
}

export interface IDelivery {
	payment: string;
	address: string;
}

export interface IFormState {
	valid: boolean;
	errors: string[];
}

export interface IModal {
	content: HTMLElement;
}

export interface IPage {
	counter: number;
	catalog: HTMLElement[];
}

export interface IProduct extends RemoteAPI.IProduct {
	index?: string;
	buttonTitle?: string;
}

export interface IBasket {
	items: HTMLElement[];
	total: number;
}
