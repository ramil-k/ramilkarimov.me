---
layout: '#layout/Publication.astro'
---
# Тестовое задание One Vision.

<details class="my-3">
<summary><b>Текст задания</b></summary>

Компания “OneCar” предоставляет услуг по ремонту автомобилей. У них уже есть сайт где	можно зарегистрироваться, записаться на ремонт или обслуживание, отследить статус ремонта и полную смету.

Теперь компания хочет добавить на свой сайт небольшую форму с чатом для общения с	клиентами. В чате нужны следующие возможности:

- Отображать все сообщения из диалога с датой отправки и именами участников (сотрудников компании и клиента)
- Отправлять сообщения в чат
- Прикреплять фотографии и документы к сообщениям
- Отображать и менять статус доставки сообщения
- Отвечать на определенные сообщения при помощи цитирования
- Искать по содержимому сообщений
- Уведомлять пользователя/сотрудника о появлении нового сообщения
- (Дополнительно) Иметь возможность базового форматирования (B, U, I, маркеры, гиперссылки) при отправке сообщения

Необходимо продумать подход к разработке и структуру компонента для чата и предоставить в качестве результата выполнения задания:

- Список необходимых классов для реализации компонента с набором методов и свойств
- Описание механизмов взаимодействия классов, набора вызываемых событий и статусов
- Структуру данных для взаимодействия с сервером при получении и отправки сообщений

Нужен только макет компонента с использованием ES6 классов, без его реализации.
</details>

## Допущения
- Данные пользователя хранятся в JWT-токене в local storage с ключом "jwt".
- Путь к API и веб сокету хранится в local storage с ключом API_PATH и WS_PATH.
- Поддерживаем только современные версии браузеров, это обеспечивает нам поддержку script type=module и веб-компонентов.

## Решение
- Реализовать чат как веб-компонент.
- Реализовать хранение сообщений в indexed DB.
- Реализовать синхронизацию сообщений через веб сокет.
- Реализовать оптимистичную отправку сообщений.

### Использование

```html
<html>
<head>
  ...
  <script type="module" src="/one-chat.js"></script>
  ...
</head>
<body>
  <main>
    ...
    <one-chat id="chat-id"></one-chat>
    ...
  </main>
</body>
</html>
```

### Структуры данных
Использую TS чтобы описать структуры и связи
```ts
// JWT token payload contains current User's structure.
type User = {
  id: string,
  name: string,
  role: 'user' | 'support',
};

type Attachment = {
  id: string,
  message: Message,
  // For local files, it's Data url, for external it's URL to the resource
  data: Url, 
  name: string,
  type: 'file' | 'image'

}

type Message = {
  // UUID выдается клиентом при создании
  local_id: string, 
  // UUID выдается сервером при сохранении в БД
  external_id: string,
	status: 'draft' | 'sending' | 'sent' | 'received' | 'read'
  author: User, 
  text: string,
  createdAt: Date,
  // Меняется при смене статусов 
	updatedAt: Date,
  attachments: Attachment[],
}

type Chat = {
  id: string,
  users: User[],
  messages: Message[],
};
```

### Интерфейсы


```ts
class Database {
	constructor() {}

	async getChats(user: User): Chat[] {}

	async loadMessagesBefore(chat: Chat, date: Date) {}
	
	async loadMessagesAfter(chat: Chat, date: Date) {}

	searchMessages(chat: Chat, search: string, onLocalResult: Function, onRemoteResult: Function) {}

	subscribeToMessages(chat: Chat, callback: Function) {}

	createMessage(chat: Chat, message: Message) {}

  // Sends a message to the WS, adds a sent message to the queue.
	// Schedules a task to resend a message from the queue if there is no response in some time
  #sendMessage() {}

  // Called on message from the WS and handles all messages. If the message is a response, it contains the "requestId".
	#onMessage() {}

	// Sends ticks into ws to check if backend is healthy.
	// Tries to reconnect if it's not.
  #heartbeat() {}

	// Creates WS connection and handles reconnects
	#connect() {}

  // Closes WS connection
	#disconnect() {}
}

// Singleton that notifies Database when a notification from Push Subscription is arrived
// Creates push subscriptions
class PushManager {
  constructor() {}

	onMessage() {}
}
```



#### UI Components
```ts
// Inits or connects to database
class OneChat extends HtmlElement {
	constructor() {}

  connectedCallback() {}

  // Closes database connection
  disconnectedCallback() {}

  adoptedCallback() {}

  attributeChangedCallback() {}

}

class OneChatMessages extends HtmlElement {
  // ... Web component methods ...

	// Loads messages after scroll reaches the end via intersection obderver
  loadMore() {}

  // Shows a pop up button when there is a selection within a message 
	showQuoteDialog() {} 

	// Inserts quote markap into current message box into cursor's position
  quote() {}
}

// Wraps content editable element
class OneChatMessageBox extends HtmlElement {
  // ... Web component methods ...

  // Sanitizes input, translates it into markdown model
  onInput() {}

  // Sends new message to database
	// Triggers attachment upload
  send() {}
}

// Wraps the button of file type file, handles attachment behaviour
// Has attribute onAttachment that gets 
class OneChatAttachment extends HtmlElement {
  // ... Web component methods ...

  // Uploads message 
	await upload() {}
}

class OneChatSearch extends HtmlElement {
  // ... Web component methods ...
 
  // Triggers search in local cache and sends a request to search 
  onInput() {}

	// Shows preview of messages that was found in the local cache.
	onLocalSearch() {}

	// Merges result of remote and local searches. First shows local results, then remote results. 
	onRemoteSearch() {}
}
```

### Ограничения решения
- веб-компоненты не поддерживают серверный рендеринг, но для компонента чата это не актуально
- удаление и обновление сообщений после отправки не обрабатывается

### Что еще можно улучшить
- подготовить внутренние веб-компоненты чтобы можно было использовать без родительского
- можно будет вынести работу с веб сокетом в отдельный класс, но на первом этапе это не обязательно
- проработать обработку ошибок, таких как разрыв соединений
- разобрать работу web push
- разработать индексы для БД чтобы ускорить поиск

