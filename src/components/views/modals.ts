import { Component } from '../base/component';
import { ensureElement } from '../../utils/utils';
import { IModal } from '../../types';
import { IEvents } from '../base/events';

/**
 * Класс для управления модальными окнами
 */
export class Modals extends Component<IModal> {
    /** Кнопка закрытия модального окна */
    protected _closeButton: HTMLButtonElement;
    /** Контейнер для содержимого модального окна */
    protected _content: HTMLElement;

    /**
     * Создает экземпляр модального окна
     * @param {HTMLElement} container - Контейнер компонента
     * @param {IEvents} events - Система событий приложения
     */
    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);

        // Инициализация элементов
        this._closeButton = ensureElement<HTMLButtonElement>('.modal__close', container);
        this._content = ensureElement<HTMLElement>('.modal__content', container);

        // Установка обработчиков событий
        this._closeButton.addEventListener('click', this.close.bind(this));
        this.container.addEventListener('click', this.close.bind(this));
        // Предотвращение закрытия при клике на контент
        this._content.addEventListener('click', (event) => event.stopPropagation());
    }

    /**
     * Устанавливает содержимое модального окна
     * @param {HTMLElement} value - HTML элемент для отображения в модальном окне
     */
    set content(value: HTMLElement) {
        this._content.replaceChildren(value);
    }

    /**
     * Открывает модальное окно
     */
    open() {
        this.container.classList.add('modal_active');
        this.events.emit('modal:open');
    }

    /**
     * Закрывает модальное окно и очищает содержимое
     */
    close() {
        this.container.classList.remove('modal_active');
        this.content = null;
        this.events.emit('modal:close');
    }

    /**
     * Обновляет модальное окно с переданными данными
     * @param {IModal} data - Данные для отображения
     * @returns {HTMLElement} Контейнер модального окна
     */
    render(data: IModal): HTMLElement {
        super.render(data);
        this.open();
        return this.container;
    }
}
