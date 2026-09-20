import { Markup } from 'telegraf';
import { Language, BotContext } from '../types/context';

export const DEFAULT_LANGUAGE: Language = 'en';

export const SUPPORTED_LANGUAGES: { code: Language; label: string; flag: string }[] = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'uk', label: 'Українська', flag: '🇺🇦' },
  { code: 'ru', label: 'Русский', flag: '🇷🇺' },
];

export interface SurveyOption {
  id: string;
  label: string;
}

export const CATEGORIES_DATA: Record<Language, SurveyOption[]> = {
  en: [
    { id: 'cat_web', label: '🌐 Web Applications' },
    { id: 'cat_bot', label: '🤖 Telegram Bots / Mini Apps' },
    { id: 'cat_auto', label: '⚡ Business Automation' },
    { id: 'cat_custom', label: '💡 Custom / Consulting' },
  ],
  uk: [
    { id: 'cat_web', label: '🌐 Веб-додатки' },
    { id: 'cat_bot', label: '🤖 Telegram-боти / Mini Apps' },
    { id: 'cat_auto', label: '⚡ Автоматизація бізнесу' },
    { id: 'cat_custom', label: '💡 Свій варіант / Консультація' },
  ],
  ru: [
    { id: 'cat_web', label: '🌐 Веб-приложения' },
    { id: 'cat_bot', label: '🤖 Telegram-боты / Mini Apps' },
    { id: 'cat_auto', label: '⚡ Автоматизация бизнеса' },
    { id: 'cat_custom', label: '💡 Свой вариант / Консультация' },
  ],
};

export const BUDGETS_DATA: Record<Language, SurveyOption[]> = {
  en: [
    { id: 'bgt_500', label: 'Under $500' },
    { id: 'bgt_500_1000', label: '$500 - $1,000' },
    { id: 'bgt_1000_plus', label: 'Over $1,000' },
    { id: 'bgt_estimate', label: 'Need estimation' },
  ],
  uk: [
    { id: 'bgt_500', label: 'До $500' },
    { id: 'bgt_500_1000', label: '$500 - $1000' },
    { id: 'bgt_1000_plus', label: 'Більше $1000' },
    { id: 'bgt_estimate', label: 'Потрібна оцінка' },
  ],
  ru: [
    { id: 'bgt_500', label: 'До $500' },
    { id: 'bgt_500_1000', label: '$500 - $1000' },
    { id: 'bgt_1000_plus', label: 'Больше $1000' },
    { id: 'bgt_estimate', label: 'Нужна оценка' },
  ],
};

export const MAIN_MENU_BUTTONS: Record<
  Language,
  { newOrder: string; services: string; changeLang: string; cancel: string }
> = {
  en: {
    newOrder: '📝 Submit Request',
    services: 'ℹ️ Our Services',
    changeLang: '🌐 Language',
    cancel: '❌ Cancel',
  },
  uk: {
    newOrder: '📝 Залишити заявку',
    services: 'ℹ️ Наші послуги',
    changeLang: '🌐 Мова',
    cancel: '❌ Скасувати',
  },
  ru: {
    newOrder: '📝 Оставить заявку',
    services: 'ℹ️ Наши услуги',
    changeLang: '🌐 Язык',
    cancel: '❌ Отменить',
  },
};

export const MESSAGES: Record<
  Language,
  {
    welcome: string;
    categorySelected: string;
    descriptionPrompt: string;
    descriptionTooShort: string;
    budgetPrompt: string;
    budgetSelected: string;
    contactPrompt: string;
    contactButton: string;
    phonePrefix: string;
    success: string;
    cancelled: string;
    servicesInfo: string;
    help: string;
    languageChanged: string;
    errors: {
      categoryInvalid: string;
      descriptionInvalid: string;
      budgetInvalid: string;
      contactInvalid: string;
    };
  }
