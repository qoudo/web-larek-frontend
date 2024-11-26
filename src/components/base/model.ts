import { IEvents } from './events';

/**
 * Абстрактный базовый класс для моделей данных
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
     */
    protected emitChanges(event: string, payload: object = {}): void {
        this.events.emit(event, payload);
    }
}
