import { Model } from '../base/model';
import { IProduct, IOrder, IDelivery, IContact, IAppState, FormErrors } from '../../types';
import { Product } from './product';
import { EVENTS } from '../../utils/constants';

/**
 * Основной класс приложения, управляющий состоянием магазина
 */
export class App extends Model<IAppState> {
  /** Корзина с выбранными товарами */
  basket: Product[] = [];

  /** Каталог товаров */
  catalog: Product[];

  /** Информация о заказе */
  order: IOrder = {
    payment: 'online',
    address: '',
    email: '',
    phone: '',
    total: null,
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
  addProduct(product: Product): void {
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
  removeProduct(product: Product): void {
    this.basket = this.basket.filter((it) => it !== product);
    this.updateBasket();
  }

  /**
   * Устанавливает каталог товаров
   * @param catalogs Массив товаров для каталога
   */
  setCatalog(catalogs: IProduct[]): void {
    this.catalog = catalogs.map(catalog => new Product(catalog, this.events));
    this.emitChanges(EVENTS.itemsChanged, { catalog: this.catalog});
  }

  /**
   * Устанавливает товар для предпросмотра
   * @param product Товар для предпросмотра
   */
  setPreview(product: Product): void {
    this.productPreviewId = product.id;
    this.emitChanges(EVENTS.previewChange, product);
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
  setContact(field: keyof IContact, value: string): void {
    this.order[field] = value;
    if(this.validateContact()) {
      this.events.emit(EVENTS.contactReady, this.order);
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
      total: null,
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
    this.events.emit(EVENTS.formErrorsChange, this.formErrors);
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
    this.events.emit(EVENTS.formErrorsChange, this.formErrors);
    return Object.keys(errors).length === 0;
  }
}
