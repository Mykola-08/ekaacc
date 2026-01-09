import { Telegraf, Markup } from 'telegraf';
import { supabaseAdmin } from './supabase-admin';

const token = process.env.TELEGRAM_BOT_TOKEN;

// Ensure we don't crash during build if token is missing
export const bot = token ? new Telegraf(token) : null;

const webAppUrl = process.env.WEBAPP_BASE_URL || 'https://eka-system-web.vercel.app'; // Default updated to project context if known, or generic

if (bot) {
    // Middleware to log and check user
    bot.use(async (ctx, next) => {
        if (ctx.from) {
            const { id, first_name, last_name, username } = ctx.from;
            // Upsert user
            try {
                // Using supabaseAdmin to bypass RLS for bot operations
                await supabaseAdmin.from('users').upsert({
                    telegram_user_id: id,
                    first_name,
                    last_name,
                    username,
                    updated_at: new Date().toISOString(),
                }, { onConflict: 'telegram_user_id' });
            } catch (e) {
                console.error('Error upserting user:', e);
            }
        }
        await next();
    });

    // Start
    bot.start((ctx) => {
        ctx.reply('Welcome to EKA Booking & Account Bot!', Markup.inlineKeyboard([
            [Markup.button.webApp('Open App', `${webAppUrl}/telegram`)],
            [Markup.button.callback('June Program', 'june_info')],
            [Markup.button.callback('Help', 'help')]
        ]));
    });

    // Commands
    bot.command('book', (ctx) => {
        ctx.reply('Click below to book a session:', Markup.inlineKeyboard([
            [Markup.button.webApp('Book Now', `${webAppUrl}/telegram/book`)]
        ]));
    });

    bot.command('my_bookings', (ctx) => {
        ctx.reply('Manage your bookings:', Markup.inlineKeyboard([
            [Markup.button.webApp('My Bookings', `${webAppUrl}/telegram/bookings`)]
        ]));
    });

    bot.command('june', (ctx) => {
        ctx.reply('June "Rastanovki" Program. Choose an option:', Markup.inlineKeyboard([
            [Markup.button.callback('Group Session', 'june_group')],
            [Markup.button.callback('Individual Session', 'june_individual')]
        ]));
    });

    // Actions
    bot.action('june_info', (ctx) => {
        ctx.reply('June "Rastanovki" Program details...\n\nChoose an option:', Markup.inlineKeyboard([
            [Markup.button.callback('Group Session', 'june_group')],
            [Markup.button.callback('Individual Session', 'june_individual')]
        ]));
    });

    bot.action('june_group', (ctx) => {
        ctx.reply('To register for the June Group Session, please open the registration form:', Markup.inlineKeyboard([
            [Markup.button.webApp('Register for Group', `${webAppUrl}/telegram/june/group`)]
        ]));
    });

    bot.action('june_individual', (ctx) => {
        ctx.reply('To register for an Individual Session, please open the registration form:', Markup.inlineKeyboard([
            [Markup.button.webApp('Register for Individual', `${webAppUrl}/telegram/june/individual`)]
        ]));
    });

    bot.help((ctx) => {
        ctx.reply('Available commands:\n/start - Start bot\n/book - Book a session\n/my_bookings - View bookings\n/june - June Program\n/support - Contact support');
    });

    // Error handling
    bot.catch((err, ctx) => {
        console.error(`Ooops, encountered an error for ${ctx.updateType}`, err);
    });
}
