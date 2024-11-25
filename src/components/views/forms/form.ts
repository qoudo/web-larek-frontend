import { Component } from "../../base/component";
import { IFormState } from "../../../types";
import { ensureElement } from "../../../utils/utils";
import { IEvents } from '../../base/events';

/**
 * Базовый класс для работы с формами
 * @template T - Тип данных формы
 * @extends Component<IFormState>
 */
export class Form<T> extends Component<IFormState> {
    /** Кнопка отправки формы */
    protected _submit: HTMLButtonElement;

    /** Элемент для отображения ошибок */
    protected _errors: HTMLElement;

    /**
     * Создает экземпляр формы
     * @param {HTMLFormElement} container - HTML элемент формы
     * @param {IEvents} events - Система событий
     */
    constructor(protected container: HTMLFormElement, protected events: IEvents) {
        super(container);

        this._submit = ensureElement<HTMLButtonElement>('button[type=submit]', this.container);
        this._errors = ensureElement<HTMLElement>('.form__errors', this.container);

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
     * Обработчик изменения значения в поле ввода
     * @param {keyof T} field - Имя поля формы
     * @param {string} value - Новое значение поля
     * @protected
     */
    protected onInputChange(field: keyof T, value: string): void {
        this.events.emit(`${this.container.name}.${String(field)}:change`, {
            field,
            value
        });
    }

    /**
     * Устанавливает состояние валидности формы
     * @param {boolean} value - Признак валидности
     */
    set valid(value: boolean) {
        this._submit.disabled = !value;
    }

    /**
     * Устанавливает текст ошибок формы
     * @param {string} value - Текст ошибок
     */
    set errors(value: string) {
        this.setText(this._errors, value);
    }

    /**
     * Отрисовывает состояние формы
     * @param {Partial<T> & IFormState} state - Состояние формы
     * @returns {HTMLFormElement} - HTML элемент формы
     */
    render(state: Partial<T> & IFormState): HTMLFormElement {
        const {valid, errors, ...inputs} = state;
        super.render({valid, errors});
        Object.assign(this, inputs);
        return this.container;
    }
}
