# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```
## Архитектура

В основе проекта и структуры его классов, используется паттерн _MVP_. Т.к. он обеспечивает хорошую архитектурную организацию, способствует слабой связанности между компонентами.

### Основные классы

#### Класс `EventEmitter`

`EventEmitter` — Класс для управления событиями, позволяет добавлять и удалять слушателей, а также вызывать их в момент возникновения событий.  

**Конструктор**: `constructor()`

**Параметры**:
- `_events: Map<EventName, Set<Subscriber>>` - Приватное свойство, содержащее набор подписчиков для каждого события.

**Методы**:
- `on<T extends object>(eventName: EventName, callback: (event: T) => void)` - Назначает обработчик для указанного события;
- `off(eventName: EventName, callback: Subscriber)` - Удаляет обработчик из события;
- `emit<T extends object>(eventName: string, data?: T)` - Генерирует событие с определённым именем и возможными данными;
- `onAll(callback: (event: EmitterEvent) => void)` - Позволяет регистрировать слушатель для всех событий;
- `offAll()` - Удаляет всех слушателей;
- `trigger<T extends object>(eventName: string, context?: Partial<T>)` - Вызывает колбек и генерирует событие по запросу.

#### Класс `API`

`API` — Обеспечивает взаимодействие с данными, получаемыми с сервера, а также отвечает за отправку HTTP-запросов и обработку их ответов.

**Конструктор**:
`constructor(baseUrl: string, options: RequestInit)` - Конструктор принимает базовый URL и общие настройки для запросов.

**Свойства**:
- `readonly baseUrl: string` - Основной URL для отправки запросов к API;
- `protected options: RequestInit` - Базовые настройки для запросов.

**Методы**:
- `get<T>(uri: string): ApiResponse<T>` - Выполняет `GET` запросы по указанному URI и возвращает промис с ответом сервера;
- `post<T>(uri: string, data: object, method: ApiPostMethods): ApiResponse<T>` - Выполняет `POST` запросы с данными на указанный URI и возвращает промис с ответом.

#### Класс `LarekAPI`

`LarekAPI` — Класс с методами для взаимодействия с сервером, позволяющий получать информацию о товарах как в общем, так и касательно конкретного товара, а также отправлять заказы на сервер. Он наследуется от класса `API`.

**Конструктор**:
`constructor(baseUrl, options)` - Принимает URL для API и параметры запроса.

**Свойства**:
- `cdn: string` - Базовый URL CDN сервера для загрузки изображений;

**Методы**:
- `getProductList(): Promise<RemoteAPI.IProduct[]>` - Получает полный список товаров с сервера;
- `getProductItem(id: string): Promise<RemoteAPI.IProduct>` - Получает информацию о конкретном продукте по его `id`;
- `postOrderProducts(order: IOrder): Promise<RemoteAPI.IOrder>` - Отправляет информацию о заказе на сервер и получает результат.

#### Класс `Model`

`Model` - Абстрактный класс, предназначен для работы с данными.

**Конструктор**:
`constructor(data, events)` - Принимает данные для модели и объект событий для уведомлений об изменениях модели.

**Методы**:
- `emitChanges(action, event)` - Оповещает всех слушателей об изменении модели.

#### Класс `Component`

`Component` — Базовый класс для работы с DOM-элементами. Он предоставляет возможность:
- Отображать/скрывать элементы DOM;
- Изменять атрибуты элемента;
- Добавлять/удалять классы у элементов.

**Конструктор**:
`constructor(container: HTMLElement)` - Принимает контейнер, в котором создаётся элемент.

**Методы**:
- `setContent(element: HTMLElement, value: Record<string, any>)` - Устанавливает содержимое для элемента;
- `setImage (element: HTMLImageElement, src: string, alt?: string)` - Устанавливает картинку;
- `render(data)` - Обновляет компонент.


### Классы для работы с данными

Эти классы предназначены для хранения данных о заказах, корзинах и карточках, полученных с сервера, а также для их отображения и обработки.

#### Класс `Product`

`Product` - Отвечает за хранение данных о продукте. Наследуется от `Model`.

**Конструктор**:
`constructor(data: RemoteAPI.IProduct)` - Принимает данные о товаре.

**Свойства**:
- `id: string` - Идентификатор продукта;
- `title: string` - Название товара;
- `price: number | null` - Цена товара;
- `description: string` - Описание товара;
- `category: string` - Категория товара;
- `image: string` - Изображение продукта.

