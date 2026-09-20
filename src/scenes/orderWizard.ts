import { Scenes, Markup } from 'telegraf';
import { BotContext } from '../types/context';
import {
  CATEGORIES,
  BUDGETS,
  MESSAGES,
  MAIN_MENU_BUTTONS,
  getCategoryReplyKeyboard,
  getBudgetReplyKeyboard,
  getContactReplyKeyboard,
  getCancelReplyKeyboard,
  getMainMenuKeyboard,
  formatAdminMessage,
} from '../config/survey';
import { config } from '../config/env';

export const ORDER_WIZARD_SCENE_ID = 'ORDER_WIZARD_SCENE';

async function initAndPromptCategory(ctx: BotContext) {
  ctx.scene.session.orderData = {};
  ctx.wizard.selectStep(0);

  await ctx.reply(MESSAGES.welcome, getCategoryReplyKeyboard());
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
    // Check if user clicked cancel
    if (
      ctx.message &&
      'text' in ctx.message &&
      ctx.message.text === MAIN_MENU_BUTTONS.cancel
    ) {
      await ctx.reply(MESSAGES.cancelled, getMainMenuKeyboard());
      return ctx.scene.leave();
    }

    let selectedCategory: string | undefined;

    // Check text input from bottom keyboard
    if (ctx.message && 'text' in ctx.message) {
      const text = ctx.message.text.trim();
      const found = CATEGORIES.find(
        (c) => c.label === text || c.label.toLowerCase() === text.toLowerCase()
      );
      if (found) {
        selectedCategory = found.label;
      }
    }

    // Fallback for inline button if any
    if (!selectedCategory && ctx.callbackQuery && 'data' in ctx.callbackQuery) {
      const selectedId = ctx.callbackQuery.data;
      const found = CATEGORIES.find((c) => c.id === selectedId);
      if (found) {
        await ctx.answerCbQuery();
        selectedCategory = found.label;
      }
    }

    if (selectedCategory) {
      ctx.scene.session.orderData = {
        ...ctx.scene.session.orderData,
        category: selectedCategory,
      };

      await ctx.reply(
        `Выбрано: <b>${selectedCategory}</b>\n\n${MESSAGES.descriptionPrompt}`,
        {
          parse_mode: 'HTML',
          ...getCancelReplyKeyboard(),
        }
      );
      return ctx.wizard.next();
    }

    // If user sent invalid input, prompt again with bottom keyboard
    await ctx.reply(MESSAGES.errors.categoryInvalid, getCategoryReplyKeyboard());
  },

  // Step 2: Handle Description & ask for Budget
  async (ctx) => {
    // Check if user clicked cancel
    if (
      ctx.message &&
      'text' in ctx.message &&
      ctx.message.text === MAIN_MENU_BUTTONS.cancel
    ) {
      await ctx.reply(MESSAGES.cancelled, getMainMenuKeyboard());
      return ctx.scene.leave();
    }

    if (!ctx.message || !('text' in ctx.message)) {
      await ctx.reply(MESSAGES.errors.descriptionInvalid, getCancelReplyKeyboard());
      return;
    }

    const description = ctx.message.text.trim();
    if (description.length < 5) {
      await ctx.reply(
        'Пожалуйста, опишите задачу чуть подробнее (минимум несколько слов) ✍️',
        getCancelReplyKeyboard()
      );
      return;
    }

    ctx.scene.session.orderData = {
      ...ctx.scene.session.orderData,
      description,
    };

    await ctx.reply(MESSAGES.budgetPrompt, getBudgetReplyKeyboard());
    return ctx.wizard.next();
  },

  // Step 3: Handle Budget & ask for Contact
  async (ctx) => {
    // Check if user clicked cancel
    if (
      ctx.message &&
      'text' in ctx.message &&
      ctx.message.text === MAIN_MENU_BUTTONS.cancel
    ) {
      await ctx.reply(MESSAGES.cancelled, getMainMenuKeyboard());
      return ctx.scene.leave();
    }

    let selectedBudget: string | undefined;

    // Check text input from bottom keyboard
    if (ctx.message && 'text' in ctx.message) {
      const text = ctx.message.text.trim();
      const found = BUDGETS.find(
        (b) => b.label === text || b.label.toLowerCase() === text.toLowerCase()
      );
      if (found) {
        selectedBudget = found.label;
      }
    }

    // Fallback for inline button if any
    if (!selectedBudget && ctx.callbackQuery && 'data' in ctx.callbackQuery) {
      const selectedId = ctx.callbackQuery.data;
      const found = BUDGETS.find((b) => b.id === selectedId);
      if (found) {
        await ctx.answerCbQuery();
        selectedBudget = found.label;
      }
    }

    if (selectedBudget) {
      ctx.scene.session.orderData = {
        ...ctx.scene.session.orderData,
        budget: selectedBudget,
      };

      await ctx.reply(
        `Бюджет: <b>${selectedBudget}</b>\n\n${MESSAGES.contactPrompt}`,
        {
          parse_mode: 'HTML',
          ...getContactReplyKeyboard(),
        }
      );
      return ctx.wizard.next();
    }

    await ctx.reply(MESSAGES.errors.budgetInvalid, getBudgetReplyKeyboard());
  },

  // Step 4: Handle Contact & finalize submission
  async (ctx) => {
    // Check if user pressed cancel button on contact keyboard
    if (
      ctx.message &&
      'text' in ctx.message &&
      ctx.message.text === MAIN_MENU_BUTTONS.cancel
    ) {
      await ctx.reply(MESSAGES.cancelled, getMainMenuKeyboard());
      return ctx.scene.leave();
    }

    let contactInfo: string | null = null;

    if (ctx.message) {
      if ('contact' in ctx.message && ctx.message.contact) {
        const phone = ctx.message.contact.phone_number;
        const firstName = ctx.message.contact.first_name || '';
        const lastName = ctx.message.contact.last_name || '';
        contactInfo = `Телефон: +${phone.replace(/^\+/, '')} (${[firstName, lastName].filter(Boolean).join(' ')})`;
      } else if ('text' in ctx.message && ctx.message.text) {
        contactInfo = ctx.message.text.trim();
      }
    }

    if (!contactInfo) {
      await ctx.reply(MESSAGES.errors.contactInvalid, getContactReplyKeyboard());
      return;
    }

    ctx.scene.session.orderData = {
      ...ctx.scene.session.orderData,
      contact: contactInfo,
    };

    const from = ctx.from;
    const orderData = ctx.scene.session.orderData;

    // Send confirmation to the client and show interactive bottom menu
    await ctx.reply(MESSAGES.success, getMainMenuKeyboard());

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
  await ctx.reply(MESSAGES.cancelled, getMainMenuKeyboard());
  return ctx.scene.leave();
});

orderWizard.hears(MAIN_MENU_BUTTONS.cancel, async (ctx) => {
  await ctx.reply(MESSAGES.cancelled, getMainMenuKeyboard());
  return ctx.scene.leave();
});

// Allow user to restart at any moment from within the scene
orderWizard.command('start', async (ctx) => {
  return initAndPromptCategory(ctx);
});

orderWizard.hears(MAIN_MENU_BUTTONS.newOrder, async (ctx) => {
  return initAndPromptCategory(ctx);
});
