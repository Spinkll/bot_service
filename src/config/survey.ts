import {
  DEFAULT_LANGUAGE,
  CATEGORIES_DATA,
  BUDGETS_DATA,
  MAIN_MENU_BUTTONS,
  MESSAGES,
  getLanguageName,
} from './i18n';
import { Language } from '../types/context';

export * from './i18n';

// Default exports pointing to default language (English) for backwards compatibility
export const DEFAULT_CATEGORIES = CATEGORIES_DATA[DEFAULT_LANGUAGE];
export const DEFAULT_BUDGETS = BUDGETS_DATA[DEFAULT_LANGUAGE];
export const DEFAULT_MAIN_MENU_BUTTONS = MAIN_MENU_BUTTONS[DEFAULT_LANGUAGE];
export const DEFAULT_MESSAGES = MESSAGES[DEFAULT_LANGUAGE];

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
  language?: Language;
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

  const langDisplay = payload.language ? getLanguageName(payload.language) : 'English (en)';

  return [
    '🚀 <b>Новая заявка на IT-услуги! / New IT Lead!</b>',
    '',
    `🌐 <b>Язык клиента / Client Language:</b> ${langDisplay}`,
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
