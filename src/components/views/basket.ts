import { Component } from '../base/component';
import { EventEmitter } from '../base/events';
import { createElement, ensureElement } from '../../utils/utils';
import { IBasket } from '../../types';

/**
 * Класс управления корзиной товаров
 */
export class Basket extends Component<IBasket> {
  protected _productList: HTMLElement;
  protected _totalCost: HTMLElement;
  protected _button: HTMLButtonElement;

  /**
   * Создает экземпляр корзины
   * @param {HTMLElement} container - Контейнер корзины
   * @param {EventEmitter} events - Система событий
   */
  constructor(container: HTMLElement, protected events: EventEmitter) {
    super(container);

    // Инициализация элементов корзины
    this._productList = ensureElement<HTMLElement>('.basket__list', this.container);
    this._totalCost = ensureElement<HTMLElement>('.basket__price', this.container);
    this._button = ensureElement<HTMLButtonElement>('.basket__button', this.container);

    // Добавление обработчика клика по кнопке заказа
    this._button.addEventListener('click', () => {
      events.emit('order:open');
    });

    // Начальная инициализация
    this.productList = [];
    this.toggleButton(true);
  }

  /**
   * Устанавливает элементы корзины
   * @param {HTMLElement[]} items - Массив элементов корзины
   */
  set productList(items: HTMLElement[]) {
    if (items.length) {
      this._productList.replaceChildren(...items);
    } else {
      this._productList.replaceChildren(
        createElement<HTMLParagraphElement>('p', {
          textContent: 'Корзина пуста'
        })
      );
    }
  }

  /**
   * Устанавливает общую стоимость
   * @param {number} total - Общая сумма
   */
  set totalCost(total: number) {
    this.setText(this._totalCost, `${total.toString()} синапсов`);
  }

  /**
   * Включает/выключает кнопку заказа
   * @param {boolean} disabled - Флаг блокировки кнопки
   */
  toggleButton(disabled: boolean) {
    this._button.disabled = disabled;
  }
}
