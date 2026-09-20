# Telegram Lead Generation Bot (Telegraf & TypeScript)

Масштабируемый мультиязычный Telegram-бот для сбора заявок на IT-услуги, оптимизированный для деплоя на **Render** (Web Service на вебхуках) и локальной разработки на **Long Polling**.

## 🌟 Возможности

- **Полная адаптация под Render:**
  - **Автоматический Webhook:** при запуске на Render (через системную переменную `RENDER_EXTERNAL_URL`) бот сам регистрирует вебхук в Telegram.
  - **Встроенный HTTP Health-Check:** встроенный сервер на порту Render (`/` и `/health`) успешно проходит проверку доступности портов Render и защищает от ошибок деплоя.
  - **Локальная разработка:** без указания вебхука бот работает через Long Polling без необходимости в ngrok или туннелях.
- **Мультиязычность (i18n):**
  - Поддержка 3 языков: 🇬🇧 **English (по умолчанию)**, 🇺🇦 **Українська**, 🇷🇺 **Русский**.
  - **Выбор языка перед началом:** при `/start` бот предлагает выбрать язык через удобные Inline-кнопки.
  - **Смена языка в любой момент:** команда `/language`, `/lang` или кнопка меню `🌐 Language`.
- **Пошаговая анкета (Wizard Scene):**
  1. **Категория:** выбор направления с помощью кнопок («Web Applications», «Telegram Bots / Mini Apps», «Business Automation», «Custom / Consulting»).
  2. **Описание задачи:** приём подробного текстового описания задачи (с валидацией от стикеров и медиа).
  3. **Бюджет:** выбор вилки стоимости («Under $500», «$500 - $1,000», «Over $1,000», «Need estimation»).
  4. **Контактные данные:** нативная кнопка «Поделиться контактом» либо ввод телефона/@username сообщением.
  5. **Финал:** подтверждение клиенту на выбранном языке и мгновенная отправка заявки в админский чат/канал с указанием языка клиента.
- **Глобальная отмена (`/cancel`):** работает на любом шаге опроса и вне его на всех трёх языках.
- **Интерактивное главное меню:** быстрое создание заявки, просмотр описания услуг и переключение языка.

---

## 📁 Структура проекта

```
bot_service/
├── src/
│   ├── config/
│   │   ├── env.ts            # Валидация переменных окружения и настроек webhook
│   │   ├── i18n.ts           # Словари локализации (en, uk, ru), клавиатуры
│   │   └── survey.ts         # Экспорт конфигурации опроса и шаблон админ-уведомления
│   ├── scenes/
│   │   └── orderWizard.ts    # Мультиязычная сцена сбора заявки (WizardScene)
│   ├── types/
│   │   └── context.ts        # Типы Telegraf Context, WizardSession, Language, OrderData
│   ├── bot.ts                # Инициализация Telegraf, Stage, middleware языка, /start, /language, /cancel
│   └── index.ts              # Точка входа, автопереключение Webhook/Polling, health-check сервер
├── .env.example              # Пример переменных окружения
├── package.json
└── tsconfig.json
```

---

## 🚀 Пошаговый деплой на Render (Бесплатный Web Service)

1. **Загрузите репозиторий на GitHub:**
   ```bash
   git add .
   git commit -m "feat: setup bot for Render webhook deployment"
   git push
   ```

2. **Создайте Web Service на Render:**
   - Войдите в панель [dashboard.render.com](https://dashboard.render.com/).
   - Нажмите **New +** → **Web Service**.
   - Подключите ваш GitHub-репозиторий.

3. **Заполните параметры сборки:**
   - **Name:** любое имя (например, `it-lead-bot`)
   - **Runtime:** `Node`
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm run start`
   - **Instance Type:** `Free`

4. **Добавьте переменные окружения (Environment Variables):**
   - `BOT_TOKEN` = `<ваш_токен_бота_от_BotFather>`
   - `ADMIN_CHAT_ID` = `<id_вашего_чата_или_канала>`
   - `NODE_ENV` = `production`

5. **Нажмите Create Web Service.**

> 💡 **Как это работает на Render:**
> Render автоматически передаёт переменную `RENDER_EXTERNAL_URL` (например, `https://it-lead-bot.onrender.com`) и порт `PORT`. Бот автоматически:
> 1. Регистрирует вебхук в Telegram на `https://it-lead-bot.onrender.com/webhook`.
> 2. Поднимает HTTP health-check сервер на портах Render (`/` и `/health`).
> 3. Готов принимать заявки 24/7!

---

## 💻 Локальный запуск (Polling)

Для локального тестирования бот автоматически использует Long Polling:

```bash
# 1. Установите зависимости
npm install

# 2. Создайте .env файл
cp .env.example .env
# Заполните BOT_TOKEN и ADMIN_CHAT_ID

# 3. Запустите в режиме разработки
npm run dev
```

> ⚠️ **Важно:** Если при запуске возникает ошибка `409 Conflict: terminated by other getUpdates request`, это означает, что бот уже запущен в другом терминале или окне VS Code. Остановите предыдущий процесс комбинацией `Ctrl + C`.
