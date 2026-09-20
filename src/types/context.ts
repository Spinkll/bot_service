import { Scenes } from 'telegraf';

export type Language = 'en' | 'uk' | 'ru';

export interface OrderData {
  category?: string;
  categoryId?: string;
  description?: string;
  budget?: string;
  budgetId?: string;
  contact?: string;
}

export interface OrderWizardSession extends Scenes.WizardSessionData {
  orderData?: OrderData;
}

export interface BotSessionData extends Scenes.WizardSession<OrderWizardSession> {
  language?: Language;
}

export interface BotContext extends Scenes.WizardContext<OrderWizardSession> {
  session: BotSessionData;
}
