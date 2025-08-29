export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(200).send('ok');
  try {
    const body = req.body || {};
    const eventName = (typeof body.event === "string" ? body.event : (body?.event?.type || body.type)) || "event";
    const productId = body.product_id || body.productId || body.productIdentifier || body?.event?.product_identifier;
    const env = body.environment || body.env || body?.event?.environment;
    const country = body.country || body.countryCode || body?.event?.country_code;
    const price = body.price || body?.event?.price || body?.event?.price_in_purchased_currency;
    const currency = body.currency || body?.event?.currency || body?.event?.currency_code;
    const rcAppUserId = body.app_user_id || body.appUserId || body?.event?.app_user_id;
    const rcEventTimestamp = body.occurred_at_ms || body?.event?.event_timestamp_ms || body?.event?.occurred_at_ms;

    const lines = [
      `RevenueCat: ${eventName}`,
      productId && `Product: ${productId}`,
      price != null && `Price: ${price}${currency ? ' ' + currency : ''}`,
      env && `Env: ${env}`,
      country && `Country: ${country}`,
      rcAppUserId && `User: ${rcAppUserId}`,
      rcEventTimestamp && `At: ${new Date(Number(rcEventTimestamp)).toISOString()}`,
    ].filter(Boolean);

    const text = lines.join('\n');

    const token = process.env.TELEGRAM_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;
    if (!token || !chatId) return res.status(200).json({ ok: true, note: 'telegram_env_missing' });

    const tg = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text })
    });

    if (!tg.ok) return res.status(200).json({ ok: false, error: 'telegram_failed', details: await tg.text().catch(()=> '') });
    return res.status(200).json({ ok: true });
  } catch {
    return res.status(200).json({ ok: false, error: 'relay_error' });
  }
}
