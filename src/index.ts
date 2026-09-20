import { createBot } from './bot';

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

    console.log('🤖 Запуск Telegram-бота в режиме Polling...');
    await bot.launch();
    console.log('✅ Бот успешно запущен и готов к приёму заявок!');
  } catch (error) {
    console.error('❌ Ошибка при запуске бота:', error);
    process.exit(1);
  }
}

main();
