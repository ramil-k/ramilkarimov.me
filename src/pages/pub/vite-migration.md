---
layout: '#layout/Publication.astro'
---

# Интеграция Vite во фронтенд OneVizion

## Описание

Заменяю gulp и вообще всё подключение скриптов и стилей на vite. Это дает нам:

- Hot Module Replacement (HMR)
- Корректную сборку с tree-shaking и code splitting
- Автоматический сброс кеша через хеши в именах файлов
- Сборку CSS вместе с JS

## Начальная архитектура

### Dev режим

```mermaid
flowchart LR
    subgraph "Браузер"
        Page[JSP страница]
    end

    subgraph "pageHeader.tag"
        CSS["~100 link тегов CSS"]
        JS["~150 script тегов JS"]
    end

    subgraph "Файловая система"
        Components["components/*.js"]
        NewJS["new/js/*.js"]
        GridJS["new/grid/js/*.js"]
        CSSFiles["components/**/*.css"]
    end

    Page --> CSS
    Page --> JS
    CSS --> CSSFiles
    JS --> Components
    JS --> NewJS
    JS --> GridJS
```

### Prod режим: сборка

```mermaid
flowchart LR
    subgraph "Сборка (Gulp)"
        Deporder["gulp-deporder<br/>сортировка по @requires"]
        Concat[gulp-concat]
        Terser[gulp-terser]
    end

    subgraph "Результат"
        Bundle["bundle.js"]
        BundleCSS["bundle.css"]
    end

    Deporder --> Concat --> Terser --> Bundle
```

### Prod режим: запросы

```mermaid
flowchart LR
    subgraph "Файловая система"
        Bundle["bundle.js"]
        BundleCSS["bundle.css"]
    end

    subgraph "pageHeader.tag"
        ScriptTag["script src=bundle.js?ver=..."]
        LinkTag["link href=bundle.css?ver=..."]
    end

    subgraph "Браузер"
        Page[JSP страница]
    end

    Page --> ScriptTag --> Bundle
    Page --> LinkTag --> BundleCSS
```

**Проблемы (решаемые):**

- Кастомный скрипт сборки для продакшена
- Нет HMR, полная перезагрузка страницы при изменениях
- Параметр версии для сброса кеша (легко устаревает)

**Проблемы (отложены на будущее):**

- Ручной контроль порядка скриптов
- Загрязнение глобальной области видимости (все классы на window)

## Итоговая архитектура

### Dev режим

```mermaid
flowchart LR
    subgraph "Браузер"
        Page[JSP страница]
    end

    subgraph "viteAsset.tag"
        Script["script type=module<br/>src=localhost:13253/..."]
    end

    subgraph "Vite Dev Server :13253"
        HMR["@vite/client HMR"]
        Transform["On-the-fly transform"]
        ExposePlugin[expose-globals]
    end

    subgraph "Entry Points"
        Entries["entries/**/*.js"]
    end

    Page --> Script
    Script --> HMR
    Script --> Transform
    Transform --> ExposePlugin
    ExposePlugin --> Entries
```

### Prod режим: сборка

```mermaid
flowchart LR
    subgraph "Entry Points"
        Entries["entries/**/*.js"]
    end

    subgraph "Сборка (Vite)"
        Rollup[Rollup bundler]
        Esbuild[esbuild minify]
        Hash[Content hash]
    end

    subgraph "Результат"
        Bundles["target/bundles/<br/>[name]-[hash].js"]
        Manifest[manifest.json]
    end

    Entries --> Rollup --> Esbuild --> Hash --> Bundles
    Hash --> Manifest
```

### Prod режим: запросы

```mermaid
flowchart LR
    subgraph "Файловая система"
        Bundles["[name]-[hash].js"]
        Manifest[manifest.json]
    end

    subgraph "Java"
        Reader[ViteManifestReader]
    end

    subgraph "viteAsset.tag"
        Tag["script src=/bundles/[name]-[hash].js"]
    end

    subgraph "Браузер"
        Page[JSP страница]
    end

    Manifest --> Reader
    Reader --> Tag
    Page --> Tag --> Bundles
```

## Ключевые компоненты

### Структура Entry Points

```mermaid
flowchart LR
    subgraph "Компоненты"
        core.js --> common.js
        common.js --> fields.js
        common.js --> forms.js
        common.js --> dates.js
        core.js --> calendar.js
        core.js --> map.js
    end

    subgraph "Грид"
        grid.js
        excell.js
    end

    subgraph "Страницы"
        Default.js
        FormTipOfTheDay.js
        admin/rules/FilterTab.js
        admin/rules/PLSQL.js
    end

    subgraph "Теги"
        filterTop.js
        viewOptions.js
        includeConfigFields.js
    end
```

