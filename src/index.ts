import './scss/styles.scss';
import { ensureElement, cloneTemplate } from './utils/utils';
import { App } from './components/models/app';
import { EventEmitter } from './components/base/events';
import { LarekAPI } from './components/base/larek-api';
import { API_URL, CDN_URL, EVENTS, PaymentMethods } from './utils/constants';
import { Page } from './components/views/page';
import { Basket } from './components/views/basket';
import { Delivery } from './components/views/forms/delivery';
import { Contacts } from './components/views/forms/contacts';
import { CatalogChangeEvent, Product } from './components/models/product';
import { Card } from './components/views/card';
import { Done } from './components/views/done';
import { IContacts, IDelivery, IOrder } from './types';
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
const app = new App({}, events);
const page = new Page(document.body, events);
const modal = new Modals(ensureElement<HTMLElement>('#modal-container'), events);

/**
 * Инициализация компонентов интерфейса
 */
const components = {
	basket: new Basket(cloneTemplate(templates.basket), events),
	delivery: new Delivery(cloneTemplate(templates.delivery), events, {
		onClick: (ev: Event) => events.emit(EVENTS.paymentToggle, ev.target)
	}),
	contacts: new Contacts(cloneTemplate(templates.contact), events)
};

/**
 * Обработчики событий
 */
const handlers = {
	/**
	 * Обработчик изменения каталога товаров
	 */
	itemsChanged: () => {
		page.catalogItems = app.catalog.map(item => {
			const card = new Card(cloneTemplate(templates.cardCatalog), {
				onClick: () => events.emit(EVENTS.cardSelect, item)
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
	orderSubmit: () => {
		modal.render({
			content: components.contacts.render({
				email: '',
				phone: '',
				success: false,
				errors: []
			})
		});
	},

	/**
	 * Обработчик отправки формы контактов
	 */
	contactsSubmit: () => {
		api.postOrderProducts(app.order)
			.then((result) => {
				app.removeBasket();
				app.removeOrder();
				const done = new Done(cloneTemplate(templates.success), {
					onClick: () => modal.close()
				});
				done.result = result.total.toString();
				modal.render({ content: done.render({}) });
			})
			.catch(console.error);
	},

	/**
	 * Обработчик изменения ошибок в форме заказа
	 * @param {Partial<IOrder>} errors - Объект с ошибками валидации полей заказа
	 */
	errorChange: (errors: Partial<IOrder>) => {
		const { payment, address, email, phone } = errors;
		components.delivery.success = !payment && !address;
		components.contacts.success = !email && !phone;
		components.delivery.errors = Object.values({ payment, address }).filter(Boolean).join('; ');
		components.contacts.errors = Object.values({ phone, email }).filter(Boolean).join('; ');
	},


	/**
	 * Открывает модальное окно оформления заказа
	 */
	orderOpen: () => {
		modal.render({
			content: components.delivery.render({
				payment: '',
				address: '',
				success: false,
				errors:[]
			})
		})
		app.order.items = app.basket.map((item) => item.id);
	},

	/**
	 * Обработчик изменения предпросмотра товара
	 * @param {Product} product - Товар для отображения
	 */
	previewChanged: (product: Product) => {
		const card = new Card(cloneTemplate(templates.cardPreview), {
			onClick: () => {
				events.emit(EVENTS.productToggle, product);
				card.buttonTitle = (app.basket.indexOf(product) < 0) ? 'Купить' : 'Удалить из корзины'
			}
		});
		modal.render({
			content: card.render({
				title: product.title,
				description: product.description,
				image: product.image,
				price: product.price,
				category: product.category,
				buttonTitle: (app.basket.indexOf(product) < 0) ? 'Купить' : 'Удалить из корзины'
			})
		})
	},

	/**
	 * Обработчик переключения товара (добавление/удаление из корзины)
	 * @param {Product} product - Товар для переключения
	 */
	productToggle: (product: Product) => {
		if(app.basket.indexOf(product) < 0){
			events.emit(EVENTS.productAdd, product);
		}
		else{
			events.emit(EVENTS.productDelete, product);
		}
	},

	/**
	 * Обработчик изменения состояния корзины
	 * @param {Product[]} products - Массив товаров в корзине
	 */
	basketChanged: (products: Product[]) => {
		components.basket.productList = products.map((product, index) => {
			const card = new Card(cloneTemplate(templates.cardBasket), {
				onClick: () => {
					events.emit(EVENTS.productDelete, product)
				}
			});
			return card.render({
				index: (index+1).toString(),
				title: product.title,
				price: product.price,
			})
		})
		const total = products.reduce((total, product) => total + product.price, 0)
		components.basket.totalCost = total
		app.order.total = total;
		const disabled = total === null;
		components.basket.toggleButton(disabled)
	},

	/**
	 * Обработчик переключения метода оплаты
	 * @param {HTMLElement} target - DOM элемент кнопки метода оплаты
	 */
	paymentToggle: (target: HTMLElement) => {
		if(!target.classList.contains('button_alt-active')){
			components.delivery.toggleButtons();
			app.order.payment = PaymentMethods[target.getAttribute('name')];
		}
	}
};

/**
 * Подписка на события
 */
const subscribeToEvents = () => {
	events.on<CatalogChangeEvent>(EVENTS.itemsChanged, handlers.itemsChanged);
	events.on(EVENTS.orderSubmit, handlers.orderSubmit);
	events.on(EVENTS.contactsSubmit, handlers.contactsSubmit);

	// Обработка ошибок форм
	events.on(EVENTS.formErrorsChanged, handlers.errorChange);

	// Обработка изменений полей форм
	events.on(/^order\..*:change/, (data: { field: keyof IDelivery, value: string }) => {
		app.setDelivery(data.field, data.value);
	});

	events.on(/^contacts\..*:change/, (data: { field: keyof IContacts, value: string }) => {
		app.setContact(data.field, data.value);
	});

	// Открыть форму заказа
	events.on(EVENTS.orderOpen, handlers.orderOpen)

	// Изменение привью
	events.on(EVENTS.previewChanged, handlers.previewChanged)

  // Открытие карточки товара
	events.on(EVENTS.cardSelect, (item: Product) => app.setPreview(item))

  // Изменение счетчика товаров
	events.on(EVENTS.productAdd, (item: Product) => app.addProduct(item))

	// Изменение состояния корзины
	events.on(EVENTS.productDelete, (item: Product) => app.removeProduct(item))

  // Переключения состояния товара
	events.on(EVENTS.productToggle, handlers.productToggle)

  // Изменение состояния корзины
	events.on(EVENTS.basketChanged, handlers.basketChanged)

  // Открытие корзины
	events.on(EVENTS.basketOpen, () => { modal.render({ content: components.basket.render({})})})

	// Изменение счетчика корзины
	events.on(EVENTS.counterChanged, () => page.counter = app.basket.length)

  // Изменен способ оплаты
	events.on(EVENTS.paymentToggle, handlers.paymentToggle)

  // Заполнена форма доставки
	events.on(EVENTS.deliveryReady, () => components.delivery.success = true)

  // Заполнена форма данных о контакте
	events.on(EVENTS.contactsReady, () => components.contacts.success = true)
};

/**
 * Инициализация приложения
 */
const initApp = () => {
	subscribeToEvents();

	// Загрузка каталога товаров
	api.getProductList()
		.then(app.setCatalog.bind(app))
		.catch(console.error);
};

// Запуск приложения
initApp();