> = {
  en: {
    welcome: 'Hello! 👋 I will help you submit a development request.\n\nPlease choose the area of interest:',
    categorySelected: 'Selected:',
    descriptionPrompt: 'Great! Describe your task or idea in free form. What exactly needs to be built?',
    descriptionTooShort: 'Please describe the task in a bit more detail (at least a few words) ✍️',
    budgetPrompt: 'What approximate budget are you planning for implementation?',
    budgetSelected: 'Budget:',
    contactPrompt: 'Please provide convenient contact information:\n\nClick the «📱 Share Contact» button below or type your phone / @username in a message.',
    contactButton: '📱 Share Contact',
    phonePrefix: 'Phone',
    success: 'Received! We will get in touch with you shortly 🚀\n\nYou can always submit another request or learn more about our services using the menu below 👇',
    cancelled: '❌ Request cancelled. You can start over using the buttons below 👇',
    servicesInfo:
      '🛠 <b>Our IT Services:</b>\n\n' +
      '• <b>Web Applications:</b> custom websites, CRM/ERP systems, portals, and client dashboards.\n' +
      '• <b>Telegram Bots & Mini Apps:</b> automation bots, ordering systems, and WebApp mini-apps in Telegram.\n' +
      '• <b>Business Automation:</b> API integrations, database synchronization, notifications, and AI assistants.\n' +
      '• <b>Custom Development:</b> architecture evaluation, code audit, and technical consulting.\n\n' +
      'Ready to discuss your project? Click <b>«📝 Submit Request»</b> below 👇',
    help:
      '🤖 <b>IT Services Lead Bot</b>\n\n' +
      '• /start — Choose language & start request\n' +
      '• /language — Change language\n' +
      '• /cancel — Cancel current action\n\n' +
      'Or use the menu buttons at the bottom 👇',
    languageChanged: '🇬🇧 Language set to English.',
    errors: {
      categoryInvalid: 'Please choose one of the options using the buttons below 👇',
      descriptionInvalid: 'Please describe your task using text (stickers and media are not supported at this step) ✍️',
      budgetInvalid: 'Please specify your budget by choosing one of the buttons below 👇',
      contactInvalid: 'Please click «📱 Share Contact» or send your contact info as text 📲',
    },
  },
  uk: {
    welcome: 'Привіт! 👋 Я допоможу вам оформити заявку на розробку.\n\nОберіть напрямок, що вас цікавить:',
    categorySelected: 'Обрано:',
    descriptionPrompt: 'Чудово! Опишіть ваше завдання або ідею у вільній формі. Що саме потрібно зробити?',
    descriptionTooShort: 'Будь ласка, опишіть завдання трохи детальніше (щонайменше кілька слів) ✍️',
    budgetPrompt: 'Який приблизний бюджет ви плануєте на реалізацію?',
    budgetSelected: 'Бюджет:',
    contactPrompt: "Вкажіть зручний спосіб зв'язку:\n\nНатисніть кнопку «📱 Поділитися контактом» нижче або надішліть номер телефону / @username повідомленням.",
    contactButton: '📱 Поділитися контактом',
    phonePrefix: 'Телефон',
    success: "Прийнято! Незабаром ми зв'яжемося з вами 🚀\n\nВи завжди можете надіслати ще одну заявку або дізнатися більше про наші послуги через меню нижче 👇",
    cancelled: '❌ Заявку скасовано. Ви можете почати знову за допомогою кнопки нижче 👇',
    servicesInfo:
      '🛠 <b>Наші IT-послуги:</b>\n\n' +
      '• <b>Веб-додатки:</b> розробка сайтів, CRM/ERP систем, порталів та особистих кабінетів.\n' +
      '• <b>Telegram-боти & Mini Apps:</b> боти для автоматизації, прийому замовлень та міні-додатки всередині Telegram.\n' +
      '• <b>Автоматизація бізнесу:</b> інтеграції по API, синхронізація баз даних, сповіщення, AI-асистенти.\n' +
      '• <b>Індивідуальна розробка:</b> оцінка архітектури, аудит та консультації.\n\n' +
      'Готові обговорити ваш проєкт? Натисніть <b>«📝 Залишити заявку»</b> нижче 👇',
    help:
      '🤖 <b>IT Services Lead Bot</b>\n\n' +
      '• /start — Вибрати мову та почати оформлення заявки\n' +
      '• /language — Змінити мову\n' +
      '• /cancel — Скасувати введення на будь-якому кроці\n\n' +
      'Або скористайтеся кнопками меню внизу екрана 👇',
    languageChanged: '🇺🇦 Мову змінено на українську.',
    errors: {
      categoryInvalid: 'Будь ласка, оберіть один із варіантів за допомогою кнопок нижче 👇',
      descriptionInvalid: 'Будь ласка, опишіть ваше завдання звичайним текстом (стікери та медіафайли не підтримуються на цьому кроці) ✍️',
      budgetInvalid: 'Будь ласка, вкажіть бюджет, обравши одну з кнопок нижче 👇',
      contactInvalid: 'Будь ласка, скористайтеся кнопкою «📱 Поділитися контактом» або надішліть контакт текстом 📲',
    },
  },
  ru: {
    welcome: 'Привет! 👋 Я помогу вам оформить заявку на разработку.\n\nВыберите интересующее направление:',
    categorySelected: 'Выбрано:',
    descriptionPrompt: 'Круто! Опишите свою задачу или идею в свободной форме. Что именно нужно сделать?',
    descriptionTooShort: 'Пожалуйста, опишите задачу чуть подробнее (минимум несколько слов) ✍️',
    budgetPrompt: 'Какой примерный бюджет закладываете на реализацию?',
    budgetSelected: 'Бюджет:',
    contactPrompt: 'Укажите удобный способ связи:\n\nНажмите кнопку «📱 Поделиться контактом» ниже или напишите телефон / @username сообщением.',
    contactButton: '📱 Поделиться контактом',
    phonePrefix: 'Телефон',
    success: 'Принято! Скоро свяжемся 🚀\n\nВы всегда можете отправить ещё одну заявку или узнать подробнее о наших услугах с помощью меню ниже 👇',
    cancelled: '❌ Заявка отменена. Вы можете начать заново с помощью кнопки ниже 👇',
    servicesInfo:
      '🛠 <b>Наши IT-услуги:</b>\n\n' +
      '• <b>Веб-приложения:</b> разработка сайтов, CRM/ERP систем, порталов и личных кабинетов.\n' +
      '• <b>Telegram-боты & Mini Apps:</b> боты для автоматизации, приёма заказов и мини-приложения внутри Telegram.\n' +
      '• <b>Автоматизация бизнеса:</b> интеграции по API, синхронизация баз данных, уведомления, AI-ассистенты.\n' +
      '• <b>Индивидуальная разработка:</b> оценка архитектуры, аудит и консультации.\n\n' +
      'Готовы обсудить ваш проект? Нажмите <b>«📝 Оставить заявку»</b> ниже 👇',
    help:
      '🤖 <b>IT Services Lead Bot</b>\n\n' +
      '• /start — Выбрать язык и начать оформление заявки\n' +
      '• /language — Сменить язык\n' +
      '• /cancel — Отменить ввод на любом шаге\n\n' +
      'Или воспользуйтесь кнопками меню внизу экрана 👇',
    languageChanged: '🇷🇺 Язык изменён на русский.',
    errors: {
      categoryInvalid: 'Пожалуйста, выберите один из вариантов с помощью кнопок ниже 👇',
      descriptionInvalid: 'Пожалуйста, опишите вашу задачу обычным текстом (стикеры и медиафайлы не поддерживаются на этом шаге) ✍️',
      budgetInvalid: 'Пожалуйста, укажите бюджет, выбрав одну из кнопок ниже 👇',
      contactInvalid: 'Пожалуйста, воспользуйтесь кнопкой «📱 Поделиться контактом» или отправьте контакт текстом 📲',
    },
  },
};

