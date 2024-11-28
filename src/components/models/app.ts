import { Model } from '../base/model';
import { IOrder, IDelivery, IContacts, IAppState, FormErrors, RemoteAPI } from '../../types';
import { EVENTS } from '../../utils/constants';

/**
 * Основной класс приложения, управляющий состоянием магазина
 */
export class App extends Model<IAppState> {
  /** Корзина с выбранными товарами */
  basket: RemoteAPI.IProduct[] = [];

  /** Каталог товаров */
  catalog: RemoteAPI.IProduct[];

  /** Информация о заказе */
  order: IOrder = {
    payment: 'online',
    address: '',
    email: '',
    phone: '',
    total: 0,
    items: []
  };

  /** Ошибки валидации форм */
  formErrors: FormErrors = {};

  /** ID товара для предпросмотра */
  productPreviewId: string | null;

  /**
   * Добавляет товар в корзину
   * @param product Товар для добавления
   */
  addProduct(product: RemoteAPI.IProduct): void {
    if(!this.basket.includes(product)) {
      this.basket.push(product);
      this.updateBasket();
    }
  }

  /**
   * Очищает корзину
   */
  removeBasket(): void {
    this.basket = [];
    this.updateBasket();
  }

  /**
   * Удаляет товар из корзины
   * @param product Товар для удаления
   */
  removeProduct(product: RemoteAPI.IProduct): void {
    this.basket = this.basket.filter((it) => it !== product);
    this.updateBasket();
  }

  /**
   * Устанавливает каталог товаров
   * @param catalogs Массив товаров для каталога
   */
  setCatalog(catalogs: RemoteAPI.IProduct[]): void {
    this.catalog = catalogs;
    this.emitChanges(EVENTS.itemsChanged, { catalog: this.catalog});
  }

  /**
   * Устанавливает товар для предпросмотра
   * @param product Товар для предпросмотра
   */
  setPreview(product: RemoteAPI.IProduct): void {
    this.productPreviewId = product.id;
    this.emitChanges(EVENTS.previewChanged, product);
  }

  /**
   * Задает поле доставки в заказе
   * @param field Ключ поля доставки
   * @param value Новое значение
   */
  setDelivery(field: keyof IDelivery, value: string): void {
    this.order[field] = value;
    if(this.validateDelivery()) {
      this.events.emit(EVENTS.deliveryReady, this.order);
    }
  }

  /**
   * Задает контактные данные в заказе
   * @param field - Ключ поля контактных данных
   * @param value - Новое значение
   */
  setContact(field: keyof IContacts, value: string): void {
    this.order[field] = value;
    if(this.validateContact()) {
      this.events.emit(EVENTS.contactsReady, this.order);
    }
  }

  /**
   * Сбрасывает данные заказа к начальным значениям
   */
  removeOrder(): void {
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
   * Оповещает об изменениях в корзине
   */
  private updateBasket(): void {
    this.emitChanges(EVENTS.counterChanged, this.basket);
    this.emitChanges(EVENTS.basketChanged, this.basket);
  }

  /**
   * Проверяет валидность данных доставки
   * @return boolean - Признак валидных данных
   */
  validateDelivery(): boolean {
    const errors: typeof this.formErrors = {};

    if (!this.order.address.trim()) {
      errors.address = 'Необходимо указать адрес';
    }

    this.formErrors = errors;
    this.events.emit(EVENTS.formErrorsChanged, this.formErrors);
    return Object.keys(errors).length === 0;
  }

  /**
   * Проверяет валидность контактных данных
   * @return boolean - Признак валидных данных
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
    this.events.emit(EVENTS.formErrorsChanged, this.formErrors);
    return Object.keys(errors).length === 0;
  }
}