#### Класс `App`

`App` - Служит основной моделью данных приложения, в которой хранятся каталог товаров, информация о заказе и ошибки валидации форм доставки и контакта. Будет наследоваться от `Model`.

**Конструктор**:
`constructor(data: IAppState)` - Принимающий начальное состояние приложения.

**Методы**:
- `addProduct(product: Product)` - Добавляет товар в корзину;
- `removeBasket()` - Удаляет корзину;
- `removeProduct(product: Product)` - Удаляет товар из корзины;
- `setCatalog(catalogs: IProduct[])` - Заполняет каталог товаров;
- `setPreview(product: Product)` - Устанавливает товар для предпросмотра;
- `setDelivery(field: keyof IDelivery, value: string)` - Заполняет поля формы доставки;
- `setContact(field: keyof IContacts, value: string)` - Заполняет поля формы контакта;
- `removeOrder()` - Удаляет данные заказа;
- `updateBasket()` - Оповещает об изменениях в корзине;
- `validateDelivery()` - Проверяет валидность данных доставки;
- `validateContact()` - Проверяет валидность контактных данных.

**Свойства**:
- `basket: RemoteAPI.Product[]` - Массив товаров в корзине;
- `catalog: RemoteAPI.Product[]` - Массив товаров в каталоге;
- `order: IOrder` - Данные о заказе;
- `formErrors: FormErrors` - Ошибки валидации форм;
- `productPreviewId: string | null` - ID товара для предпросмотра.

### Классы для работы с отображением

Заполняют содержимое HTML-элементов и устанавливают обработчики событий на элементы, используя `EventEmitter`.

#### Класс `Form`

`Form` — Класс для работы с формами. Будет наследоваться от `Component`.

**Конструктор**:
`constructor(container: HTMLFormElement, events: IEvents)` - Принимает контейнер для формы и событие для управления.

**Свойства**:
- `submitForm: HTMLButtonElement` - Кнопка отправки формы;
- `errorOutput: HTMLElement` - Элемент для отображения ошибок валидации форм.

**Методы**:
- `set success(value: boolean)` - Сеттер для валидности формы, задает значение статуса success;
- `set errors(value: string)` - Сеттер для ошибок валидации формы;
- `onInputChange(field: keyof T, value: string)` - Обработчик событий ввода, который генерирует события изменения для каждого поля.
- `render(state: Partial<T> & IFormState)` - Обновляет состояние формы с заданными значениями валидности, ошибками и значениями полей;

#### Класс `Contacts`

`Contacts` — Класс для работы с формой контактов. Будет наследоваться от `Form`.

**Конструктор**:
`constructor(container: HTMLFormElement, events: IEvents)` - Принимает контейнер для формы и событие для управления.

#### Класс `Delivery`

`Delivery` — Класс для работы с формой доставки. Будет наследоваться от `Form`.

**Конструктор**:
`constructor(container: HTMLFormElement, events: IEvents)` - Принимает контейнер для формы и событие для управления.

**Свойства**:
- `cardButton: HTMLButtonElement` - Кнопка оплатить "Онлайн";
- `cashButton: HTMLButtonElement` - Кнопка оплатить "При получении"".

**Методы**:
- `set toggleButtons()` - Изменяет состояние кнопок оплаты, в зависимости от выбранной.

#### Класс `Modals`

`Modals` — предназначен для работы с модальными окнами. Будет наследоваться от `Component`.

**Конструктор**:
`constructor(container: HTMLElement, events: IEvents)` - Принимает контейнер для модального окна и событие для управления.  

**Свойства**:
- `closeButton: HTMLButtonElement` - Кнопка закрытия модального окна;
- `content: HTMLElement` - Контент модального окна.

**Методы**:
- `set content(value: HTMLElement)` - Сеттер для содержимого модального окна;
- `open()` - Открывает модальное окно;
- `close()` - Закрывает модальное окно;
- `render(data: IModal)` - Обновляет модальное окно.

#### Класс `Page`

`Page` - Предназначен для отображения и управления всеми элементами на странице, такими как каталог товаров и количество товаров в корзине. Будет наследоваться от `Component`.

**Конструктор**:
`constructor(container: HTMLElement, events: IEvents)` - Принимает контейнер для страницы и объект для управления событиями.

