export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(200).send('ok');
  try {
    const { type, data } = req.body || {};
    const event = type || data?.name || 'event';

    const lines = [
      `Superwall: ${event}`,
      data?.productId && `Product: ${data.productId}`,
      data?.price != null && `Price: $${data.price}`,
      data?.proceeds != null && `Proceeds: $${data.proceeds}`,
      data?.environment && `Env: ${data.environment}`,
      data?.countryCode && `Country: ${data.countryCode}`,
      data?.originalTransactionId && `Original Tx: ${data.originalTransactionId}`,
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
