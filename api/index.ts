import { createBot } from '../src/bot';
import { config } from '../src/config/env';

// Initialize bot once per serverless container instance
const bot = createBot();

export default async function handler(req: any, res: any) {
  try {
    // Health check and browser verification
    if (req.method === 'GET') {
      const url = req.url || '';

      // Automatic webhook registration helper via browser: /set-webhook
      if (url.includes('/set-webhook') || url.includes('/setup')) {
        const host = req.headers['x-forwarded-host'] || req.headers.host;
        const proto = req.headers['x-forwarded-proto'] || 'https';
        const webhookUrl = `${proto}://${host}/api/index`;

        await bot.telegram.setWebhook(webhookUrl, {
          secret_token: config.webhookSecret || undefined,
        });

        return res.status(200).json({
          status: 'success',
          message: `Webhook successfully registered to: ${webhookUrl}`,
        });
      }

      return res.status(200).json({
        status: 'ok',
        platform: 'Vercel Serverless',
        bot: 'IT Lead Bot',
        timestamp: new Date().toISOString(),
        tip: 'To set Telegram webhook automatically, visit /set-webhook in your browser',
      });
    }

    if (req.method === 'POST') {
      // Optional security check for webhook secret token
      if (config.webhookSecret) {
        const secretHeader = req.headers['x-telegram-bot-api-secret-token'];
        if (secretHeader !== config.webhookSecret) {
          return res.status(403).send('Forbidden: invalid secret token');
        }
      }

      // Process update via Telegraf
      await bot.handleUpdate(req.body, res);

      if (!res.writableEnded) {
        res.status(200).send('OK');
      }
      return;
    }

    res.status(405).send('Method Not Allowed');
  } catch (error) {
    console.error('Error handling Telegram update on Vercel:', error);
    if (!res.writableEnded) {
      res.status(500).send('Internal Server Error');
    }
  }
}