**Свойства**:
- `counter: HTMLElement;` - Счётчик корзины;
- `catalog: HTMLElement;` - Каталог товаров;
- `wrapper: HTMLElement;` - Обертка страницы;
- `сartButton: HTMLElement;` - Кнопка корзины;

**Методы**:
- `set counter(value: number)` - Сеттер для изменения кол-ва товаров в корзине;
- `set catalogItems(items: HTMLElement[])` - Сеттер задает элементы каталога;
- `set handleCartClick()` - Обработчик клика по кнопке корзины;
- `set wrapperLockScroll(value: boolean)` - Блокирует скролл страницы;

#### Класс `Card`

`Card` — Будет наследоваться от `Component`. Предназначенный для работы с карточкой товара, а точнее: 
 - Создание экземпляров карточек по шаблону;
 - Отображение карточкой товара в каталоге и корзине;
 - Обработка событий пользователя.

**Конструктор**:
`constructor(teamplate: HTMLElement, actions: IActions)` - Принимает шаблон карточки и действие.

**Свойства**:
- `title: HTMLElement` - Заголовок;
- `description: HTMLElement` - Описание;
- `category: HTMLElement` - Элемент для категории товара;
- `price: HTMLElement` - Цена;
- `image: HTMLImageElement` - Картинка;
- `button: HTMLButtonElement` - Кнопка действия на карточке;
- `index: HTMLElement` - Индекс элемента;

**Методы**:
- `set title(value: string)` - Сеттер заголовка;
- `set description(value: string)` - Сеттер описания;
- `set category(value: string)` - Сеттер категории;
- `set price(value: number)` - Сеттер цены;
- `set image(value: string)` - Сеттер изображения;
- `set index(value: string)` - Сеттер индекса товара;
- `set buttonTitle(value: string)` - Сеттер текста кнопки;
- `get title()` - Геттер заголовка;
- `classByCategory(value: string)` - Устанавливает текст кнопки;
- `disableButton(value: number || null)` - Отключает кнопку карточки;

#### Класс `Basket`

`Basket` — Отвечает за отображение корзины, включающий список товаров и общую стоимость. Будет наследоваться от `Component`.

**Конструктор**:
`constructor(container: HTMLElement, events: EventEmitter)` - Принимающий контейнер и элемент для управления событиями.

**Свойства**:
- `productList: HTMLElement` - Коллекция товаров.
- `totalCost: HTMLElement` - Стоимость товаров.
- `_button: HTMLElement` - Кнопка корзины.

**Методы класса**:
- `set productList(items: HTMLElement[])` - Сеттер, устанавливает список товаров;
- `set totalCost(total: number)` - Сеттер, устанавливает общую стоимость;
- `set toggleButton(disabled: boolean)` - Включает/выключает кнопку заказа;


#### Класс `Done`

`Done` - Используется для отображения элемента интерфейса с сообщением о том, что операция была выполнена успешно. Наследуется от класса `Component`.

`constructor(container: HTMLElement, actions: IActions)` - Принимающий контейнер и элемент для управления событиями.

**Свойства**:
- `closeButton: HTMLButtonElement;` - Кнопка закрытия сообщения;
- `result: HTMLElement;` - Сообщение о деталях успешной операции.

**Методы**:
- `set result(value: string)` - Сеттер сообщения об итоговой стоимости операции.

## Описание событий

| Событие              | Описание                                          |
|----------------------|---------------------------------------------------|
| `items:changed`      | Событие изменения списка товаров                  |
| `preview:changed`    | Событие изменения предпросмотра товара            |
| `counter:changed`    | Событие изменения счетчика                        |
| `basket:changed`     | Событие изменения корзины                         |
| `formErrors:changed` | Событие изменения ошибок в форме                  |
| `delivery:ready`     | Событие готовности формы доставки                 |
| `contacts:ready`     | Событие готовности контактных данных              |
| `payment:toggle`     | Событие переключения способа оплаты               |
| `product:toggle`     | Событие переключения товара (добавление/удаление) |
| `order:submit`       | Событие отправки заказа                           |
| `contacts:submit`    | Событие отправки контактных данных                |
| `basket:open`        | Событие открытия корзины                          |
| `order:open`         | Событие открытия формы заказа                     |
| `modal:open`         | Событие открытия модального окна                  |
| `card:select`        | Событие выбора карты оплаты                       |
| `product:add`        | Событие добавления товара                         |
| `product:delete`     | Событие удаления товара                           |
| `modal:close`        | Событие закрытие модального окна                  |
