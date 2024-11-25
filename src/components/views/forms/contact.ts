import { Form } from "./form";
import { IContact } from "../../../types";
import { IEvents } from '../../base/events';

/**
 * Класс для управления формой контактных данных
 * @extends Form<IContact>
 */
export class Contact extends Form<IContact> {
    /**
     * Создает экземпляр формы контактных данных
     * @param {HTMLFormElement} container - HTML элемент формы
     * @param {IEvents} events - Система событий
     */
    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);
    }

    /**
     * Устанавливает значение телефона в форме
     * @param {string} value - Номер телефона
     */
    set phone(value: string) {
        const phoneInput = this.container.elements.namedItem('phone') as HTMLInputElement;
        if (phoneInput) {
            phoneInput.value = value;
        }
    }

    /**
     * Устанавливает значение email в форме
     * @param {string} value - Email адрес
     */
    set email(value: string) {
        const emailInput = this.container.elements.namedItem('email') as HTMLInputElement;
        if (emailInput) {
            emailInput.value = value;
        }
    }
}
