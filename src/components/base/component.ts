/**
 * Абстрактный базовый компонент, предоставляющий общую функциональность для работы с DOM
 */
export abstract class Component<T> {
    /**
     * Создает экземпляр базового компонента
     * @param container - Корневой DOM-элемент компонента
     */
    protected constructor(protected readonly container: HTMLElement) {}

    /**
     * Устанавливает текстовое содержимое элемента
     * @param element - DOM-элемент
     * @param value - Устанавливаемое значение
     */
    protected setText(element: HTMLElement, value: unknown): void {
        if (element) {
            element.textContent = String(value);
        }
    }

    /**
     * Устанавливает источник изображения и альтернативный текст
     * @param element - DOM-элемент изображения
     * @param src - URL источника изображения
     * @param alt - Альтернативный текст
     */
    protected setImage(element: HTMLImageElement, src: string, alt?: string): void {
        if (element) {
            element.src = src;
            if (alt) {
                element.alt = alt;
            }
        }
    }

    /**
     * Обновляет состояние компонента
     * @param data - Частичные данные для обновления компонента
     * @returns HTML-элемент компонента
     */
    public render(data?: Partial<T>): HTMLElement {
        if (data) {
            Object.assign(this as object, data);
        }
        return this.container;
    }
}
