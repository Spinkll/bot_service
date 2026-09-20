import { Scenes } from 'telegraf';
import { BotContext } from '../types/context';
import {
  MESSAGES,
  getLanguage,
  getCategoryReplyKeyboard,
  getBudgetReplyKeyboard,
  getContactReplyKeyboard,
  getCancelReplyKeyboard,
  getMainMenuKeyboard,
  getAllButtonVariants,
  findCategory,
  findBudget,
  formatAdminMessage,
} from '../config/survey';
import { config } from '../config/env';

export const ORDER_WIZARD_SCENE_ID = 'ORDER_WIZARD_SCENE';

function isCancelInput(text?: string): boolean {
  if (!text) return false;
  const cancelVariants = getAllButtonVariants('cancel');
  return cancelVariants.includes(text) || text === '/cancel';
}

export async function initAndPromptCategory(ctx: BotContext) {
  const lang = getLanguage(ctx);
  const msgs = MESSAGES[lang];

  ctx.scene.session.orderData = {};
  ctx.wizard.selectStep(0);

  await ctx.reply(msgs.welcome, getCategoryReplyKeyboard(lang));
  return ctx.wizard.next();
}

export const orderWizard = new Scenes.WizardScene<BotContext>(
  ORDER_WIZARD_SCENE_ID,

  // Step 0: Welcome & Category selection prompt
  async (ctx) => {
    return initAndPromptCategory(ctx);
  },

  // Step 1: Handle Category selection & ask for Description
  async (ctx) => {
    const lang = getLanguage(ctx);
    const msgs = MESSAGES[lang];

    // Check if user clicked cancel
    if (ctx.message && 'text' in ctx.message && isCancelInput(ctx.message.text)) {
      await ctx.reply(msgs.cancelled, getMainMenuKeyboard(lang));
      return ctx.scene.leave();
    }

    let selectedCategoryName: string | undefined;
    let selectedCategoryId: string | undefined;

    // Check text input from bottom keyboard
    if (ctx.message && 'text' in ctx.message) {
      const text = ctx.message.text.trim();
      const found = findCategory(text, lang);
      if (found) {
        selectedCategoryName = found.label;
        selectedCategoryId = found.id;
      }
    }

    // Fallback for inline button if any
    if (!selectedCategoryName && ctx.callbackQuery && 'data' in ctx.callbackQuery) {
      const selectedId = ctx.callbackQuery.data;
      const found = findCategory(selectedId, lang);
      if (found) {
        await ctx.answerCbQuery();
        selectedCategoryName = found.label;
        selectedCategoryId = found.id;
      }
    }

    if (selectedCategoryName) {
      ctx.scene.session.orderData = {
        ...ctx.scene.session.orderData,
        category: selectedCategoryName,
        categoryId: selectedCategoryId,
      };

      await ctx.reply(
        `${msgs.categorySelected} <b>${selectedCategoryName}</b>\n\n${msgs.descriptionPrompt}`,
        {
          parse_mode: 'HTML',
          ...getCancelReplyKeyboard(lang),
        }
      );
      return ctx.wizard.next();
    }

    // If user sent invalid input, prompt again with keyboard
    await ctx.reply(msgs.errors.categoryInvalid, getCategoryReplyKeyboard(lang));
  },

  // Step 2: Handle Description & ask for Budget
  async (ctx) => {
    const lang = getLanguage(ctx);
    const msgs = MESSAGES[lang];

    // Check if user clicked cancel
    if (ctx.message && 'text' in ctx.message && isCancelInput(ctx.message.text)) {
      await ctx.reply(msgs.cancelled, getMainMenuKeyboard(lang));
      return ctx.scene.leave();
    }

    if (!ctx.message || !('text' in ctx.message)) {
      await ctx.reply(msgs.errors.descriptionInvalid, getCancelReplyKeyboard(lang));
      return;
    }

    const description = ctx.message.text.trim();
    if (description.length < 5) {
      await ctx.reply(msgs.descriptionTooShort, getCancelReplyKeyboard(lang));
      return;
    }

    ctx.scene.session.orderData = {
      ...ctx.scene.session.orderData,
      description,
    };

    await ctx.reply(msgs.budgetPrompt, getBudgetReplyKeyboard(lang));
    return ctx.wizard.next();
  },

  // Step 3: Handle Budget & ask for Contact
  async (ctx) => {
    const lang = getLanguage(ctx);
    const msgs = MESSAGES[lang];

    // Check if user clicked cancel
    if (ctx.message && 'text' in ctx.message && isCancelInput(ctx.message.text)) {
      await ctx.reply(msgs.cancelled, getMainMenuKeyboard(lang));
      return ctx.scene.leave();
    }

    let selectedBudgetName: string | undefined;
    let selectedBudgetId: string | undefined;

    // Check text input from bottom keyboard
    if (ctx.message && 'text' in ctx.message) {
      const text = ctx.message.text.trim();
      const found = findBudget(text, lang);
      if (found) {
        selectedBudgetName = found.label;
        selectedBudgetId = found.id;
      }
    }

    // Fallback for inline button if any
    if (!selectedBudgetName && ctx.callbackQuery && 'data' in ctx.callbackQuery) {
      const selectedId = ctx.callbackQuery.data;
      const found = findBudget(selectedId, lang);
      if (found) {
        await ctx.answerCbQuery();
        selectedBudgetName = found.label;
        selectedBudgetId = found.id;
      }
    }

    if (selectedBudgetName) {
      ctx.scene.session.orderData = {
        ...ctx.scene.session.orderData,
        budget: selectedBudgetName,
        budgetId: selectedBudgetId,
      };

      await ctx.reply(
        `${msgs.budgetSelected} <b>${selectedBudgetName}</b>\n\n${msgs.contactPrompt}`,
        {
          parse_mode: 'HTML',
          ...getContactReplyKeyboard(lang),
        }
      );
      return ctx.wizard.next();
    }

    await ctx.reply(msgs.errors.budgetInvalid, getBudgetReplyKeyboard(lang));
  },

  // Step 4: Handle Contact & finalize submission
  async (ctx) => {
    const lang = getLanguage(ctx);
    const msgs = MESSAGES[lang];

    // Check if user clicked cancel
    if (ctx.message && 'text' in ctx.message && isCancelInput(ctx.message.text)) {
      await ctx.reply(msgs.cancelled, getMainMenuKeyboard(lang));
      return ctx.scene.leave();
    }

    let contactInfo: string | null = null;

    if (ctx.message) {
      if ('contact' in ctx.message && ctx.message.contact) {
        const phone = ctx.message.contact.phone_number;
        const firstName = ctx.message.contact.first_name || '';
        const lastName = ctx.message.contact.last_name || '';
        contactInfo = `${msgs.phonePrefix}: +${phone.replace(/^\+/, '')} (${[firstName, lastName].filter(Boolean).join(' ')})`;
      } else if ('text' in ctx.message && ctx.message.text) {
        contactInfo = ctx.message.text.trim();
      }
    }

    if (!contactInfo) {
      await ctx.reply(msgs.errors.contactInvalid, getContactReplyKeyboard(lang));
      return;
    }

    ctx.scene.session.orderData = {
      ...ctx.scene.session.orderData,
      contact: contactInfo,
    };

    const from = ctx.from;
    const orderData = ctx.scene.session.orderData;

    // Send confirmation to the client and show interactive bottom menu
    await ctx.reply(msgs.success, getMainMenuKeyboard(lang));

    // Send formatted lead notification to admin chat
    if (from && orderData.category && orderData.description && orderData.budget) {
      const adminMessage = formatAdminMessage({
        category: orderData.category,
        description: orderData.description,
        budget: orderData.budget,
        contact: contactInfo,
        userId: from.id,
        username: from.username,
        firstName: from.first_name,
        lastName: from.last_name,
        language: lang,
      });

      try {
        await ctx.telegram.sendMessage(config.adminChatId, adminMessage, {
          parse_mode: 'HTML',
        });
      } catch (adminSendError) {
        console.error(
          '[Admin Notification Error]: Не удалось отправить заявку в админский чат. Проверьте ADMIN_CHAT_ID и права бота в чате.',
          adminSendError
        );
      }
    }

    return ctx.scene.leave();
  }
);

// Allow user to cancel at any moment from within the scene
orderWizard.command('cancel', async (ctx) => {
  const lang = getLanguage(ctx);
  await ctx.reply(MESSAGES[lang].cancelled, getMainMenuKeyboard(lang));
  return ctx.scene.leave();
});

orderWizard.hears(getAllButtonVariants('cancel'), async (ctx) => {
  const lang = getLanguage(ctx);
  await ctx.reply(MESSAGES[lang].cancelled, getMainMenuKeyboard(lang));
  return ctx.scene.leave();
});

// Allow user to restart at any moment from within the scene
orderWizard.command('start', async (ctx) => {
  return initAndPromptCategory(ctx);
});

orderWizard.hears(getAllButtonVariants('newOrder'), async (ctx) => {
  return initAndPromptCategory(ctx);
});
