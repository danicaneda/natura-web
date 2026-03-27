// Transición SVG ondulada entre secciones
// Uso: <SectionWave from="#FAF6EE" to="#F5EDD8" />

export default function SectionWave({
  from,
  to,
  flip = false,
  variant = 0,
}: {
  from: string;
  to: string;
  flip?: boolean;
  variant?: 0 | 1 | 2;
}) {
  const paths = [
    // Suave doble ola
    'M0,32 C180,80 360,0 540,40 C720,80 900,20 1080,48 C1260,76 1350,32 1440,40 L1440,80 L0,80 Z',
    // Ola única más pronunciada
    'M0,48 C240,96 480,0 720,48 C960,96 1200,16 1440,48 L1440,80 L0,80 Z',
    // Curva botánica asimétrica
    'M0,64 C120,20 320,72 560,40 C800,8 1040,64 1280,32 C1360,16 1400,48 1440,40 L1440,80 L0,80 Z',
  ];

  return (
    <div
      aria-hidden="true"
      style={{
        display: 'block',
        background: from,
        lineHeight: 0,
        marginBottom: '-1px',
        transform: flip ? 'scaleX(-1)' : 'none',
      }}
    >
      <svg
        viewBox="0 0 1440 80"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        style={{ display: 'block', width: '100%', height: '56px' }}
      >
        <path d={paths[variant]} fill={to} />
      </svg>
    </div>
  );
}
