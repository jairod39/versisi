import { NextRequest, NextResponse } from 'next/server';

/**
 * Webhook del bot de Telegram. Recibe mensajes/comandos y responde.
 * Úsalo para: abrir el enlace de un reto dentro de Telegram, y (en la fase 6
 * completa) enviar notificaciones de "X quiere jugar contigo" / "hay match".
 *
 * Configuración, después de desplegar en Vercel:
 * https://api.telegram.org/bot<TELEGRAM_BOT_TOKEN>/setWebhook?url=https://tu-dominio.vercel.app/api/telegram/webhook
 */
import { sendMessage } from '@/lib/telegram';

export async function POST(req: NextRequest) {
  const update = await req.json();
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

  const chatId = update?.message?.chat?.id;
  const text: string | undefined = update?.message?.text;

  if (chatId && text?.startsWith('/start')) {
    const payload = text.split(' ')[1]; // /start <slug-del-reto>, si vino de un link
    const url = payload ? `${siteUrl}/es/r/${payload}` : siteUrl;
    await sendMessage(token, chatId,
      `¡Hola! Soy el bot de Versisi 💞\n\nUn juego para conocer a alguien.\n${url}`
    );
  }

  return NextResponse.json({ ok: true });
}
