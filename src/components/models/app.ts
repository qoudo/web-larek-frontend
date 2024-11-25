import {Model} from "../base/model";
import {IProduct, IOrder, IDelivery, IContact, IAppState, FormErrors} from "../../types";
import { Product } from './product';

/**
 * Основной класс приложения, управляющий состоянием магазина
 * @extends Model<IAppState>
 */
export class App extends Model<IAppState> {
  /** Каталог товаров */
  catalog: Product[];

  /** Корзина с выбранными товарами */
  basket: Product[] = [];

  /** Информация о заказе */
  order: IOrder = {
    payment: 'online',
    address: '',
    email: '',
    phone: '',
    total: 0,
    items: []
  };

  /** ID товара для предпросмотра */
  preview: string | null;

  /** Ошибки валидации форм */
  formErrors: FormErrors = {};

  /** Константы для событий */
  private static readonly EVENTS = {
    ITEMS_CHANGED: 'items:changed',
    PREVIEW_CHANGED: 'preview:changed',
    COUNTER_CHANGED: 'counter:changed',
    BASKET_CHANGED: 'basket:changed',
    DELIVERY_READY: 'delivery:ready',
    CONTACT_READY: 'contact:ready',
    FORM_ERRORS: 'formErrors:change'
  } as const;

  /**
   * Очищает корзину
   */
  clearBasket(): void {
    this.basket = [];
    this.updateBasket();
  }

  /**
   * Сбрасывает данные заказа к начальным значениям
   */
  clearOrder(): void {
    this.order = {
      payment: 'online',
      address: '',
      email: '',
      phone: '',
      total: 0,
      items: []
    };
  }

  /**
   * Устанавливает каталог товаров
   * @param items - Массив товаров для каталога
   */
  setCatalog(items: IProduct[]): void {
    this.catalog = items.map(item => new Product(item, this.events));
    this.emitChanges(App.EVENTS.ITEMS_CHANGED, { catalog: this.catalog});
  }

  /**
   * Устанавливает товар для предпросмотра
   * @param item - Товар для предпросмотра
   */
  setPreview(item: Product): void {
    this.preview = item.id;
    this.emitChanges(App.EVENTS.PREVIEW_CHANGED, item);
  }

  /**
   * Оповещает об изменениях в корзине
   */
  private updateBasket(): void {
    this.emitChanges(App.EVENTS.COUNTER_CHANGED, this.basket);
    this.emitChanges(App.EVENTS.BASKET_CHANGED, this.basket);
  }

  /**
   * Добавляет товар в корзину
   * @param item - Товар для добавления
   */
  addToBasket(item: Product): void {
    if(!this.basket.includes(item)) {
      this.basket.push(item);
      this.updateBasket();
    }
  }

  /**
   * Удаляет товар из корзины
   * @param item - Товар для удаления
   */
  removeFromBasket(item: Product): void {
    this.basket = this.basket.filter((it) => it !== item);
    this.updateBasket();
  }

  /**
   * Обновляет поле доставки в заказе
   * @param field - Ключ поля доставки
   * @param value - Новое значение
   */
  setDeliveryField(field: keyof IDelivery, value: string): void {
    this.order[field] = value;
    if(this.validateDelivery()) {
      this.events.emit(App.EVENTS.DELIVERY_READY, this.order);
    }
  }

  /**
   * Обновляет контактные данные в заказе
   * @param field - Ключ поля контактных данных
   * @param value - Новое значение
   */
  setContactField(field: keyof IContact, value: string): void {
    this.order[field] = value;
    if(this.validateContact()) {
      this.events.emit(App.EVENTS.CONTACT_READY, this.order);
    }
  }

  /**
   * Проверяет валидность данных доставки
   * @returns true если данные валидны, иначе false
   */
  validateDelivery(): boolean {
    const errors: typeof this.formErrors = {};

    if (!this.order.address.trim()) {
      errors.address = "Необходимо указать адрес";
    }

    this.formErrors = errors;
    this.events.emit(App.EVENTS.FORM_ERRORS, this.formErrors);
    return Object.keys(errors).length === 0;
  }

  /**
   * Проверяет валидность контактных данных
   * @returns true если данные валидны, иначе false
   */
  validateContact(): boolean {
    const errors: typeof this.formErrors = {};

    if(!this.order.email.trim()) {
      errors.email = 'Необходимо указать email';
    }
    if (!this.order.phone.trim()) {
      errors.phone = 'Необходимо указать телефон';
    }

    this.formErrors = errors;
    this.events.emit(App.EVENTS.FORM_ERRORS, this.formErrors);
    return Object.keys(errors).length === 0;
  }
}
