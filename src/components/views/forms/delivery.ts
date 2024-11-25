import {Form} from "./form";
import {IDelivery, IActions} from "../../../types";
import {ensureElement} from "../../../utils/utils";
import { IEvents } from '../../base/events';

/**
 * Класс для управления формой доставки
 * @extends Form<IDelivery>
 */
export class Delivery extends Form<IDelivery> {
  /** Кнопка оплаты картой */
  protected _cardButton: HTMLButtonElement;

  /** Кнопка оплаты наличными */
  protected _cashButton: HTMLButtonElement;

  /**
   * Создает экземпляр формы доставки
   * @param {HTMLFormElement} container - HTML элемент формы
   * @param {IEvents} events - Система событий
   * @param {IActions} [actions] - Обработчики действий
   */
  constructor(container: HTMLFormElement, events: IEvents, actions?: IActions) {
    super(container, events);

    // Инициализация кнопок
    this._cardButton = ensureElement<HTMLButtonElement>('button[name="card"]', this.container);
    this._cashButton = ensureElement<HTMLButtonElement>('button[name="cash"]', this.container);

    // По умолчанию активна кнопка оплаты картой
    this._cardButton.classList.add('button_alt-active');

    // Привязка обработчиков событий, если они предоставлены
    if (actions?.onClick) {
      this._cardButton.addEventListener('click', actions.onClick);
      this._cashButton.addEventListener('click', actions.onClick);
    }
  }

  /**
   * Переключает активное состояние между кнопками оплаты
   */
  toggleButtons(): void {
    this._cardButton.classList.toggle('button_alt-active');
    this._cashButton.classList.toggle('button_alt-active');
  }

  /**
   * Устанавливает значение адреса доставки
   * @param {string} value - Адрес доставки
   */
  set address(value: string) {
    const addressInput = this.container.elements.namedItem('address') as HTMLInputElement;
    if (addressInput) {
      addressInput.value = value;
    }
  }
}
