---
layout: '#layout/Publication.astro'
---
# Тестовое задание One Vision.

<details>
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
  author: User,
  text: string,
  createdAt: Date,
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
// 
class Database {
	constructor() {}

	async getChats(user: User): Chat[] {}

	async loadMessagesBefore(chat: Chat, date: Date) {}
	
	async loadMessagesAfter(chat: Chat, date: Date) {}

	subscribeToMessages(chat: Chat, callback: Function) {}

	createMessage(chat: Chat, message: Message) {}
}
```

```ts
// Created from Database.
// Creates or uses existing WS connection.
// Updates database on messages
class SyncEngine {
  constructor(database) {}

	connect() {}

	disconnect() {}
}
``` 

#### UI Components
```ts
// Inits or connects to database
class OneChat extends HtmlElement {
	constructor() {}

  connectedCallback() {}

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


}

// Wraps content editable element
class OneChatMessageBox extends HtmlElement {
  // ... Web component methods ...

  // Sanitizes input, translates it into markdown model
  onInput() {}

	send() {}
}

// Wraps the button of file type file, handles attachment behaviour
// Has attribute onAttachment that gets 
class OneChatAttachment extends HtmlElement {
  // ... Web component methods ...
}

```

### Ограничения решения
- веб-компоненты не поддерживают серверный рендеринг, но для компонента чата это не актуально
- удаление и обновление сообщений после отправки не обрабатывается

### Что еще можно улучшить
- подготовить внутренние веб-компоненты чтобы можно было использовать без родительского
