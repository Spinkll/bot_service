# Telegram Lead Generation Bot (Telegraf & TypeScript)

Масштабируемый мультиязычный Telegram-бот для сбора заявок на IT-услуги с поддержкой **Long Polling**, **Webhooks** и бессерверного деплоя на **Vercel** / **Render**. Построен на базе **TypeScript**, **Telegraf (Scenes/Wizard)** и **Node.js**.

## 🌟 Возможности

- **Поддержка любых платформ:**
  - ⚡ **Vercel (Serverless):** готовый эндпоинт `api/index.ts` и `vercel.json`. Мгновенная регистрация вебхука через браузер (`/set-webhook`).
  - ☁️ **Render (Web Service / Background Worker):** встроенный HTTP health-check на `/` и `/health`.
  - 💻 **Long Polling (Локальная разработка):** запуск через `npm run dev` без необходимости в ngrok или туннелях.
- **Мультиязычность (i18n):**
  - 3 языка: 🇬🇧 **English (по умолчанию)**, 🇺🇦 **Українська**, 🇷🇺 **Русский**.
  - **Выбор языка перед началом:** при вызове `/start` бот предлагает выбрать язык через интерактивные кнопки.
  - **Смена языка в любой момент:** команда `/language`, `/lang` или кнопка меню `🌐 Language`.
- **Пошаговая анкета (Wizard Scene):**
  1. **Категория:** выбор направления («Web Applications», «Telegram Bots / Mini Apps», «Business Automation», «Custom / Consulting»).
  2. **Описание задачи:** приём подробного текстового описания задачи (с валидацией).
  3. **Бюджет:** выбор вилки стоимости («Under $500», «$500 - $1,000», «Over $1,000», «Need estimation»).
  4. **Контактные данные:** нативная кнопка «Поделиться контактом» либо ввод телефона/@username сообщением.
  5. **Финал:** подтверждение клиенту на выбранном языке и мгновенная отправка заявки в админский чат/канал с указанием языка клиента.
- **Глобальная отмена (`/cancel`):** работает на любом шаге опроса и вне его на всех трёх языках.
- **Интерактивное главное меню:** быстрое создание заявки, просмотр описания услуг и переключение языка.

---

## 📁 Структура проекта

```
bot_service/
├── api/
│   └── index.ts              # Vercel Serverless Function (обработка вебхуков)
├── src/
│   ├── config/
│   │   ├── env.ts            # Переменные окружения и настройки webhook
│   │   ├── i18n.ts           # Словари локализации (en, uk, ru), клавиатуры
│   │   └── survey.ts         # Экспорт конфигурации опроса и шаблон админ-уведомления
│   ├── scenes/
│   │   └── orderWizard.ts    # Мультиязычная сцена сбора заявки (WizardScene)
│   ├── types/
│   │   └── context.ts        # Типы Telegraf Context, WizardSession, Language, OrderData
│   ├── bot.ts                # Инициализация Telegraf, Stage, middleware языка, /start, /language, /cancel
│   └── index.ts              # Точка входа для Node.js (Render / VPS / локальный запуск)
├── .env.example              # Пример переменных окружения
├── vercel.json               # Маршрутизация для Vercel Serverless
├── package.json
└── tsconfig.json
```

---

## 🚀 Деплой на Vercel

1. Загрузите код в ваш **GitHub**-репозиторий.
2. Перейдите на [vercel.com](https://vercel.com/) и нажмите **Add New...** -> **Project**.
3. Выберите ваш репозиторий.
4. В блоке **Environment Variables** добавьте:
   - `BOT_TOKEN` = `<ваш_токен_бота>`
   - `ADMIN_CHAT_ID` = `<id_вашего_чата_или_канала>`
5. Нажмите **Deploy**.
6. После завершения деплоя откройте в браузере URL вашего проекта со страницей установки вебхука:
   ```
   https://ваш-проект.vercel.app/set-webhook
   ```
   Бот автоматически зарегистрирует свой вебхук в Telegram!

---

## 💻 Локальный запуск (Polling)

```bash
cp .env.example .env
# Укажите BOT_TOKEN и ADMIN_CHAT_ID в .env
npm install
npm run dev
```
