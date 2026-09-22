import { supabaseAdmin } from './supabase-server';

// Tope de gasto diario en generación. Si se supera, la generación se pausa
// hasta el día siguiente (lista de espera en vez de seguir generando).
export async function canSpendToday() {
  const budget = Number(process.env.DAILY_GENERATION_BUDGET_USD || '5') * 100;
  const admin = supabaseAdmin();
  const today = new Date().toISOString().slice(0, 10);
  const { data } = await admin.from('generation_spend').select('cents_spent').eq('day', today).single();
  const spent = data?.cents_spent || 0;
  return spent < budget;
}

export async function recordSpend(cents: number) {
  const admin = supabaseAdmin();
  const today = new Date().toISOString().slice(0, 10);
  const { data } = await admin.from('generation_spend').select('cents_spent').eq('day', today).single();
  if (data) {
    await admin.from('generation_spend').update({ cents_spent: data.cents_spent + cents }).eq('day', today);
  } else {
    await admin.from('generation_spend').insert({ day: today, cents_spent: cents });
  }
}
