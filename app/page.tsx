import Link from 'next/link';

export default function Page() {
  return (
    <div className="site">
      <section className="hero hero--landing">
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
              <Link href="/app?tab=materials">Marketplace</Link>
              <Link href="/about">About</Link>
              <Link href="/app">Sign in</Link>
              <Link href="/app?tab=materials" className="btn btn--dark">List an offcut</Link>
            </div>
          </nav>
          <div className="hero-grid">
            <div className="hero-text">
              <span className="hero-badge">Timber offcut exchange</span>
              <h1>Your offcut is someone&rsquo;s next job.</h1>
              <p className="lede">Tell us the panels you need to cut. We find a nearby workshop&rsquo;s leftover timber that fits, kerf included, before it goes to landfill.</p>
              <div className="hero-ctas">
                <Link href="/app" className="btn btn--dark btn--lg">Find an offcut that fits</Link>
                <Link href="/app?tab=materials" className="btn btn--secondary btn--lg">List your offcuts</Link>
              </div>
              <span className="hero-reassure">FREE DURING PILOT &middot; LISTING TAKES 2 MIN</span>
            </div>
            <div className="hero-visual">
              <div className="hero-tag">
                <span className="hero-tag-pin" />
                <div className="hero-tag-body">
                  <span className="hero-tag-hole" />
                  <span className="hero-tag-name">Spotted Gum</span>
                  <span className="hero-tag-meta">Hollow Log Joinery &middot; Brunswick</span>
                  <div style={{ borderTop: '1.5px dashed var(--tborder)' }} />
                  <span className="hero-tag-dim">1200 &times; 600</span>
                  <span className="hero-tag-flag">Otherwise landfill-bound</span>
                </div>
              </div>
              <div className="hero-result">
                <div className="stamp stamp--ok"><b>Fits</b><small>2 / 2 PANELS</small></div>
                <div className="hero-result-job">Your job<strong>2 &times; cabinet doors &middot; 550 &times; 400 &middot; kerf 3</strong></div>
                <svg viewBox="0 0 380 210" role="img" aria-label="Two 550 by 400 millimetre doors fitting a 1200 by 600 offcut with 0.28 square metres waste">
                  <line x1="18" y1="18" x2="362" y2="18" stroke="var(--ink)" strokeWidth="1.3" />
                  <path d="M18 14 L18 22 M362 14 L362 22" stroke="var(--ink)" strokeWidth="1.3" />
                  <text x="190" y="13" textAnchor="middle" style={{ fill: 'var(--tmuted)', fontFamily: 'var(--f-mono)', fontSize: 10 }}>1200 mm</text>
                  <line x1="10" y1="28" x2="10" y2="182" stroke="var(--ink)" strokeWidth="1.3" />
                  <path d="M6 28 L14 28 M6 182 L14 182" stroke="var(--ink)" strokeWidth="1.3" />
                  <rect x="28" y="28" width="332" height="154" fill="var(--surface)" stroke="var(--ink)" strokeWidth="2" />
                  <rect x="28" y="28" width="150" height="154" fill="var(--surface)" stroke="var(--ink)" strokeWidth="1.5" />
                  <rect x="178" y="28" width="150" height="154" fill="var(--surface)" stroke="var(--ink)" strokeWidth="1.5" />
                  <rect x="328" y="28" width="32" height="154" fill="var(--hatch)" opacity="0.35" />
                  <line x1="178" y1="28" x2="178" y2="182" stroke="var(--a7)" strokeWidth="2" strokeDasharray="2 5" />
                  <text x="103" y="100" textAnchor="middle" style={{ fill: 'var(--ink)', fontFamily: 'var(--f-label)', fontSize: 12, fontWeight: 600, textTransform: 'uppercase' }}>Door A</text>
                  <text x="103" y="118" textAnchor="middle" style={{ fill: 'var(--tmuted)', fontFamily: 'var(--f-mono)', fontSize: 11 }}>550 &times; 400</text>
                  <text x="253" y="100" textAnchor="middle" style={{ fill: 'var(--ink)', fontFamily: 'var(--f-label)', fontSize: 12, fontWeight: 600, textTransform: 'uppercase' }}>Door B</text>
                  <text x="253" y="118" textAnchor="middle" style={{ fill: 'var(--tmuted)', fontFamily: 'var(--f-mono)', fontSize: 11 }}>550 &times; 400</text>
                  <text x="34" y="176" style={{ fill: 'var(--ink)', fontFamily: 'var(--f-mono)', fontSize: 9 }}>WASTE 0.28 M&#178;</text>
                </svg>
                <div className="hero-result-footer">
                  <span>YIELD <b style={{ fontWeight: 600 }}>61%</b> &middot; 2.4 KM AWAY</span>
                  <strong>Reserve &rarr;</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="site-wrap proof-wrap">
        <div className="proof-row">
          <div><strong>412 kg</strong><span>Timber kept out of landfill</span></div>
          <div><strong>48</strong><span>Offcuts listed in the pilot</span></div>
          <div><strong>18.6 m&sup2;</strong><span>Matched to real jobs</span></div>
        </div>
      </section>

      <section id="how" className="site-wrap how-section">
        <div className="how-intro">
          <p className="eyebrow">How it works</p>
          <h2>Three steps from the corner pile to the cutting list.</h2>
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
        <span className="watermark" aria-hidden="true" />
        <div className="site-wrap" style={{ position: 'relative', zIndex: 1 }}>
          <h2>Got offcuts in the corner?</h2>
          <p>List them once. We&rsquo;ll tell you when a job nearby needs exactly that piece.</p>
          <Link href="/app?tab=materials" className="btn btn--primary btn--lg">List an offcut</Link>
          <div className="cta-footline">
            <span>OFFCUT-TO-ORDER &middot; BUILT FOR GREEN INDUSTRIALIZATION &amp; ZERO WASTE</span>
            <span>CO&#8322;e FIGURES ARE SCENARIO ESTIMATES &middot; NO METHANE CLAIMS</span>
          </div>
        </div>
      </section>
    </div>
  );
}
