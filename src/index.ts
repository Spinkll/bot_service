import { createBot } from './bot';
import { config } from './config/env';

async function main() {
  try {
    const bot = createBot();

    // Enable graceful stop
    const stopHandler = (signal: string) => {
      console.log(`Получен сигнал ${signal}, завершение работы бота...`);
      bot.stop(signal);
      process.exit(0);
    };

    process.once('SIGINT', () => stopHandler('SIGINT'));
    process.once('SIGTERM', () => stopHandler('SIGTERM'));

    // If webhook domain is provided (or running on Render via RENDER_EXTERNAL_URL)
    if (config.webhookDomain) {
      const cleanDomain = config.webhookDomain
        .replace(/^https?:\/\//, '')
        .replace(/\/+$/, '');

      console.log(`🌐 Запуск Telegram-бота в режиме Webhook на домене: ${cleanDomain}...`);

      await bot.launch({
        webhook: {
          domain: cleanDomain,
          path: config.webhookPath,
          port: config.port,
          secretToken: config.webhookSecret || undefined,
          cb: (req, res) => {
            if (req.url === '/' || req.url === '/health') {
              res.writeHead(200, { 'Content-Type': 'application/json' });
              res.end(
                JSON.stringify({
                  status: 'ok',
                  mode: 'webhook',
                  uptime: Math.floor(process.uptime()),
                  timestamp: new Date().toISOString(),
                })
              );
              return;
            }
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('Not Found');
          },
        },
      });

      console.log(
        `✅ Webhook успешно установлен на https://${cleanDomain}${config.webhookPath}`
      );
      console.log(
        `🩺 HTTP health-check сервер доступен на порту ${config.port} (эндпоинты: / и /health)`
      );
    } else {
      // Local development or polling fallback
      console.log('🤖 Запуск Telegram-бота в режиме Polling (локальная разработка)...');
      await bot.launch();
      console.log('✅ Бот успешно запущен в режиме Polling и готов к приёму заявок!');
    }
  } catch (error) {
    console.error('❌ Ошибка при запуске бота:', error);
    process.exit(1);
  }
}

main();
