# Superwall → Telegram Relay (Vercel)

Minimal Vercel Serverless Function that receives Superwall webhooks and forwards a message to a Telegram chat.

- Endpoint: `/api/superwall-telegram`
- Env vars required:
  - `TELEGRAM_TOKEN`
  - `TELEGRAM_CHAT_ID`

Reference: Superwall webhook payload format and Test button — https://superwall.com/docs/dashboard/integrations#webhooks