export function getLanguage(ctx: BotContext): Language {
  return ctx.session?.language || DEFAULT_LANGUAGE;
}

export function getLanguageName(lang: Language): string {
  const item = SUPPORTED_LANGUAGES.find((l) => l.code === lang);
  return item ? `${item.flag} ${item.label}` : lang;
}

export function getLanguageInlineKeyboard(prefix = 'lang') {
  return Markup.inlineKeyboard([
    SUPPORTED_LANGUAGES.map((item) =>
      Markup.button.callback(`${item.flag} ${item.label}`, `${prefix}_${item.code}`)
    ),
  ]);
}

export function getCategoryReplyKeyboard(lang: Language) {
  const categories = CATEGORIES_DATA[lang] || CATEGORIES_DATA[DEFAULT_LANGUAGE];
  const buttons = MAIN_MENU_BUTTONS[lang] || MAIN_MENU_BUTTONS[DEFAULT_LANGUAGE];

  return Markup.keyboard([
    [categories[0].label, categories[1].label],
    [categories[2].label, categories[3].label],
    [buttons.cancel],
  ])
    .resize()
    .persistent();
}

export function getBudgetReplyKeyboard(lang: Language) {
  const budgets = BUDGETS_DATA[lang] || BUDGETS_DATA[DEFAULT_LANGUAGE];
  const buttons = MAIN_MENU_BUTTONS[lang] || MAIN_MENU_BUTTONS[DEFAULT_LANGUAGE];

  return Markup.keyboard([
    [budgets[0].label, budgets[1].label],
    [budgets[2].label, budgets[3].label],
    [buttons.cancel],
  ])
    .resize()
    .persistent();
}

