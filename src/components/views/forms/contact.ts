import { Form } from './form';
import { IContact } from '../../../types';
import { IEvents } from '../../base/events';

/**
 * Класс для управления формой контактных данных
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
}
