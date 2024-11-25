import { Model } from '../base/model';
import { RemoteAPI } from '../../types';

/**
 * Событие изменения каталога товаров
 */
export type CatalogChangeEvent = {
	catalog: Product[];
};

/**
 * Класс, представляющий товар в магазине
 * @extends Model<RemoteAPI.IProduct>
 */
export class Product extends Model<RemoteAPI.IProduct> {
	/** Уникальный идентификатор товара */
	id: string;
	/** Название товара */
	title: string;
	/** Цена товара */
	price: number | null;
	/** Описание товара */
	description: string;
	/** Категория товара */
	category: string;
	/** URL изображения товара */
	image: string;
}