export function getContactReplyKeyboard(lang: Language) {
  const messages = MESSAGES[lang] || MESSAGES[DEFAULT_LANGUAGE];
  const buttons = MAIN_MENU_BUTTONS[lang] || MAIN_MENU_BUTTONS[DEFAULT_LANGUAGE];

  return Markup.keyboard([
    [Markup.button.contactRequest(messages.contactButton)],
    [buttons.cancel],
  ])
    .resize()
    .persistent();
}

export function getCancelReplyKeyboard(lang: Language) {
  const buttons = MAIN_MENU_BUTTONS[lang] || MAIN_MENU_BUTTONS[DEFAULT_LANGUAGE];
  return Markup.keyboard([[buttons.cancel]])
    .resize()
    .persistent();
}

export function getMainMenuKeyboard(lang: Language) {
  const buttons = MAIN_MENU_BUTTONS[lang] || MAIN_MENU_BUTTONS[DEFAULT_LANGUAGE];
  return Markup.keyboard([
    [buttons.newOrder],
    [buttons.services, buttons.changeLang],
  ])
    .resize()
    .persistent();
}

/**
 * Returns all variations of a button label across all languages for matching bot.hears
 */
export function getAllButtonVariants(
  key: keyof typeof MAIN_MENU_BUTTONS['en']
): string[] {
  return (['en', 'uk', 'ru'] as Language[]).map((l) => MAIN_MENU_BUTTONS[l][key]);
}

/**
 * Finds category by localized label or ID across all languages
 */
export function findCategory(textOrId: string, currentLang: Language) {
  // First check in current language
  const inCurrent = CATEGORIES_DATA[currentLang].find(
    (c) => c.id === textOrId || c.label.toLowerCase() === textOrId.toLowerCase()
  );
  if (inCurrent) return inCurrent;

  // Search across other languages
  for (const lang of ['en', 'uk', 'ru'] as Language[]) {
    const found = CATEGORIES_DATA[lang].find(
      (c) => c.id === textOrId || c.label.toLowerCase() === textOrId.toLowerCase()
    );
    if (found) {
      // return version mapped to current language
      return CATEGORIES_DATA[currentLang].find((c) => c.id === found.id) || found;
    }
  }
  return undefined;
}

/**
 * Finds budget by localized label or ID across all languages
 */
export function findBudget(textOrId: string, currentLang: Language) {
  // First check in current language
  const inCurrent = BUDGETS_DATA[currentLang].find(
    (b) => b.id === textOrId || b.label.toLowerCase() === textOrId.toLowerCase()
  );
  if (inCurrent) return inCurrent;

  // Search across other languages
  for (const lang of ['en', 'uk', 'ru'] as Language[]) {
    const found = BUDGETS_DATA[lang].find(
      (b) => b.id === textOrId || b.label.toLowerCase() === textOrId.toLowerCase()
    );
    if (found) {
      return BUDGETS_DATA[currentLang].find((b) => b.id === found.id) || found;
    }
  }
  return undefined;
}
