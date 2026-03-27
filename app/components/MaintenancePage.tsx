'use client';

interface Props {
  title: string;
  message: string;
}

export default function MaintenancePage({ title, message }: Props) {
  return (
    <div
      className="min-h-screen flex items-center justify-center px-6"
      style={{
        background: 'radial-gradient(ellipse at center, #1A1408 0%, #0A0A0A 70%)',
      }}
    >
      {/* Anillos decorativos */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[200, 350, 500].map((size, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width: size,
              height: size,
              border: '1px solid rgba(184,134,11,0.12)',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
            }}
          />
        ))}
      </div>

      <div className="relative z-10 text-center max-w-lg">
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center text-4xl mx-auto mb-8"
          style={{
            background: 'linear-gradient(135deg, rgba(184,134,11,0.15), rgba(184,134,11,0.05))',
            border: '1px solid rgba(184,134,11,0.3)',
          }}
        >
          🌿
        </div>

        <div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold tracking-widest mb-6 uppercase"
          style={{ border: '1px solid rgba(184,134,11,0.35)', color: '#D4A017', background: 'rgba(184,134,11,0.08)' }}
        >
          Mantenimiento
        </div>

        <h1
          className="text-4xl md:text-5xl font-light mb-6"
          style={{ color: '#FAF6EE', fontFamily: 'Cormorant Garamond, Georgia, serif' }}
        >
          {title}
        </h1>

        <p className="text-base leading-relaxed" style={{ color: 'rgba(250,246,238,0.65)', fontFamily: 'Jost, sans-serif', fontWeight: 300 }}>
          {message}
        </p>

        <div className="mt-10 flex items-center justify-center gap-2">
          <div
            className="w-2 h-2 rounded-full"
            style={{ background: '#D4A017', animation: 'pulse 1.5s ease-in-out infinite' }}
          />
          <div
            className="w-2 h-2 rounded-full"
            style={{ background: '#D4A017', animation: 'pulse 1.5s ease-in-out infinite 0.3s' }}
          />
          <div
            className="w-2 h-2 rounded-full"
            style={{ background: '#D4A017', animation: 'pulse 1.5s ease-in-out infinite 0.6s' }}
          />
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.2); }
        }
      `}</style>
    </div>
  );
}
