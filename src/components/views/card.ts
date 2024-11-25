import {Component} from "../base/component";
import {IProduct, IActions} from "../../types";
import {ensureElement} from "../../utils/utils";

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
 * @extends Component<IProduct>
 */
export class Card extends Component<IProduct> {
  protected _title: HTMLElement;
  protected _price: HTMLElement;
  protected _image?: HTMLImageElement;
  protected _description?: HTMLElement;
  protected _button?: HTMLButtonElement;
  protected _category?: HTMLElement;
  protected _index?: HTMLElement;
  protected _buttonTitle: string;

  /**
   * Создает экземпляр карточки товара
   * @param {HTMLElement} container - Контейнер карточки
   * @param {IActions} [actions] - Обработчики событий
   */
  constructor(container: HTMLElement, actions?: IActions) {
    super(container);

    // Инициализация элементов карточки
    this._title = ensureElement<HTMLElement>('.card__title', container);
    this._price = ensureElement<HTMLElement>('.card__price', container);
    this._image = container.querySelector('.card__image');
    this._button = container.querySelector('.card__button');
    this._description = container.querySelector('.card__text');
    this._category = container.querySelector('.card__category');
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
   * Устанавливает идентификатор карточки
   * @param {string} value - Идентификатор
   */
  set id(value: string) {
    this.container.dataset.id = value;
  }

  /**
   * Получает идентификатор карточки
   * @returns {string} Идентификатор
   */
  get id(): string {
    return this.container.dataset.id || '';
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
   * Устанавливает цену товара
   * @param {number | null} value - Цена
   */
  set price(value: number | null) {
    this.setText(this._price, value ? `${value.toString()} синапсов` : '');
    this.disableButton(value);
  }

  /**
   * Получает цену товара
   * @returns {number} Цена
   */
  get price(): number {
    return Number(this._price.textContent || '');
  }

  /**
   * Устанавливает категорию товара
   * @param {string} value - Категория
   */
  set category(value: string) {
    this.setText(this._category, value);
    this._category.classList.add(this.classByCategory(value));
  }

  /**
   * Получает категорию товара
   * @returns {string} Категория
   */
  get category(): string {
    return this._category.textContent || '';
  }

  /**
   * Устанавливает индекс товара в корзине
   * @param {string} value - Индекс
   */
  set index(value: string) {
    this._index.textContent = value;
  }

  /**
   * Получает индекс товара в корзине
   * @returns {string} Индекс
   */
  get index(): string {
    return this._index.textContent || '';
  }

  /**
   * Устанавливает изображение товара
   * @param {string} value - URL изображения
   */
  set image(value: string) {
    this.setImage(this._image, value, this.title);
  }

  /**
   * Устанавливает описание товара
   * @param {string} value - Описание
   */
  set description(value: string) {
    this.setText(this._description, value);
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
   * Определяет CSS-класс по категории товара
   * @param {string} value - Категория
   * @returns {string} CSS-класс
   */
  private classByCategory(value: string): string {
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
