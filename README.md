# Versisi

Un juego para conocer a alguien. Web bilingüe (ES/EN) con Next.js + Supabase.

Este proyecto **ya compila y funciona** en modo de prueba (las escenas se
generan como ilustraciones placeholder gratis, sin gastar en IA, gracias a
`IMAGE_GEN_PROVIDER=stub`). Cuando quieras conectar generación real, ver la
sección "Conectar la IA de verdad" más abajo.

## 1. Crear el proyecto en Supabase (gratis)

1. Ve a https://supabase.com, crea cuenta y un proyecto nuevo (elige la región más cercana a ti).
2. **Al crear el proyecto:** en "Security", deja marcado "Enable Data API" y **desmarca** "Automatically expose new tables" y "Enable automatic RLS" (el paso 2 de abajo ya da los permisos correctos a mano).
3. En el panel del proyecto, ve a **SQL Editor** → **New query**, pega todo el
   contenido de `supabase/schema.sql` y dale **Run** (elige "Run and enable RLS"
   si te lo pregunta). Esto crea todas las tablas, las políticas de seguridad,
   la tabla `access_keys` (la Llave Versisi), y los permisos base que las tablas
   nuevas necesitan para funcionar con RLS.
4. Ve a **Authentication → Sign In / Providers** y activa **"Allow anonymous sign-ins"**
   (este prototipo usa sesiones anónimas para no obligar a registrarse con
   correo desde el día 1; puedes cambiarlo luego por login con Telegram o email).
5. Ve a **Storage**, crea un bucket llamado exactamente `photos` (minúsculas), y
   márcalo como **público** al crearlo.
6. Dentro del bucket `photos`, ve a su pestaña **Policies** y crea dos políticas
   desde cero (no uses las plantillas, no encajan con este proyecto):
   - **INSERT**, target role `authenticated`, condición: `bucket_id = 'photos'`
   - **SELECT**, target role `anon`, condición: `bucket_id = 'photos'`
7. Ve a **Settings → API** y copia tres valores: `Project URL`, `anon public key`
   y `service_role key` (este último es secreto, no lo compartas ni lo subas a GitHub).
   **Importante:** el "Project URL" correcto NO lleva `/rest/v1/` al final; si lo
   ves con eso, usa solo la parte de antes (`https://tuproyecto.supabase.co`).

## 2. Variables de entorno

Copia `.env.example` a `.env.local` y rellena los valores del paso 1:

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
TELEGRAM_BOT_TOKEN=...   (el token que ya tienes de BotFather)
IMAGE_GEN_PROVIDER=stub  (déjalo así para probar gratis)
DAILY_GENERATION_BUDGET_USD=5
BILLING_ENABLED=false
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

**Si las agregas en Vercel (Settings → Environment Variables):** las que
empiezan con `NEXT_PUBLIC_` deben quedar con Type = **Config**, nunca
**Secret**. Si las marcas como Secret por error, Vercel no te deja
convertirlas después: tienes que borrarlas y crearlas de nuevo como Config.
Las demás (`SUPABASE_SERVICE_ROLE_KEY`, `TELEGRAM_BOT_TOKEN`) sí deben ser Secret.

## 3. Probarlo en tu computador (opcional, necesita Node.js instalado)

```
npm install
npm run dev
```

Abre http://localhost:3000/es

## 4. Subir a GitHub y desplegar en Vercel (gratis)

1. Crea un repositorio nuevo en https://github.com/new (privado o público, como prefieras).
2. Sube todo el contenido de esta carpeta (arrastra los archivos en la web de
   GitHub, o usa `git push` si prefieres terminal). **No subas `.env.local`**
   (ya está en `.gitignore` para que no se suba por accidente).
3. Ve a https://vercel.com, conecta tu cuenta de GitHub e importa este repositorio.
4. En la configuración del proyecto en Vercel, ve a **Settings → Environment
   Variables** y pega ahí las mismas variables del paso 2, cambiando
   `NEXT_PUBLIC_SITE_URL` por la URL real que Vercel te da
   (algo como `https://versisi.vercel.app`).
5. Dale **Deploy**. En unos minutos tu app está publicada y gratis.

## 5. Conectar el bot de Telegram

1. Con tu app ya desplegada en Vercel, visita en el navegador (cambia TOKEN y TU-DOMINIO):
   ```
   https://api.telegram.org/botTOKEN/setWebhook?url=https://TU-DOMINIO.vercel.app/api/telegram/webhook
   ```
2. Escríbele a tu bot en Telegram `/start` y debería responderte.

## 6. Probar el recorrido completo

1. Entra a tu app, crea un reto con una foto tuya (`/es/create`).
2. Copia el link (`/es/r/tu-slug`) y ábrelo en otra pestaña de incógnito, o en
   el celular: sube otra foto y envía la solicitud.
3. Vuelve a tu pestaña normal, entra a `/es/dashboard`, aprueba la solicitud.
4. Verás las 3 escenas (placeholder mientras `IMAGE_GEN_PROVIDER=stub`).
   Decide "me interesa" en ambas pestañas.
5. Si ambas dicen que sí, se abre el chat en `/es/match/...`.

## Conectar la IA de verdad (cuando quieras dejar de usar el stub)

Abre `lib/generator.ts` y completa la función `generateWithRealProvider`.
Ahí conectas la API de edición de imágenes que elijas (debe aceptar dos fotos
de entrada más un texto de escena). Cambia `IMAGE_GEN_PROVIDER=stub` por el
nombre que le pongas, y el resto de la app no necesita ningún otro cambio:
todo el proyecto llama siempre a `generateScene()`, nunca al proveedor directo.

## La Llave Versisi

`lib/access-keys.ts` y la tabla `access_keys` del esquema son el control de
acceso entre dos personas: cada solicitud aprobada y cada match emiten una
llave. Bloquear a alguien (`/api/blocks`) revoca esas llaves al instante.
Es la base para, más adelante, agregar links de un solo uso o con vencimiento.

## Qué falta para lanzar a producción real (no incluido aquí, a propósito)

- Términos, Política de Privacidad y Consentimiento de fotos con texto legal
  real (revisado por un abogado).
- Verificación de edad con documento + selfie en vivo (hoy solo hay una
  casilla de "tengo 18 años", que es aceptable para probar, no para lanzar
  público).
- Filtro automático de contenido sexual en las fotos subidas.
- Feed con filtros de Plus y cobros (el código ya está listo pero apagado
  detrás de `BILLING_ENABLED=false`).
- Previsualización Open Graph al compartir el link en redes.

Todo esto está descrito en detalle en `versisi-prompt-maestro-v4.md`, por si
más adelante decides terminarlo con Claude Code u otra herramienta similar:
este proyecto es exactamente el punto de partida de la Fase 1 de ese prompt.
