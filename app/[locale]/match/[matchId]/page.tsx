'use client';
import { useEffect, useState, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { supabaseBrowser } from '@/lib/supabase-browser';

export default function MatchChat({ params }: { params: { matchId: string } }) {
  const t = useTranslations('match');
  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState('');
  const [userId, setUserId] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    (async () => {
      const supabase = supabaseBrowser();
      const { data: { user } } = await supabase.auth.getUser();
      setUserId(user?.id || '');

      const { data } = await supabase.from('messages').select('*').eq('match_id', params.matchId).order('created_at');
      setMessages(data || []);

      const channel = supabase
        .channel(`match-${params.matchId}`)
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `match_id=eq.${params.matchId}` },
          (payload) => setMessages((m) => [...m, payload.new]))
        .subscribe();
      return () => { supabase.removeChannel(channel); };
    })();
  }, [params.matchId]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  async function send() {
    if (!text.trim()) return;
    const supabase = supabaseBrowser();
    const { data: { session } } = await supabase.auth.getSession();
    await fetch(`/api/match/${params.matchId}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session?.access_token}` },
      body: JSON.stringify({ body: text }),
    });
    setText('');
  }

  return (
    <div className="max-w-xl mx-auto px-5 py-12">
      <h2 className="text-3xl font-extrabold text-center mb-2">{t('title')}</h2>
      <p className="text-muted text-center mb-8">{t('gameOver')}</p>
      <div className="card">
        <div className="h-72 overflow-auto flex flex-col gap-2 mb-3">
          {messages.map((m) => (
            <div key={m.id} className={`max-w-[80%] px-4 py-2 rounded-2xl ${m.sender_id === userId ? 'self-end bg-coral text-ink rounded-br-sm' : 'bg-bg rounded-bl-sm'}`}>
              {m.body}
            </div>
          ))}
          <div ref={bottomRef} />
        </div>
        <div className="flex gap-2">
          <input className="input" placeholder={t('chatPh')} value={text}
                 onChange={(e) => setText(e.target.value)}
                 onKeyDown={(e) => e.key === 'Enter' && send()} />
          <button className="btn btn-primary" onClick={send}>{t('send')}</button>
        </div>
      </div>
    </div>
  );
}
