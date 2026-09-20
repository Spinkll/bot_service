import { Scenes } from 'telegraf';

export interface OrderData {
  category?: string;
  description?: string;
  budget?: string;
  contact?: string;
}

export interface OrderWizardSession extends Scenes.WizardSessionData {
  orderData?: OrderData;
}

export interface BotContext extends Scenes.WizardContext<OrderWizardSession> {}
