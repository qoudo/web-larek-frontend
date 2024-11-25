import './scss/styles.scss';
import { ensureElement, cloneTemplate } from './utils/utils';
import { App } from './components/models/app';
import { EventEmitter } from './components/base/events';
import { LarekAPI } from './components/base/larek-api';
import {API_URL, CDN_URL, PaymentMethods} from "./utils/constants";
import { Page } from './components/views/page';
import { Basket } from './components/views/basket';
import { Delivery } from './components/views/forms/delivery';
import { Contact } from './components/views/forms/contact';
import { CatalogChangeEvent, Product } from './components/models/product';
import { Card } from './components/views/card';
import { Done } from './components/views/done';
import { IContact, IDelivery, IOrder } from './types';
import { Modals } from './components/views/modals';

/**
 * Инициализация базовых классов приложения
 */
const events = new EventEmitter();
const api = new LarekAPI(CDN_URL, API_URL);

/**
 * Инициализация шаблонов
 */
const templates = {
	cardCatalog: ensureElement<HTMLTemplateElement>('#card-catalog'),
	cardPreview: ensureElement<HTMLTemplateElement>('#card-preview'),
	basket: ensureElement<HTMLTemplateElement>('#basket'),
	cardBasket: ensureElement<HTMLTemplateElement>('#card-basket'),
	delivery: ensureElement<HTMLTemplateElement>('#order'),
	contact: ensureElement<HTMLTemplateElement>('#contacts'),
	success: ensureElement<HTMLTemplateElement>('#success')
};

/**
 * Инициализация моделей и представлений
 */
const appData = new App({}, events);
const page = new Page(document.body, events);
const modal = new Modals(ensureElement<HTMLElement>('#modal-container'), events);

/**
 * Инициализация компонентов интерфейса
 */
const components = {
	basket: new Basket(cloneTemplate(templates.basket), events),
	delivery: new Delivery(cloneTemplate(templates.delivery), events, {
		onClick: (ev: Event) => events.emit('payment:toggle', ev.target)
	}),
	contact: new Contact(cloneTemplate(templates.contact), events)
};

/**
 * Обработчики событий
 */
const eventHandlers = {
	/**
	 * Обработчик изменения каталога товаров
	 */
	handleCatalogChange: () => {
		page.catalog = appData.catalog.map(item => {
			const card = new Card(cloneTemplate(templates.cardCatalog), {
				onClick: () => events.emit('card:select', item)
			});
			return card.render({
				title: item.title,
				image: item.image,
				price: item.price,
				category: item.category
			});
		});
	},

	/**
	 * Обработчик отправки заказа
	 */
	handleOrderSubmit: () => {
		modal.render({
			content: components.contact.render({
				email: '',
				phone: '',
				valid: false,
				errors: []
			})
		});
	},

	/**
	 * Обработчик отправки формы контактов
	 */
	handleContactsSubmit: () => {
		api.orderProducts(appData.order)
			.then((result) => {
				appData.clearBasket();
				appData.clearOrder();
				const success = new Done(cloneTemplate(templates.success), {
					onClick: () => modal.close()
				});
				success.total = result.total.toString();
				modal.render({ content: success.render({}) });
			})
			.catch(console.error);
	}
};

/**
 * Подписка на события
 */
const subscribeToEvents = () => {
	events.on<CatalogChangeEvent>('items:changed', eventHandlers.handleCatalogChange);
	events.on('order:submit', eventHandlers.handleOrderSubmit);
	events.on('contacts:submit', eventHandlers.handleContactsSubmit);

	// Обработка ошибок форм
	events.on('formErrors:change', (errors: Partial<IOrder>) => {
		const { payment, address, email, phone } = errors;
		components.delivery.valid = !payment && !address;
		components.contact.valid = !email && !phone;
		components.delivery.errors = Object.values({ payment, address }).filter(Boolean).join('; ');
		components.contact.errors = Object.values({ phone, email }).filter(Boolean).join('; ');
	});

	// Обработка изменений полей форм
	events.on(/^order\..*:change/, (data: { field: keyof IDelivery, value: string }) => {
		appData.setDeliveryField(data.field, data.value);
	});

	events.on(/^contacts\..*:change/, (data: { field: keyof IContact, value: string }) => {
		appData.setContactField(data.field, data.value);
	});

	// Открыть форму заказа
	events.on('order:open', () => {
		modal.render({
			content: components.delivery.render({
				payment: '',
				address: '',
				valid: false,
				errors:[]
			})
		})
		appData.order.items = appData.basket.map((item) => item.id);
	})

	events.on('preview:changed', (item: Product) => {
		const card = new Card(cloneTemplate(templates.cardPreview), {
			onClick: () => {
				events.emit('product:toggle', item);
				card.buttonTitle = (appData.basket.indexOf(item) < 0) ? 'Купить' : 'Удалить из корзины'
			}
		});
		modal.render({
			content: card.render({
				title: item.title,
				description: item.description,
				image: item.image,
				price: item.price,
				category: item.category,
				buttonTitle: (appData.basket.indexOf(item) < 0) ? 'Купить' : "Удалить из корзины"
			})
		})
	})

// Открытие карточки товара
	events.on('card:select', (item: Product) => {
		appData.setPreview(item);
	})

// Изменение счетчика товаров
	events.on('product:add', (item: Product) => {
		appData.addToBasket(item);

	})

	events.on('product:delete', (item: Product) => {
		appData.removeFromBasket(item)
	})

	events.on('product:toggle', (item: Product) => {
		if(appData.basket.indexOf(item) < 0){
			events.emit('product:add', item);
		}
		else{
			events.emit('product:delete', item);
		}
	})

// Изменение состояния корзины
	events.on('basket:changed', (items: Product[]) => {
		components.basket.items = items.map((item, index) => {
			const card = new Card(cloneTemplate(templates.cardBasket), {
				onClick: () => {
					events.emit('product:delete', item)
				}
			});
			return card.render({
				index: (index+1).toString(),
				title: item.title,
				price: item.price,
			})
		})
		const total = items.reduce((total, item) => total + item.price, 0)
		components.basket.total = total
		appData.order.total = total;
		const disabled = total===0;
		components.basket.toggleButton(disabled)
	})

// Открытие корзины
	events.on('basket:open', () => {
		modal.render({
			content: components.basket.render({})
		})
	})


	events.on('counter:changed', () => {
		page.counter = appData.basket.length;
	})

// Изменен способ оплаты
	events.on('payment:toggle', (target: HTMLElement) => {
		if(!target.classList.contains('button_alt-active')){
			components.delivery.toggleButtons();
			appData.order.payment = PaymentMethods[target.getAttribute('name')];
		}
	})

// Заполнена форма доставки
	events.on('delivery:ready' , () => {
		components.delivery.valid = true;
	})

// Заполнена форма данных о контакте
	events.on('contact:ready', () => {
		components.contact.valid = true;
	})

// Открыто модадльное окно
	events.on('modal:open', () => {
		page.locked = true;
	})

// Закрыто модальное окно
	events.on('modal:close', () => {
		page.locked = false;
	})
};

/**
 * Инициализация приложения
 */
const initApp = () => {
	subscribeToEvents();

	// Загрузка каталога товаров
	api.getProductList()
		.then(appData.setCatalog.bind(appData))
		.catch(console.error);
};

// Запуск приложения
initApp();