### Добавленные файлы

| Файл                                | Назначение                                            |
| ----------------------------------- | ----------------------------------------------------- |
| `web/vite.config.js`                | Конфигурация Vite с entry points и плагинами          |
| `web/vite-plugin-expose-globals.js` | AST-плагин для экспорта классов в window              |
| `web/tsconfig.json`                 | TypeScript конфиг для поддержки IDE                   |
| `ViteDevModeHolder.java`            | Spring bean для определения dev режима                |
| `ViteManifestReader.java`           | Парсит manifest.json для путей к ассетам в продакшене |
| `viteAsset.tag`                     | JSP тег для подключения Vite ассетов                  |
| `entries/**/*.js`                   | Entry points бандлов с импортами                      |

### Процесс в Dev режиме

```mermaid
sequenceDiagram
    participant Browser as Браузер
    participant Jetty as Jetty (8080)
    participant Vite as Vite Dev Server (13253)

    Browser->>Jetty: GET /page.jsp
    Jetty->>Browser: HTML с viteAsset тегами
    Note over Browser: viteAsset проверяет vite.devMode=true
    Browser->>Vite: GET /@vite/client
    Browser->>Vite: GET /entries/components/core.js
    Vite->>Browser: JS модуль + HMR
    Note over Browser: Обнаружено изменение файла
    Vite->>Browser: HMR обновление (без перезагрузки)
```

### Процесс сборки для продакшена

```mermaid
sequenceDiagram
    participant Build as npm run build
    participant Vite as Vite
    participant Manifest as manifest.json
    participant Jetty as Jetty Server
    participant Java as ViteManifestReader

    Build->>Vite: Сборка entries
    Vite->>Manifest: Генерация manifest.json
    Note over Manifest: Маппинг исходных путей на хешированные

    Jetty->>Java: @PostConstruct
    Java->>Manifest: Загрузка манифеста

    Note over Jetty: Приходит запрос
    Jetty->>Java: getAssetPath("entries/components/core.js")
    Java->>Jetty: "components/core-a1b2c3.js"
```

## Роль Gulp в миграции

Gulp используется для генерации entry point файлов, которые затем обрабатываются Vite.

### Старая сборка через Gulp (до миграции)

```mermaid
flowchart LR
    subgraph "Исходники"
        JS1["components/*.js"]
        JS2["new/js/*.js"]
        JS3["new/grid/js/*.js"]
    end

    subgraph "gulp-deporder"
        Deporder["Сортировка по<br/>@requires комментариям"]
    end

    subgraph "Обработка"
        Concat[gulp-concat]
        Terser[gulp-terser]
        Sourcemaps[gulp-sourcemaps]
    end

    subgraph "Результат"
        Bundle["bundle.js + bundle.js.map"]
    end

    JS1 --> Deporder
    JS2 --> Deporder
    JS3 --> Deporder
    Deporder --> Concat --> Terser --> Sourcemaps --> Bundle
```

**Проблемы старого подхода:**

- `gulp-deporder` требовал ручных `@requires` комментариев в каждом файле
- Один монолитный бандл без code splitting
- Невозможность tree-shaking
- Sourcemaps работали ненадежно

### Новая роль Gulp (генерация entry points)

```mermaid
flowchart TB
    subgraph "Gulp Tasks"
        ComponentsTask[componentsTask]
        GridTask[gridTask]
        NewGuiTask[newGuiTask]
        DashboardTask[dashboardTask]
    end

    subgraph "jsImportsTask"
        Glob["glob(sourcePath)"]
        Collect["Сбор путей файлов"]
        Generate["Генерация import statements"]
    end

    subgraph "Результат"
        CoreJS["entries/components/core.js"]
        GridJS["entries/grid/grid.js"]
    end

    ComponentsTask --> Glob
    GridTask --> Glob
    Glob --> Collect --> Generate
    Generate --> CoreJS
    Generate --> GridJS
```

### Пример генерации entry point

**Вход:** glob `components/mixins/**/*.js`

**Выход:** `entries/components/core.js`

```javascript
import './core.css';
import '../../components/Component.js';
import '../../components/mixins/ButtonMixins.js';
import '../../components/mixins/ChatMixin.js';
import '../../components/mixins/DisableMixin.js';
// ... остальные импорты
```

### Структура Gulp задач

