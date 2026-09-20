import { Telegraf, session, Scenes } from 'telegraf';
import { BotContext, Language } from './types/context';
import { config } from './config/env';
import {
  DEFAULT_LANGUAGE,
  MESSAGES,
  getLanguage,
  getMainMenuKeyboard,
  getLanguageInlineKeyboard,
  getAllButtonVariants,
} from './config/survey';
import { orderWizard, ORDER_WIZARD_SCENE_ID } from './scenes/orderWizard';

export function createBot(): Telegraf<BotContext> {
  const bot = new Telegraf<BotContext>(config.botToken);

  // Setup scenes stage
  const stage = new Scenes.Stage<BotContext>([orderWizard]);

  // Middlewares
  bot.use(session());

  // Ensure default language is English
  bot.use((ctx, next) => {
    if (ctx.session && !ctx.session.language) {
      ctx.session.language = DEFAULT_LANGUAGE;
    }
    return next();
  });

  bot.use(stage.middleware());

  // Helper to send language menu
  const sendLanguageMenu = async (ctx: BotContext) => {
    if (ctx.scene.current) {
      await ctx.scene.leave();
    }
    const lang = getLanguage(ctx);
    const title =
      lang === 'uk'
        ? '🌐 <b>Оберіть мову:</b>'
        : lang === 'ru'
        ? '🌐 <b>Выберите язык:</b>'
        : '🌐 <b>Choose your language:</b>';

    await ctx.reply(title, {
      parse_mode: 'HTML',
      ...getLanguageInlineKeyboard('lang_menu'),
    });
  };

  // Start command prompts language selection before starting
  bot.command('start', async (ctx) => {
    if (ctx.scene.current) {
      await ctx.scene.leave();
    }

    await ctx.reply(
      '👋 <b>Welcome to IT Services Lead Bot!</b>\n\n' +
        'Please select your preferred language before starting:\n' +
        '🇺🇦 Будь ласка, оберіть мову перед початком:\n' +
        '🇷🇺 Пожалуйста, выберите язык перед началом:',
      {
        parse_mode: 'HTML',
        ...getLanguageInlineKeyboard('lang_start'),
      }
    );
  });

  // Language selection callback from /start flow -> starts order wizard
  bot.action(/^lang_start_(en|uk|ru)$/, async (ctx) => {
    const chosenLang = ctx.match[1] as Language;
    if (ctx.session) {
      ctx.session.language = chosenLang;
    }
    await ctx.answerCbQuery();
    await ctx.reply(MESSAGES[chosenLang].languageChanged);
    await ctx.scene.enter(ORDER_WIZARD_SCENE_ID);
  });

  // Language selection callback from menu / /language command -> updates menu
  bot.action(/^lang_menu_(en|uk|ru)$/, async (ctx) => {
    const chosenLang = ctx.match[1] as Language;
    if (ctx.session) {
      ctx.session.language = chosenLang;
    }
    await ctx.answerCbQuery();
    await ctx.reply(
      MESSAGES[chosenLang].languageChanged,
      getMainMenuKeyboard(chosenLang)
    );
  });

  // Fallback language selection callback
  bot.action(/^lang_(en|uk|ru)$/, async (ctx) => {
    const chosenLang = ctx.match[1] as Language;
    if (ctx.session) {
      ctx.session.language = chosenLang;
    }
    await ctx.answerCbQuery();
    await ctx.reply(
      MESSAGES[chosenLang].languageChanged,
      getMainMenuKeyboard(chosenLang)
    );
  });

  // Language switch commands
  bot.command(['language', 'lang'], async (ctx) => {
    await sendLanguageMenu(ctx);
  });

  // Interactive bottom keyboard listeners
  bot.hears(getAllButtonVariants('newOrder'), async (ctx) => {
    await ctx.scene.enter(ORDER_WIZARD_SCENE_ID);
  });

  bot.hears(getAllButtonVariants('services'), async (ctx) => {
    const lang = getLanguage(ctx);
    await ctx.reply(MESSAGES[lang].servicesInfo, {
      parse_mode: 'HTML',
      ...getMainMenuKeyboard(lang),
    });
  });

  bot.hears(getAllButtonVariants('changeLang'), async (ctx) => {
    await sendLanguageMenu(ctx);
  });

  // Global cancel command and bottom button listener
  bot.command('cancel', async (ctx) => {
    if (ctx.scene.current) {
      await ctx.scene.leave();
    }
    const lang = getLanguage(ctx);
    await ctx.reply(MESSAGES[lang].cancelled, getMainMenuKeyboard(lang));
  });

  bot.hears(getAllButtonVariants('cancel'), async (ctx) => {
    if (ctx.scene.current) {
      await ctx.scene.leave();
    }
    const lang = getLanguage(ctx);
    await ctx.reply(MESSAGES[lang].cancelled, getMainMenuKeyboard(lang));
  });

  // Help command
  bot.help(async (ctx) => {
    const lang = getLanguage(ctx);
    await ctx.reply(MESSAGES[lang].help, {
      parse_mode: 'HTML',
      ...getMainMenuKeyboard(lang),
    });
  });

  // Global error handling
  bot.catch((err, ctx) => {
    console.error(`[Bot Error] Ошибка при обработке апдейта ${ctx.update.update_id}:`, err);
  });

  return bot;
}
