import { Form } from './form';
import { IContacts } from '../../../types';
import { IEvents } from '../../base/events';

/**
 * Класс для управления формой контактных данных
 */
export class Contacts extends Form<IContacts> {
    /**
     * Создает экземпляр формы контактных данных
     * @param {HTMLFormElement} container - HTML элемент формы
     * @param {IEvents} events - Система событий
     */
    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);
    }
}
