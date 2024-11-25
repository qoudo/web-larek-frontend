/**
 * Абстрактный базовый компонент, предоставляющий общую функциональность для работы с DOM
 * @template T - Тип данных компонента
 */
export abstract class Component<T> {
    /**
     * Создает экземпляр базового компонента
     * @param container - Корневой DOM-элемент компонента
     */
    protected constructor(protected readonly container: HTMLElement) {}

    /**
     * Переключает CSS-класс у элемента
     * @param element - DOM-элемент
     * @param className - Имя класса
     * @param force - Принудительное состояние (true - добавить, false - удалить)
     */
    protected toggleClass(element: HTMLElement, className: string, force?: boolean): void {
        if (element) {
            element.classList.toggle(className, force);
        }
    }

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
     * Управляет состоянием блокировки элемента
     * @param element - DOM-элемент
     * @param state - Состояние блокировки (true - заблокировать, false - разблокировать)
     */
    protected setDisabled(element: HTMLElement, state: boolean): void {
        if (element) {
            if (state) {
                element.setAttribute('disabled', 'disabled');
            } else {
                element.removeAttribute('disabled');
            }
        }
    }

    /**
     * Скрывает элемент, устанавливая style.display = 'none'
     * @param element - DOM-элемент
     */
    protected setHidden(element: HTMLElement): void {
        if (element) {
            element.style.display = 'none';
        }
    }

    /**
     * Показывает элемент, удаляя свойство display
     * @param element - DOM-элемент
     */
    protected setVisible(element: HTMLElement): void {
        if (element) {
            element.style.removeProperty('display');
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
     * Рендерит компонент с обновленными данными
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
