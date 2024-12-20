import { Component } from '../base/component';
import { IPage } from '../../types';
import { ensureElement } from '../../utils/utils';
import { IEvents } from '../base/events';
import { EVENTS } from '../../utils/constants';

/**
 * Класс, представляющий основную страницу приложения
 */
export class Page extends Component<IPage> {
  /** Счетчик товаров в корзине */
  protected _counter: HTMLElement;
  /** Контейнер для каталога товаров */
  protected _catalog: HTMLElement;
  /** Основная обертка страницы */
  protected _wrapper: HTMLElement;
  /** Кнопка корзины в шапке */
  protected _cartButton: HTMLElement;

  /**
   * Создает экземпляр страницы
   * @param {HTMLElement} container - Корневой элемент страницы
   * @param {IEvents} events - Система событий приложения
   */
  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);

    // Инициализация элементов страницы
    this._counter = ensureElement<HTMLElement>('.header__basket-counter');
    this._catalog = ensureElement<HTMLElement>('.gallery');
    this._wrapper = ensureElement<HTMLElement>('.page__wrapper');
    this._cartButton = ensureElement<HTMLElement>('.header__basket');

    // Привязка обработчика клика по корзине
    this._cartButton.addEventListener('click', this.handleCartClick.bind(this));
  }

  /**
   * Устанавливает значение счетчика товаров в корзине
   * @param {number} value - Количество товаров
   */
  set counter(value: number) {
    this.setText(this._counter, String(value));
  }

  /**
   * Обновляет содержимое каталога
   * @param {HTMLElement[]} items - Массив элементов для отображения в каталоге
   */
  set catalogItems(items: HTMLElement[]) {
    this._catalog.replaceChildren(...items);
  }

  /**
   * Обработчик клика по кнопке корзины
   */
  private handleCartClick(): void {
    this.events.emit(EVENTS.basketOpen);
  }

  /**
   * Управляет блокировкой прокрутки страницы
   * @param {boolean} value - Флаг блокировки
   */
  set wrapperLockScroll(value: boolean) {
    this._wrapper.classList.toggle('page__wrapper_locked', value);
  }
}
