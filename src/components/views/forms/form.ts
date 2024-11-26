import { Component } from '../../base/component';
import { IFormState } from '../../../types';
import { ensureElement } from '../../../utils/utils';
import { IEvents } from '../../base/events';

/**
 * Базовый класс для работы с формами
 */
export class Form<T> extends Component<IFormState> {
    /** Кнопка отправки формы */
    protected _submitForm: HTMLButtonElement;

    /** Элемент для отображения ошибок */
    protected _errorOutput: HTMLElement;

    /**
     * Создает экземпляр формы
     * @param {HTMLFormElement} container - HTML элемент формы
     * @param {IEvents} events - Событие
     */
    constructor(protected container: HTMLFormElement, protected events: IEvents) {
        super(container);

        this._submitForm = ensureElement<HTMLButtonElement>('button[type=submit]', this.container);
        this._errorOutput = ensureElement<HTMLElement>('.form__errors', this.container);

        // Обработчик изменения полей ввода
        this.container.addEventListener('input', (e: Event) => {
            const target = e.target as HTMLInputElement;
            const field = target.name as keyof T;
            const value = target.value;
            this.onInputChange(field, value);
        });

        // Обработчик отправки формы
        this.container.addEventListener('submit', (e: Event) => {
            e.preventDefault();
            this.events.emit(`${this.container.name}:submit`);
        });
    }

    /**
     * Устанавливает состояние валидности формы
     * @param {boolean} value - Признак валидности
     */
    set success(value: boolean) {
        this._submitForm.disabled = !value;
    }

    /**
     * Устанавливает текст ошибок формы
     * @param {string} value - Текст ошибок
     */
    set errors(value: string) {
        this.setText(this._errorOutput, value);
    }

    /**
     * Обработчик изменения значения в поле ввода
     * @param {keyof T} field - Имя поля формы
     * @param {string} value - Новое значение поля
     */
    protected onInputChange(field: keyof T, value: string): void {
        this.events.emit(`${this.container.name}.${String(field)}:change`, {
            field,
            value
        });
    }

    /**
     * Обновляет состояние формы
     * @param {Partial<T> & IFormState} state - Состояние формы
     * @returns {HTMLFormElement} - HTML элемент формы
     */
    render(state: Partial<T> & IFormState): HTMLFormElement {
        const {success, errors, ...inputs} = state;
        super.render({success, errors});
        Object.assign(this, inputs);
        return this.container;
    }
}
