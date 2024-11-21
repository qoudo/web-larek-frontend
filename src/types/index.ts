// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace RemoteAPI {
	/**
	 * Данные о товаре из api.
	 */
	export interface IProduct {
		id: string;
		title: string;
		description: string;
		price: number | null;
		category: string;
		image: string;
	}

	/**
	 * Данные о заказе из api.
	 */
	export interface IOrder {
		id: string;
		total: number | null;
	}
}

/**
 * Контактные данные
 */
export interface IContact {
	email: string;
	phone: string;
}

/**
 * Данные формы заказа.
 */
export interface IOrderForm {
	payment: string;
	address: string;
}

/**
 * Информация о заказе.
 */
export interface IOrder extends IOrderForm, IContact {
	total: number | null;
	items: string[];
}

/**
 * Методы api larek.
 */
export interface ILarekAPI {
	getProductList: () => Promise<RemoteAPI.IProduct[]>;
	getProductItem: (id: string) => Promise<RemoteAPI.IProduct>;
	orderProducts: (order: IOrder) => Promise<RemoteAPI.IOrder>;
}

/**
 * Ошибки валидации форм.
 */
export interface FormErrors {
	address?: string;
	email?: string;
	phone?: string;
}

/**
 * Глобальное состояние.
 */
export interface IAppState {
	catalog: RemoteAPI.IProduct[];
	basket: RemoteAPI.IProduct[];
	order: IOrder | null;
	formErrors: FormErrors;
}

/**
 * Поля формы заказа, связанные с данными о доставке.
 */
export interface IDelivery {
	payment: string;
	address: string;
}

/**
 * Состояние формы.
 */
export interface IFormState {
	valid: boolean;
	errors: string[];
}

/**
 * Контент для отображения в модальном окне.
 */
export interface IModal {
	content: HTMLElement;
}

/**
 * Описывает структуры данных для главной страницы.
 */
export interface IPage {
	counter: number;
	catalog: HTMLElement[];
}

/**
 * Данные о товаре на странице.
 */
export interface IProduct extends RemoteAPI.IProduct {
	index?: string;
	buttonTitle?: string;
}

/**
 * Действия.
 */
export interface IActions {
	onClick: (event: MouseEvent) => void;
}

/**
 * Данные корзины.
 */
export interface IBasket {
	items: HTMLElement[];
	total: number;
}
