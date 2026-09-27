// Escenas de ejemplo dibujadas a mano en SVG. No usan fotos reales de nadie:
// son siluetas abstractas para mostrar, antes de que alguien juegue, qué tipo
// de ilustración genera Versisi. Esto es lo primero que ve un visitante.

function Vacation({ uid }: { uid: string }) {
  return (
    <svg viewBox="0 0 400 480" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Ilustración de ejemplo: vacaciones">
      <defs>
        <linearGradient id={`${uid}sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#7DD3FC" />
          <stop offset="1" stopColor="#FDE7A0" />
        </linearGradient>
        <linearGradient id={`${uid}a`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#FF6B6B" /><stop offset="1" stopColor="#FFB84D" />
        </linearGradient>
        <linearGradient id={`${uid}b`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#2DD4BF" /><stop offset="1" stopColor="#8B7BFF" />
        </linearGradient>
      </defs>
      <rect width="400" height="480" fill={`url(#${uid}sky)`} />
      <circle cx="320" cy="90" r="42" fill="#FFB84D" />
      <rect y="300" width="400" height="110" fill="#2DD4BF" opacity=".85" />
      <rect y="405" width="400" height="75" fill="#F3D9A4" />
      <path d="M62 425 Q78 335 60 250" stroke="#8B5E3C" strokeWidth="10" fill="none" strokeLinecap="round" />
      <path d="M60 250 Q22 218 -6 252 Q30 236 60 250Z M60 250 Q40 210 70 190 Q68 222 60 250Z M60 250 Q100 220 122 246 Q90 240 60 250Z" fill="#2F9E6B" />
      <circle cx="150" cy="262" r="40" fill={`url(#${uid}a)`} />
      <rect x="118" y="292" width="64" height="130" rx="30" fill="#FF6B6B" />
      <circle cx="250" cy="262" r="40" fill={`url(#${uid}b)`} />
      <rect x="218" y="292" width="64" height="130" rx="30" fill="#2D2140" />
      <path d="M182 352 L218 352" stroke="#FFD9B0" strokeWidth="10" strokeLinecap="round" />
    </svg>
  );
}

function Wedding({ uid }: { uid: string }) {
  const arch = [];
  for (let i = 0; i <= 12; i++) {
    const an = Math.PI * (i / 12);
    arch.push(
      <circle key={i} cx={200 - 130 * Math.cos(an)} cy={220 - 130 * Math.sin(an)} r="9"
        fill={i % 2 ? '#FF6B6B' : '#FFB84D'} />
    );
  }
  return (
    <svg viewBox="0 0 400 480" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Ilustración de ejemplo: boda">
      <defs>
        <linearGradient id={`${uid}a`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#FF6B6B" /><stop offset="1" stopColor="#FFB84D" />
        </linearGradient>
        <linearGradient id={`${uid}b`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#2DD4BF" /><stop offset="1" stopColor="#8B7BFF" />
        </linearGradient>
      </defs>
      <rect width="400" height="480" fill="#2D2140" />
      <path d="M70 430 L70 220 A130 130 0 0 1 330 220 L330 430" stroke="#493768" strokeWidth="14" fill="none" />
      {arch}
      <rect y="430" width="400" height="50" fill="#221830" />
      <circle cx="150" cy="270" r="42" fill={`url(#${uid}a)`} />
      <path d="M150 300 L88 442 L212 442Z" fill="#FBF7FF" opacity=".92" />
      <circle cx="250" cy="270" r="42" fill={`url(#${uid}b)`} />
      <rect x="220" y="296" width="60" height="146" rx="14" fill="#191229" />
      <path d="M238 296 L262 296 L250 350Z" fill="#FBF7FF" />
    </svg>
  );
}

function OldAge({ uid }: { uid: string }) {
  return (
    <svg viewBox="0 0 400 480" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Ilustración de ejemplo: vejez">
      <defs>
        <linearGradient id={`${uid}dusk`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#8B7BFF" /><stop offset="1" stopColor="#FFB84D" />
        </linearGradient>
        <linearGradient id={`${uid}a`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#FF6B6B" /><stop offset="1" stopColor="#FFB84D" />
        </linearGradient>
        <linearGradient id={`${uid}b`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#2DD4BF" /><stop offset="1" stopColor="#8B7BFF" />
        </linearGradient>
      </defs>
      <rect width="400" height="480" fill={`url(#${uid}dusk)`} />
      <circle cx="200" cy="300" r="76" fill="#FFD27A" opacity=".8" />
      <path d="M0 340 Q120 280 240 340 T400 320 V480 H0Z" fill="#2D2140" />
      <rect x="90" y="326" width="220" height="12" rx="6" fill="#493768" />
      <circle cx="155" cy="290" r="34" fill={`url(#${uid}a)`} />
      <rect x="124" y="316" width="62" height="86" rx="28" fill="#FF6B6B" />
      <circle cx="245" cy="290" r="34" fill={`url(#${uid}b)`} />
      <rect x="214" y="316" width="62" height="86" rx="28" fill="#2D2140" />
      <rect x="90" y="392" width="220" height="16" rx="6" fill="#493768" />
    </svg>
  );
}

const SCENES = [
  { Comp: Vacation, uid: 'v1', label: { es: 'Vacaciones', en: 'Vacation' } },
  { Comp: Wedding, uid: 'v2', label: { es: 'Boda', en: 'Wedding' } },
  { Comp: OldAge, uid: 'v3', label: { es: 'Vejez', en: 'Old age' } },
];

export default function SampleScenes({ locale }: { locale: string }) {
  return (
    <div className="flex items-start justify-center gap-3 sm:gap-4" aria-hidden="false">
      {SCENES.map(({ Comp, uid, label }, i) => (
        <div
          key={uid}
          className="w-[30%] bg-surface border-[3px] border-ink rounded-2xl p-1.5 pb-2"
          style={{
            transform: `rotate(${i === 0 ? -4 : i === 1 ? 1.5 : -2}deg) translateY(${i === 1 ? 0 : 14}px)`,
            boxShadow: '5px 5px 0 #0000004a',
          }}
        >
          <div className="rounded-md overflow-hidden"><Comp uid={uid} /></div>
          <p className="text-center font-display font-bold text-sm mt-1.5">
            {locale === 'en' ? label.en : label.es}
          </p>
        </div>
      ))}
    </div>
  );
}
