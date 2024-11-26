import { Component } from '../base/component';
import { ensureElement } from '../../utils/utils';
import { IDone, IActions } from '../../types';

/**
 * Класс для отображения окна успешного оформления заказа
 */
export class Done extends Component<IDone> {
    /** Кнопка закрытия окна */
    protected _closeButton: HTMLElement;
    /** Элемент отображения итоговой суммы */
    protected _result: HTMLElement;

    /**
     * Создает экземпляр окна успешного заказа
     * @param {HTMLElement} container - Контейнер компонента
     * @param {IActions} actions - Обработчики событий
     */
    constructor(container: HTMLElement, actions: IActions) {
        super(container);

        // Инициализация элементов
        this._closeButton = ensureElement<HTMLElement>('.order-success__close', this.container);
        this._result = ensureElement<HTMLElement>('.order-success__description', this.container);

        // Добавление обработчика клика на кнопку закрытия
        if (actions?.onClick) {
            this._closeButton.addEventListener('click', actions.onClick);
        }
    }

    /**
     * Устанавливает текст с итоговой суммой заказа
     * @param {string} value - Сумма заказа
     */
    set result(value: string) {
        this._result.textContent = `Списано ${value} синапсов`;
    }
}
