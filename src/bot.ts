import { Telegraf, session, Scenes, Markup } from 'telegraf';
import { BotContext } from './types/context';
import { config } from './config/env';
import {
  MESSAGES,
  MAIN_MENU_BUTTONS,
  getMainMenuKeyboard,
} from './config/survey';
import { orderWizard, ORDER_WIZARD_SCENE_ID } from './scenes/orderWizard';

export function createBot(): Telegraf<BotContext> {
  const bot = new Telegraf<BotContext>(config.botToken);

  // Setup scenes stage
  const stage = new Scenes.Stage<BotContext>([orderWizard]);

  // Middlewares
  bot.use(session());
  bot.use(stage.middleware());

  // Interactive bottom keyboard listeners
  bot.hears(MAIN_MENU_BUTTONS.newOrder, async (ctx) => {
    await ctx.scene.enter(ORDER_WIZARD_SCENE_ID);
  });

  bot.hears(MAIN_MENU_BUTTONS.services, async (ctx) => {
    await ctx.reply(MESSAGES.servicesInfo, {
      parse_mode: 'HTML',
      ...getMainMenuKeyboard(),
    });
  });

  // Global cancel command (handles cases outside of scene as well)
  bot.command('cancel', async (ctx) => {
    if (ctx.scene.current) {
      await ctx.scene.leave();
    }
    await ctx.reply(MESSAGES.cancelled, getMainMenuKeyboard());
  });

  bot.hears(MAIN_MENU_BUTTONS.cancel, async (ctx) => {
    if (ctx.scene.current) {
      await ctx.scene.leave();
    }
    await ctx.reply(MESSAGES.cancelled, getMainMenuKeyboard());
  });

  // Start command enters the order wizard
  bot.command('start', async (ctx) => {
    await ctx.scene.enter(ORDER_WIZARD_SCENE_ID);
  });

  // Help command
  bot.help(async (ctx) => {
    await ctx.reply(
      '🤖 <b>IT Services Lead Bot</b>\n\n' +
        '• /start — Начать оформление заявки\n' +
        '• /cancel — Отменить текущий ввод на любом шаге\n\n' +
        'Или воспользуйтесь кнопками меню внизу экрана 👇',
      {
        parse_mode: 'HTML',
        ...getMainMenuKeyboard(),
      }
    );
  });

  // Global error handling
  bot.catch((err, ctx) => {
    console.error(`[Bot Error] Ошибка при обработке апдейта ${ctx.update.update_id}:`, err);
  });

  return bot;
}
