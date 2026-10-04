import Link from 'next/link';

const team = [
  { name: 'Kai', role: 'Design & build', note: 'Timber Yard design system, product design, cutting-plan UI' },
  { name: 'Shah Noor Mostafa', role: 'Engineering', note: 'Cutting-plan engine, shared exchange backend' },
  { name: 'Jaycee', role: 'Team', note: 'Climate Hack-tion 2026' },
];

export default function Page() {
  return (
    <div className="site">
      <section className="hero" style={{ paddingBottom: 72 }}>
        <div className="blob blob--hero-a" />
        <div className="blob blob--hero-c" />
        <div className="site-wrap">
          <nav className="hero-nav">
            <Link href="/" aria-label="Offcut-to-Order home" style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none', color: 'var(--ink)' }}>
              <img src="/logo/offcut-mark.svg" alt="" width={40} height={40} style={{ display: 'block' }} />
              <span style={{ fontFamily: 'var(--f-display)', textTransform: 'uppercase', fontSize: 22, letterSpacing: '-.005em' }}>Offcut-to-Order</span>
            </Link>
            <div className="hero-nav-links">
              <Link href="/#how">How it works</Link>
              <Link href="/app">Marketplace</Link>
              <Link href="/app" className="btn btn--dark">List an offcut</Link>
            </div>
          </nav>
          <div style={{ maxWidth: 720, padding: '36px 0 0' }}>
            <span className="hero-badge">Climate Hack-tion 2026</span>
            <h1 style={{ fontSize: 'clamp(40px,6vw,76px)' }}>The people behind the offcuts.</h1>
            <p className="lede">Team EarthSync, building Offcut-to-Order for Build for 2035.</p>
          </div>
        </div>
      </section>

      <section className="site-wrap" style={{ padding: '64px 0' }}>
        <p className="eyebrow">The team</p>
        <h2 style={{ marginBottom: 32 }}>Who built it</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 24 }}>
          {team.map((m, i) => (
            <div key={m.name} className="card" style={{ background: 'var(--surface)', border: '1.5px solid var(--tborder)', borderRadius: 'var(--r-tag)', padding: 24, boxShadow: '0 3px 0 var(--tborder)', transform: i % 2 ? 'rotate(.7deg)' : 'rotate(-1deg)' }}>
              <span style={{ fontFamily: 'var(--f-display)', textTransform: 'uppercase', fontSize: 26, display: 'block' }}>{m.name}</span>
              <span style={{ fontFamily: 'var(--f-label)', fontSize: 12, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--a7)', display: 'block', marginTop: 4 }}>{m.role}</span>
              <p style={{ fontSize: 13, color: 'var(--tmuted)', marginTop: 10, lineHeight: 1.6 }}>{m.note}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="site-wrap" style={{ padding: '0 0 80px' }}>
        <div className="evidence-card" style={{ maxWidth: 560 }}>
          <h2 style={{ fontSize: 22, marginBottom: 12 }}>Get in touch</h2>
          <p className="mono" style={{ fontSize: 15 }}>hello@offcut-to-order.example</p>
          <div style={{ display: 'flex', gap: 12, marginTop: 16, flexWrap: 'wrap' }}>
            <a className="btn btn--secondary" href="https://github.com/climate-hacktion-2026/offcut-to-order" target="_blank" rel="noreferrer">GitHub repo &#8599;</a>
            <Link className="btn btn--secondary" href="/app">Try the demo &#8599;</Link>
          </div>
        </div>
      </section>

      <section className="cta-band" style={{ padding: '56px 0' }}>
        <div className="site-wrap" style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <span className="mono" style={{ fontSize: 12, color: 'var(--border)' }}>OFFCUT-TO-ORDER / EARTHSYNC</span>
          <span className="mono" style={{ fontSize: 12, color: 'var(--border)' }}>BUILT FOR 2035</span>
        </div>
      </section>
    </div>
  );
}
