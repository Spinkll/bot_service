import { Markup } from 'telegraf';

export interface SurveyOption {
  id: string;
  label: string;
}

export const CATEGORIES: SurveyOption[] = [
  { id: 'cat_web', label: 'Веб-приложения' },
  { id: 'cat_bot', label: 'Telegram-боты/Мини-аппы' },
  { id: 'cat_auto', label: 'Автоматизация бизнеса' },
  { id: 'cat_custom', label: 'Свой вариант / Консультация' },
];

export const BUDGETS: SurveyOption[] = [
  { id: 'bgt_500', label: 'До $500' },
  { id: 'bgt_500_1000', label: '$500 - $1000' },
  { id: 'bgt_1000_plus', label: 'Больше $1000' },
  { id: 'bgt_estimate', label: 'Нужна оценка' },
];

export const MAIN_MENU_BUTTONS = {
  newOrder: '📝 Оставить новую заявку',
  services: 'ℹ️ О наших услугах',
  cancel: '❌ Отменить заявку',
};

export function getCategoryReplyKeyboard() {
  return Markup.keyboard([
    [CATEGORIES[0].label, CATEGORIES[1].label],
    [CATEGORIES[2].label, CATEGORIES[3].label],
    [MAIN_MENU_BUTTONS.cancel],
  ])
    .resize()
    .persistent();
}

export function getBudgetReplyKeyboard() {
  return Markup.keyboard([
    [BUDGETS[0].label, BUDGETS[1].label],
    [BUDGETS[2].label, BUDGETS[3].label],
    [MAIN_MENU_BUTTONS.cancel],
  ])
    .resize()
    .persistent();
}

export function getContactReplyKeyboard() {
  return Markup.keyboard([
    [Markup.button.contactRequest(MESSAGES.contactButton)],
    [MAIN_MENU_BUTTONS.cancel],
  ])
    .resize()
    .persistent();
}

export function getCancelReplyKeyboard() {
  return Markup.keyboard([[MAIN_MENU_BUTTONS.cancel]])
    .resize()
    .persistent();
}

export function getMainMenuKeyboard() {
  return Markup.keyboard([
    [MAIN_MENU_BUTTONS.newOrder],
    [MAIN_MENU_BUTTONS.services],
  ])
    .resize()
    .persistent();
}

export const MESSAGES = {
  welcome:
    'Привет! 👋 Я помогу вам оформить заявку на разработку.\n\nВыберите интересующее направление:',
  descriptionPrompt:
    'Круто! Опиши свою задачу или идею в свободной форме. Что именно нужно сделать?',
  budgetPrompt: 'Какой примерный бюджет закладываешь на реализацию?',
  contactPrompt:
    'Укажи удобный способ связи:\n\nНажми кнопку «Поделиться контактом» ниже или напиши телефон / @username сообщением.',
  contactButton: '📱 Поделиться контактом',
  success: 'Принято! Скоро свяжемся 🚀\n\nВы всегда можете отправить ещё одну заявку или узнать подробнее о наших услугах с помощью меню ниже 👇',
  cancelled: '❌ Заявка отменена. Вы можете начать заново с помощью кнопки ниже 👇',
  restartPrompt: 'Чтобы отправить новую заявку, воспользуйтесь кнопкой ниже или напишите /start',
  servicesInfo:
    '🛠 <b>Наши IT-услуги:</b>\n\n' +
    '• <b>Веб-приложения:</b> разработка сайтов, CRM/ERP систем, порталов и личных кабинетов.\n' +
    '• <b>Telegram-боты & Mini Apps:</b> боты для автоматизации, приёма заказов и мини-приложения внутри Telegram.\n' +
    '• <b>Автоматизация бизнеса:</b> интеграции по API, синхронизация баз данных, уведомления, AI-ассистенты.\n' +
    '• <b>Индивидуальная разработка:</b> оценка архитектуры, аудит и консультации.\n\n' +
    'Готовы обсудить ваш проект? Нажмите <b>«📝 Оставить новую заявку»</b> ниже 👇',
  errors: {
    categoryInvalid:
      'Пожалуйста, выберите один из вариантов с помощью кнопок ниже 👇',
    descriptionInvalid:
      'Пожалуйста, опишите вашу задачу обычным текстом (стикеры и медиафайлы не поддерживаются на этом шаге) ✍️',
    budgetInvalid:
      'Пожалуйста, укажите бюджет, выбрав одну из кнопок ниже 👇',
    contactInvalid:
      'Пожалуйста, воспользуйтесь кнопкой «Поделиться контактом» или отправьте контакт текстом 📲',
  },
};

/**
 * Escapes special HTML characters in dynamic user input to prevent parsing errors in Telegram HTML mode.
 */
export function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

export interface AdminNotificationPayload {
  category: string;
  description: string;
  budget: string;
  contact: string;
  userId: number;
  username?: string;
  firstName: string;
  lastName?: string;
}

export function formatAdminMessage(payload: AdminNotificationPayload): string {
  const userDisplay = [
    escapeHtml(payload.firstName),
    payload.lastName ? escapeHtml(payload.lastName) : '',
  ]
    .filter(Boolean)
    .join(' ');

  const usernameTag = payload.username
    ? `@${escapeHtml(payload.username)}`
    : '<i>отсутствует</i>';

  const userLink = `<a href="tg://user?id=${payload.userId}">${userDisplay}</a> (ID: <code>${payload.userId}</code>)`;

  return [
    '🚀 <b>Новая заявка на IT-услуги!</b>',
    '',
    `📁 <b>Направление:</b> ${escapeHtml(payload.category)}`,
    `💰 <b>Бюджет:</b> ${escapeHtml(payload.budget)}`,
    `📞 <b>Связь:</b> ${escapeHtml(payload.contact)}`,
    `👤 <b>Клиент:</b> ${userLink}`,
    `💬 <b>Username:</b> ${usernameTag}`,
    '',
    '📝 <b>Описание задачи:</b>',
    `<blockquote>${escapeHtml(payload.description)}</blockquote>`,
  ].join('\n');
}