```
gulp/
  gulpfile.mjs              # Главный файл: parallel(componentsTask, gridTask, ...)
  tasks/
    componentsTask.mjs      # 15 подзадач: core, common, calendar, map, ...
    gridTask.mjs            # grid.js, excell.js
    newGuiTask.mjs          # newGui.js
    dashboardTask.mjs       # dashboard.js
    common/
      jsImportsTask.mjs     # Генерирует JS с import statements
      cssImportsTask.mjs    # Генерирует CSS с @import statements
      jsTask.mjs            # Старый: concat + terser (не используется)
```

### Сравнение подходов

| Аспект         | Старый Gulp           | Новый Gulp + Vite      |
| -------------- | --------------------- | ---------------------- |
| Задача Gulp    | Сборка бандла         | Генерация entry points |
| Порядок файлов | @requires комментарии | ES imports             |
| Минификация    | gulp-terser           | Vite (esbuild)         |
| Sourcemaps     | gulp-sourcemaps       | Vite (встроенные)      |
| HMR            | Нет                   | Да                     |
| Tree-shaking   | Нет                   | Да                     |

## Плагин expose-globals

Плагин решает проблему обратной совместимости, автоматически экспортируя классы в `window`:

```mermaid
flowchart LR
    subgraph "Вход"
        Source["class Button { }"]
    end

    subgraph "AST трансформация"
        Parse[Парсинг через Acorn]
        Detect[Поиск деклараций]
        Insert[Вставка window assignment]
    end

    subgraph "Выход"
        Result["class Button { }<br/>window.Button = Button;"]
    end

    Source --> Parse --> Detect --> Insert --> Result
```

## Соотношение JSP/Tags и Entries

### Масштаб проекта

Скрипт миграции (`migrate-to-vite-entries.mjs`) анализирует все JSP/tag файлы и определяет какие скрипты требуют Vite bundling:

| Тип файлов        | Всего   | Требуют entry |
| ----------------- | ------- | ------------- |
| JSP страницы      | 614     | 21            |
| Tag файлы         | 91      | 8             |
| **Итого**         | **705** | **29**        |
| Vite entry points | -       | 48            |

Entry points больше чем JSP/tag потому что включают общие компоненты (Gulp) и conditional entries.

### Скрипт миграции

Скрипт автоматически:

1. Сканирует JSP/tag файлы на `<script src="...">` теги
2. Проверяет содержимое каждого скрипта на паттерны требующие Vite:
   - `class X extends Component`
   - `customElements.define`
   - `new C_*` компоненты
3. Учитывает JSTL conditional блоки (`<c:if>`, `<c:when>`)
4. Генерирует entry файлы с импортами
5. Заменяет `<script>` теги на `<ps:viteAsset>`

```mermaid
flowchart TB
    subgraph "migrate-to-vite-entries.mjs"
        Scan["Сканирование JSP/tag"]
        Analyze["Анализ скриптов"]
        Check["Проверка паттернов"]
        Generate["Генерация entries"]
        Update["Обновление JSP/tag"]
    end

    Scan --> Analyze --> Check --> Generate --> Update
```

### Типы entry points

```mermaid
pie title Распределение entry points (48 шт)
    "Компоненты (Gulp)" : 15
    "Страницы (скрипт)" : 21
    "Теги (скрипт)" : 8
    "Грид (Gulp)" : 2
    "Dashboard (Gulp)" : 1
    "NewGui (Gulp)" : 1
```

### Иерархия entries

```mermaid
flowchart TB
    subgraph "Общие entries (Gulp)"
        Core["entries/components/core.js<br/>Базовые классы, миксины"]
        Common["entries/components/common.js<br/>UI компоненты"]
        Grid["entries/grid/grid.js<br/>OvGrid"]
    end

    subgraph "Страничные entries (скрипт)"
        PageDefault["entries/pages/Default.js"]
        PageRules["entries/pages/admin/rules/*.js"]
        PageForm["entries/pages/form/*.js"]
    end

    subgraph "Tag entries (скрипт)"
        TagConfig["entries/pages/tags/includeConfigFields.js"]
        TagFilter["entries/pages/tags/filterTop.js"]
    end

    Core --> Common
    Core --> PageDefault
    Common --> PageRules
    TagConfig --> PageForm
```

### Как JSP/Tag соотносится с Entry

**До миграции** (includeConfigFields.tag):

```jsp
<script src="/components/configForm/cfields/AbstractCField.js?ver=${ver}"></script>
<script src="/components/configForm/cfields/CFieldText.js?ver=${ver}"></script>
<script src="/components/configForm/cfields/CFieldNumber.js?ver=${ver}"></script>
<!-- ... ещё 50+ script тегов -->
```

