import {Component} from "../base/component";
import {EventEmitter} from "../base/events";
import {createElement, ensureElement} from "../../utils/utils";
import { IBasket } from "../../types";

/**
 * Класс управления корзиной товаров
 * @extends Component<IBasket>
 */
export class Basket extends Component<IBasket> {
  protected _list: HTMLElement;
  protected _total: HTMLElement;
  protected _button: HTMLButtonElement;

  /**
   * Создает экземпляр корзины
   * @param {HTMLElement} container - Контейнер корзины
   * @param {EventEmitter} events - Система событий
   */
  constructor(container: HTMLElement, protected events: EventEmitter) {
    super(container);

    // Инициализация элементов корзины
    this._list = ensureElement<HTMLElement>('.basket__list', this.container);
    this._total = ensureElement<HTMLElement>('.basket__price', this.container);
    this._button = ensureElement<HTMLButtonElement>('.basket__button', this.container);

    // Добавление обработчика клика по кнопке заказа
    this._button.addEventListener('click', () => {
      events.emit('order:open');
    });

    // Начальная инициализация
    this.items = [];
    this.toggleButton(true);
  }

  /**
   * Устанавливает элементы корзины
   * @param {HTMLElement[]} items - Массив элементов корзины
   */
  set items(items: HTMLElement[]) {
    if (items.length) {
      this._list.replaceChildren(...items);
    } else {
      this._list.replaceChildren(
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
  set total(total: number) {
    this.setText(this._total, `${total.toString()} синапсов`);
  }

  /**
   * Включает/выключает кнопку заказа
   * @param {boolean} disabled - Флаг блокировки кнопки
   */
  toggleButton(disabled: boolean) {
    this._button.disabled = disabled;
  }
}
