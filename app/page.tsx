import Link from 'next/link';

export default function Page() {
  return (
    <div className="site">
      <section className="hero">
        <div className="blob blob--hero-a" />
        <div className="blob blob--hero-b" />
        <div className="blob blob--hero-c" />
        <div className="site-wrap">
          <nav className="hero-nav">
            <Link href="/" aria-label="Offcut-to-Order home" style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none', color: 'var(--ink)' }}>
              <img src="/logo/offcut-mark.svg" alt="" width={40} height={40} style={{ display: 'block' }} />
              <span style={{ fontFamily: 'var(--f-display)', textTransform: 'uppercase', fontSize: 22, letterSpacing: '-.005em' }}>Offcut-to-Order</span>
            </Link>
            <div className="hero-nav-links">
              <a href="#how">How it works</a>
              <Link href="/app">Marketplace</Link>
              <Link href="/about">About</Link>
              <Link href="/app" className="btn btn--dark">List an offcut</Link>
            </div>
          </nav>
          <div className="hero-grid">
            <div>
              <span className="hero-badge">Timber offcut exchange</span>
              <h1>Your offcut is someone&rsquo;s next job.</h1>
              <p className="lede">Tell us the panels you need to cut. We find a nearby workshop&rsquo;s leftover timber that fits, kerf included, before it goes to landfill.</p>
              <div className="hero-ctas">
                <Link href="/app" className="btn btn--dark btn--lg">Find an offcut that fits</Link>
                <Link href="/app" className="btn btn--secondary btn--lg">List your offcuts</Link>
              </div>
              <span className="hero-reassure">BUILT FOR CLIMATE HACK-TION · DEMO DATA IN THE PILOT WORKSPACE</span>
            </div>
            <div className="hero-visual">
              <div className="hero-tag">
                <div className="hero-tag-body">
                  <span className="hero-tag-hole" />
                  <span className="hero-tag-name">Spotted Gum</span>
                  <span className="hero-tag-meta">Canal Street Joinery &middot; Marrickville</span>
                  <div style={{ borderTop: '1.5px dashed var(--tborder)' }} />
                  <span className="hero-tag-dim">800 &times; 450</span>
                  <span className="hero-tag-flag">Otherwise landfill-bound</span>
                </div>
              </div>
              <div className="hero-result">
                <div className="stamp stamp--ok"><b>Fits</b><small>2 / 2 PANELS</small></div>
                <div className="hero-result-job">Your job<strong>2 &times; display panels &middot; 400 &times; 400 &middot; kerf 3</strong></div>
                <svg viewBox="0 0 320 170" role="img" aria-label="Two 398 by 400 millimetre panels fitting an 800 by 450 offcut">
                  <rect x="0" y="0" width="320" height="150" fill="var(--surface)" stroke="var(--ink)" strokeWidth="2" />
                  <line x1="160" y1="0" x2="160" y2="150" stroke="var(--ink)" strokeWidth="2" />
                  <rect x="0" y="0" width="320" height="150" fill="none" stroke="var(--hatch)" />
                  <text x="80" y="78" textAnchor="middle" style={{ fill: 'var(--ink)', fontFamily: 'var(--f-label)', fontSize: 12, textTransform: 'uppercase' }}>A1</text>
                  <text x="240" y="78" textAnchor="middle" style={{ fill: 'var(--ink)', fontFamily: 'var(--f-label)', fontSize: 12, textTransform: 'uppercase' }}>A2</text>
                  <text x="80" y="96" textAnchor="middle" style={{ fill: 'var(--tmuted)', fontFamily: 'var(--f-mono)', fontSize: 11 }}>398 &times; 400</text>
                  <text x="240" y="96" textAnchor="middle" style={{ fill: 'var(--tmuted)', fontFamily: 'var(--f-mono)', fontSize: 11 }}>398 &times; 400</text>
                  <rect x="0" y="155" width="320" height="15" fill="var(--hatch)" opacity="0.3" />
                </svg>
                <div className="hero-result-footer">
                  <span>YIELD <b style={{ fontWeight: 600 }}>88.4%</b> &middot; 2.4 KM AWAY</span>
                  <strong>Reserve &rarr;</strong>
                </div>
              </div>
            </div>
          </div>
          <div className="proof-row">
            <div><strong>7</strong><span>Offcuts listed in the pilot</span></div>
            <div><strong>3</strong><span>Matching offcuts found by the engine</span></div>
            <div><strong>88.4%</strong><span>Panel utilisation on the demo match</span></div>
          </div>
        </div>
      </section>

      <section id="how" className="site-wrap how-section">
        <div>
          <p className="eyebrow">How it works</p>
          <h2 style={{ maxWidth: '18ch' }}>Three steps from the corner pile to the cutting list.</h2>
        </div>
        <div className="how-cards">
          <div className="step-card">
            <b>01</b>
            <strong>List</strong>
            <p>Snap the species, measure the clean rectangle, done. Under two minutes.</p>
          </div>
          <div className="step-card">
            <b>02</b>
            <strong>Match</strong>
            <p>Enter the panels you need. We test every nearby offcut against them, saw kerf and rotation included.</p>
          </div>
          <div className="step-card">
            <b>03</b>
            <strong>Reserve</strong>
            <p>Hold the piece, pick it up down the road. One less sheet bought new.</p>
          </div>
        </div>
      </section>

      <section className="cta-band">
        <div className="site-wrap" style={{ position: 'relative', zIndex: 1 }}>
          <h2>Got offcuts in the corner?</h2>
          <p>List them once. We&rsquo;ll tell you when a job nearby needs exactly that piece.</p>
          <Link href="/app" className="btn btn--primary btn--lg">List an offcut</Link>
          <div className="cta-footline">
            <span>OFFCUT-TO-ORDER &middot; BUILT FOR GREEN INDUSTRIALIZATION &amp; ZERO WASTE</span>
            <span>CO&#8322;e FIGURES ARE SCENARIO ESTIMATES &middot; NO METHANE CLAIMS</span>
          </div>
        </div>
      </section>
    </div>
  );
}
