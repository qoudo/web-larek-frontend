import { IEvents } from './events';

/**
 * Type guard для проверки является ли объект экземпляром Model
 * @param obj - Проверяемый объект
 * @returns true если объект является экземпляром Model, иначе false
 * @example
 * if (isModel(someObject)) {
 *   // someObject is instance of Model
 * }
 */
export const isModel = (obj: unknown): obj is Model<unknown> => {
    return obj instanceof Model;
}

/**
 * Абстрактный базовый класс для моделей данных
 * @template T - Тип данных модели
 */
export abstract class Model<T> {
    /**
     * Создает экземпляр модели
     * @param data - Начальные данные для инициализации модели
     * @param events - Система событий для оповещения об изменениях
     */
    constructor(data: Partial<T>, protected events: IEvents) {
        Object.assign(this, data);
    }

    /**
     * Оповещает подписчиков об изменениях в модели
     * @param event - Название события
     * @param payload - Дополнительные данные события
     * @example
     * model.emitChanges('userUpdated', { id: 1 });
     */
    protected emitChanges(event: string, payload: object = {}): void {
        this.events.emit(event, payload);
    }
}
