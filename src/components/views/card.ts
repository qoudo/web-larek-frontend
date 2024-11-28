import { Component } from '../base/component';
import { IProduct, IActions } from '../../types';
import { ensureElement } from '../../utils/utils';

const CATEGORY_STYLES = {
  soft: {
    name: 'софт-скил',
    className: 'card__category_soft',
  },
  hard: {
    name: 'хард-скил',
    className: 'card__category_hard',
  },
  button: {
    name: 'кнопка',
    className: 'card__category_button',
  },
  additional: {
    name: 'дополнительное',
    className: 'card__category_additional',
  },
  other: {
    className: 'card__category_other',
  },
};

/**
 * Класс управления карточкой товара
 */
export class Card extends Component<IProduct> {
  protected _title: HTMLElement;
  protected _description?: HTMLElement;
  protected _category?: HTMLElement;
  protected _price: HTMLElement;
  protected _image?: HTMLImageElement;
  protected _button?: HTMLButtonElement;
  protected _index?: HTMLElement;

  /**
   * Создает экземпляр карточки товара
   * @param {HTMLElement} container - Контейнер карточки
   * @param {IActions} [actions] - Обработчики событий
   */
  constructor(container: HTMLElement, actions?: IActions) {
    super(container);

    // Инициализация элементов карточки
    this._title = ensureElement<HTMLElement>('.card__title', container);
    this._description = container.querySelector('.card__text');
    this._category = container.querySelector('.card__category');
    this._price = ensureElement<HTMLElement>('.card__price', container);
    this._image = container.querySelector('.card__image');
    this._button = container.querySelector('.card__button');
    this._index = container.querySelector('.basket__item-index');

    // Привязка обработчика клика
    if (actions?.onClick) {
      if (this._button) {
        this._button.addEventListener('click', actions.onClick);
      } else {
        container.addEventListener('click', actions.onClick);
      }
    }
  }

  /**
   * Устанавливает заголовок карточки
   * @param {string} value - Заголовок
   */
  set title(value: string) {
    this.setText(this._title, value);
  }

  /**
   * Получает заголовок карточки
   * @returns {string} Заголовок
   */
  get title(): string {
    return this._title.textContent || '';
  }

  /**
   * Устанавливает описание товара
   * @param {string} value - Описание
   */
  set description(value: string) {
    this.setText(this._description, value);
  }

  /**
   * Устанавливает категорию товара
   * @param {string} value - Категория
   */
  set category(value: string) {
    this.setText(this._category, value);
    this._category.classList.add(this.getStyleCategory(value));
  }

  /**
   * Устанавливает цену товара
   * @param {number | null} value - Цена
   */
  set price(value: number | null) {
    this.setText(this._price, value ? `${value.toString()} синапсов` : 'Бесценно');
    this.disableButton(value);
  }

  /**
   * Устанавливает изображение товара
   * @param {string} value - URL изображения
   */
  set image(value: string) {
    this.setImage(this._image, value, this.title);
  }

  /**
   * Устанавливает индекс товара в корзине
   * @param {string} value - Индекс
   */
  set index(value: string) {
    this._index.textContent = value;
  }

  /**
   * Устанавливает текст кнопки
   * @param {string} value - Текст кнопки
   */
  set buttonTitle(value: string) {
    if (this._button) {
      this._button.textContent = value;
    }
  }

  /**
   * Определяет стили по категории товара
   * @param {string} value - Категория
   * @returns {string} CSS-класс
   */
  private getStyleCategory(value: string): string {
    switch (value) {
      case CATEGORY_STYLES.soft.name:
        return CATEGORY_STYLES.soft.className;
      case CATEGORY_STYLES.hard.name:
        return CATEGORY_STYLES.hard.className;
      case CATEGORY_STYLES.button.name:
        return CATEGORY_STYLES.button.className;
      case CATEGORY_STYLES.additional.name:
        return CATEGORY_STYLES.additional.className;
      default:
        return CATEGORY_STYLES.other.className;
    }
  }
  /**
   * Отключает кнопку если цена не установлена
   * @param {number | null} value - Цена
   */
  private disableButton(value: number | null) {
    if (!value && this._button) {
      this._button.disabled = true;
    }
  }
}
