import dotenv from 'dotenv';

dotenv.config();

export interface EnvConfig {
  botToken: string;
  adminChatId: string | number;
  port: number;
  webhookDomain: string;
  webhookPath: string;
  webhookSecret: string;
}

function getEnvVar(key: string, required = true): string {
  const value = process.env[key];
  if (!value && required) {
    throw new Error(
      `[Config Error]: Переменная окружения ${key} не задана. Убедитесь, что файл .env создан и заполнен по образцу .env.example.`
    );
  }
  return value || '';
}

export const config: EnvConfig = {
  botToken: getEnvVar('BOT_TOKEN'),
  adminChatId: getEnvVar('ADMIN_CHAT_ID'),
  port: parseInt(process.env.PORT || '3000', 10),
  webhookDomain: process.env.WEBHOOK_DOMAIN || process.env.RENDER_EXTERNAL_URL || '',
  webhookPath: process.env.WEBHOOK_PATH || '/webhook',
  webhookSecret: process.env.WEBHOOK_SECRET || '',
};
