/**
 * Generador de escenas — módulo intercambiable.
 *
 * Hoy (IMAGE_GEN_PROVIDER=stub) devuelve una ilustración dibujada con SVG en
 * el propio servidor, sin llamar a ninguna IA. Sirve para probar el flujo
 * completo (aprobar → generar → decidir → match) sin gastar nada.
 *
 * Cuando tengas una clave de una API de edición de imágenes con dos fotos de
 * entrada, cambia IMAGE_GEN_PROVIDER en .env y completa la función
 * generateWithRealProvider(). El resto de la app no cambia: siempre llama a
 * generateScene(), sin importar qué proveedor esté detrás.
 */

export type SceneKey = 'vac' | 'wed' | 'old';
export const SCENE_KEYS: SceneKey[] = ['vac', 'wed', 'old'];

const SCENE_PROMPTS: Record<SceneKey, string> = {
  vac: 'The two people together on a sunny beach vacation, smiling, casual summer clothes, warm golden light, illustrated style.',
  wed: 'The two people together on their wedding day, festive decoration, celebratory mood, illustrated style.',
  old: 'The two people together much older, grey hair, sitting on a porch at sunset, warm and calm mood, illustrated style.',
};

export async function generateScene(
  photoAUrl: string,
  photoBUrl: string,
  sceneKey: SceneKey
): Promise<{ imageUrl: string; costCents: number }> {
  const provider = process.env.IMAGE_GEN_PROVIDER || 'stub';

  if (provider === 'stub') {
    return generateStubScene(sceneKey);
  }

  return generateWithRealProvider(photoAUrl, photoBUrl, sceneKey);
}

function generateStubScene(sceneKey: SceneKey) {
  // Placeholder simple para poder probar el flujo sin costo.
  const colors: Record<SceneKey, string> = { vac: '7DD3FC', wed: 'FFE4EA', old: 'B39DDB' };
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 480">
    <rect width="400" height="480" fill="#${colors[sceneKey]}"/>
    <text x="200" y="240" font-family="sans-serif" font-size="22" fill="#1B1740" text-anchor="middle">
      Escena: ${sceneKey.toUpperCase()} (placeholder)
    </text>
  </svg>`;
  const dataUrl = 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
  return { imageUrl: dataUrl, costCents: 0 };
}

async function generateWithRealProvider(
  photoAUrl: string,
  photoBUrl: string,
  sceneKey: SceneKey
): Promise<{ imageUrl: string; costCents: number }> {
  // TODO: reemplaza este bloque por la llamada real a la API que elijas
  // (por ejemplo una API de edición de imágenes que acepte dos imágenes de
  // entrada más un prompt de texto). Debe:
  //  1. Enviar photoAUrl, photoBUrl y SCENE_PROMPTS[sceneKey].
  //  2. Subir la imagen resultante al storage privado de Supabase.
  //  3. Devolver la URL firmada de esa imagen y el costo real en centavos.
  throw new Error(
    `IMAGE_GEN_PROVIDER="${process.env.IMAGE_GEN_PROVIDER}" todavía no está implementado en lib/generator.ts`
  );
}
