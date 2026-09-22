export async function sendMessage(token: string | undefined, chatId: number, text: string) {
  if (!token) return;
  await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text }),
  });
}

export async function sendTelegramNotification(chatId: number, text: string) {
  await sendMessage(process.env.TELEGRAM_BOT_TOKEN, chatId, text);
}