**После миграции** (includeConfigFields.tag):

```jsp
<ps:viteAsset src="entries/pages/tags/includeConfigFields.js"/>
```

**Entry point** (entries/pages/tags/includeConfigFields.js):

```javascript
import '../../../components/configForm/cfields/AbstractCField.js';
import '../../../components/configForm/cfields/CFieldText.js';
import '../../../components/configForm/cfields/CFieldNumber.js';
// ... все импорты в одном файле
```

### Типы entry points по назначению

| Категория      | Примеры                               | Генерация       | Назначение                         |
| -------------- | ------------------------------------- | --------------- | ---------------------------------- |
| **Компоненты** | `core.js`, `common.js`, `calendar.js` | Gulp            | Общие библиотеки для всех страниц  |
| **Страницы**   | `admin/rules/FilterTab.js`            | Скрипт миграции | JS специфичный для конкретной JSP  |
| **Теги**       | `tags/includeConfigFields.js`         | Скрипт миграции | JS для переиспользуемых tag-файлов |
| **Грид**       | `grid/grid.js`, `grid/excell.js`      | Gulp            | Компоненты грида                   |

### Покрытие миграцией

Из 705 JSP/tag файлов только 29 содержат скрипты требующие Vite bundling. Остальные либо:

- Используют только общие компоненты из `pageHeader.tag`
- Содержат только библиотечные скрипты (исключены из миграции)
- Не содержат скриптов вообще

## Статистика

| Метрика               | До               | После             |
| --------------------- | ---------------- | ----------------- |
| Изменено файлов       | -                | 191               |
| Добавлено строк       | -                | 6,665             |
| Удалено строк         | -                | 2,917             |
| Размер pageHeader.tag | ~500 строк       | ~65 строк         |
| HTTP запросов (dev)   | 100+             | ~20 entry чанков  |
| Сброс кеша            | параметр `?ver=` | Хеш в имени файла |

## Коммиты

1. `vite setup` - Начальная конфигурация Vite
2. `use gulp to generate entries` - Генерация entry points
3. `vite entries for everything` - Полное покрытие entry points
4. `css fix` - Исправления сборки CSS
5. `remove temporary bundle` - Удаление старого бандла
6. `vite assets` - Обработка ассетов
7. `cleanup` (x2) - Очистка кода
8. `page entries` - Entry points для страниц
9. `replacement WIP` - Обновление tag-файлов (в процессе)

## Интеграция с Maven/Jetty

Vite полностью интегрирован в Maven lifecycle - не нужно запускать отдельные процессы.

### Maven профили

```mermaid
flowchart TB
    subgraph "mvn jetty:run (default)"
        Build1[generate-resources]
        Build1 --> NpmBuild["npm run build<br/>(Vite prod сборка)"]
        NpmBuild --> Bundles["target/bundles/"]
        Bundles --> Jetty1[Jetty запуск]
    end

    subgraph "mvn jetty:run -DdevMode=true"
        Build2[generate-resources]
        Build2 --> ViteDev["npx vite<br/>(async, dev server)"]
        Build2 --> Skip["npm run build<br/>(skip=true)"]
        ViteDev --> Jetty2[Jetty запуск]
        Jetty2 -.-> ViteDev
    end
```

### Конфигурация в pom.xml

- **Dev профиль** (`-DdevMode=true`): запускает `npx vite` асинхронно в фазе `generate-resources`, устанавливает `vite.devMode=true`
- **Prod сборка** (по умолчанию): выполняет `npm run build` в фазе `generate-resources`, пропускается если `vite.devMode=true`

### Использование

**Разработка (с HMR):**

```bash
mvn jetty:run -DdevMode=true

# Vite dev server запускается автоматически на порту jetty+5173
# Например: Jetty 8080 -> Vite 13253
```

**Продакшен (со сборкой):**

```bash
mvn jetty:run

# Vite автоматически собирает бандлы в target/bundles/
# Jetty раздает их по пути /bundles/
```

### Передача параметров в Vite

```mermaid
sequenceDiagram
    participant Maven
    participant Vite as Vite Dev Server
    participant Jetty
    participant Java as ViteDevModeHolder

    Maven->>Vite: JETTY_PORT env variable
    Maven->>Jetty: -Dvite.devMode=true
    Maven->>Jetty: -Djetty.port=8080
    Jetty->>Java: System.getProperty("vite.devMode")
    Jetty->>Java: System.getProperty("jetty.port")
    Java->>Java: vitePort = jettyPort + 5173
```
