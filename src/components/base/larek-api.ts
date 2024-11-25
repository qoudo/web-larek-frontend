import { Api, ApiListResponse } from './api';
import { RemoteAPI, IProduct, IOrder, ILarekAPI } from "../../types";

/**
 * Класс для работы с API интернет-магазина Ларек
 * @extends Api
 * @implements ILarekAPI
 */
export class LarekAPI extends Api implements ILarekAPI {
  /** Базовый URL CDN сервера для загрузки изображений */
  readonly cdn: string;

  /**
   * Создает экземпляр API клиента
   * @param {string} cdn - Базовый URL CDN сервера
   * @param {string} baseUrl - Базовый URL API
   * @param {RequestInit} [options] - Дополнительные опции для fetch запросов
   */
  constructor(cdn: string, baseUrl: string, options?: RequestInit) {
    super(baseUrl, options);
    this.cdn = cdn;
  }

  /**
   * Получает информацию о конкретном товаре
   * @param {string} id - Идентификатор товара
   * @returns {Promise<IProduct>} Промис с данными товара
   */
  getProductItem(id: string): Promise<IProduct> {
    return this.get(`/product/${id}`).then(
      (item: IProduct) => ({
        ...item,
        image: this.cdn + item.image, // Добавляем CDN префикс к пути изображения
      })
    );
  }

  /**
   * Получает список всех доступных товаров
   * @returns {Promise<RemoteAPI.IProduct[]>} Промис со списком товаров
   */
  getProductList(): Promise<RemoteAPI.IProduct[]> {
    return this.get('/product').then((data: ApiListResponse<RemoteAPI.IProduct>) =>
      data.items.map((item) => ({
        ...item,
        image: this.cdn + item.image // Добавляем CDN префикс к путям изображений
      }))
    );
  }

  /**
   * Отправляет заказ на сервер
   * @param {IOrder} order - Данные заказа
   * @returns {Promise<RemoteAPI.IOrder>} Промис с данными созданного заказа
   */
  orderProducts(order: IOrder): Promise<RemoteAPI.IOrder> {
    return this.post(`/order`, order).then(
      (data: RemoteAPI.IOrder) => data
    );
  }
}
