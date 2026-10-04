'use client';
import { useState } from 'react';
import Link from 'next/link';

const team = [
  { name: 'Kai', role: 'Design & build', meta: 'Design & Development', note: 'Timber Yard design system, product design, cutting-plan UI.' },
  { name: 'Shah Noor Mostafa', role: 'Engineering', meta: 'Engineering', note: 'Cutting-plan engine, shared exchange backend.' },
  { name: 'Jaycee', role: 'Contributor', meta: 'Role pending', note: 'Role pending confirmation.' },
];

const roles = ['Judge', 'Workshop owner', 'Maker / buyer', 'Other'];

function FeedbackForm() {
  const [role, setRole] = useState<string | null>(null);
  const [rating, setRating] = useState<number | null>(null);
  const [note, setNote] = useState('');
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  if (sent) {
    return (
      <div className="feedback-thanks">
        <div className="stamp stamp--ok"><b>Thanks!</b></div>
        <p style={{ color: 'var(--tmuted)', fontSize: 14, maxWidth: 260 }}>Every answer shapes the next build. We read all of them.</p>
      </div>
    );
  }

  return (
    <form
      className="evidence-card"
      style={{ display: 'grid', gap: 18 }}
      onSubmit={(e) => { e.preventDefault(); setSent(true); }}
    >
      <div>
        <p className="field-label" style={{ margin: '0 0 8px' }}>I&rsquo;m a&hellip;</p>
        <div className="role-toggle">
          {roles.map((r) => (
            <button type="button" key={r} className="role-pill" aria-pressed={role === r} onClick={() => setRole(r)}>{r}</button>
          ))}
        </div>
      </div>
      <div>
        <p className="field-label" style={{ margin: '0 0 8px' }}>How useful would this be? (1&ndash;5)</p>
        <div className="rating-row">
          {[1, 2, 3, 4, 5].map((n) => (
            <button type="button" key={n} className="rating-dot" aria-pressed={rating === n} onClick={() => setRating(n)}>{n}</button>
          ))}
        </div>
      </div>
      <label className="num-field">What would make it better?
        <textarea rows={3} maxLength={500} value={note} placeholder="The bit that confused you, the feature you'd need, anything." onChange={(e) => setNote(e.target.value)} />
      </label>
      <label className="num-field">Email (optional)
        <input type="email" value={email} placeholder="So we can follow up" onChange={(e) => setEmail(e.target.value)} />
      </label>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <button type="submit" className="btn btn--primary" disabled={!role || !rating}>Send feedback</button>
        <span className="mono" style={{ fontSize: 11, color: 'var(--tmuted)' }}>No account needed</span>
      </div>
    </form>
  );
}

export default function Page() {
  return (
    <div className="site">
      <section className="hero" style={{ paddingBottom: 96 }}>
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
              <Link href="/app">Sign in</Link>
              <Link href="/app" className="btn btn--dark">List an offcut</Link>
            </div>
          </nav>
          <div className="hero-grid">
            <div className="hero-text">
              <span className="hero-badge">About the team</span>
              <h1 style={{ fontSize: 'clamp(40px,6vw,76px)' }}>The people behind the offcuts.</h1>
              <p className="lede">Offcut-to-Order is a student entry for Climate Hack-tion 2026. Here&rsquo;s who built it, and how to reach us.</p>
              <div className="hero-ctas">
                <a href="#contact" className="btn btn--dark btn--lg">Contact us</a>
                <a href="#feedback" className="btn btn--secondary btn--lg">Leave feedback</a>
              </div>
            </div>
            <div className="hero-visual" style={{ maxWidth: 320 }}>
              <div className="hero-tag" style={{ position: 'static', transform: 'rotate(3deg)', width: '100%' }}>
                <span className="hero-tag-pin" />
                <div className="hero-tag-body">
                  <span className="hero-tag-hole" />
                  <span className="hero-tag-eyebrow">Entered in</span>
                  <span className="hero-tag-name" style={{ fontSize: 28 }}>Climate Hack-tion 2026</span>
                  <div style={{ borderTop: '1.5px dashed var(--tborder)' }} />
                  <div className="hero-tag-pills">
                    <span className="hero-tag-pill">Green Industrialization</span>
                    <span className="hero-tag-pill hero-tag-pill--fill">Zero Waste &amp; Methane Reduction</span>
                  </div>
                  <span className="hero-tag-meta">EARTHSYNC TEAM &middot; AUSTRALIA</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="site-wrap" style={{ padding: '64px 0' }}>
        <p className="eyebrow">The team</p>
        <h2 style={{ marginBottom: 32 }}>Who built it</h2>
        <div className="team-grid">
          {team.map((m) => (
            <div key={m.name} className="team-card">
              <span className="hero-tag-pin" style={{ top: -22 }} />
              <div className="team-avatar">Photo</div>
              <span className="team-name">{m.name}</span>
              <span className="team-role">{m.role}</span>
              <span className="team-meta">{m.meta}</span>
              <p className="team-note">{m.note}</p>
              <div className="team-links">
                <span className="pill-link">LinkedIn &#8599;</span>
                <span className="pill-link">GitHub &#8599;</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="contact" className="site-wrap" style={{ padding: '0 0 64px' }}>
        <div className="evidence-card card--strong" style={{ maxWidth: 640, border: '2px solid var(--ink)', boxShadow: '0 5px 0 var(--ink)' }}>
          <p className="eyebrow">Contact</p>
          <h2 style={{ fontSize: 26, marginBottom: 10 }}>Get in touch</h2>
          <p className="mono" style={{ fontSize: 15 }}>Contact email pending confirmation.</p>
          <p style={{ fontSize: 13, color: 'var(--tmuted)', marginTop: 10 }}>Judges, workshops, sponsors or anyone with a pile of offcuts: we reply within two days.</p>
          <div style={{ display: 'flex', gap: 10, marginTop: 18, flexWrap: 'wrap' }}>
            <a className="btn btn--secondary" href="https://github.com/climate-hacktion-2026/offcut-to-order" target="_blank" rel="noreferrer">GitHub repo &#8599;</a>
            <Link className="btn btn--secondary" href="/app">Try the demo &#8599;</Link>
          </div>
        </div>
      </section>

      <section id="feedback" className="site-wrap" style={{ padding: '0 0 88px', display: 'grid', gridTemplateColumns: '1fr 1.3fr', gap: 40 }}>
        <div>
          <p className="eyebrow">Feedback</p>
          <h2 style={{ marginBottom: 12 }}>Tell us what you think</h2>
          <p style={{ color: 'var(--tmuted)', fontSize: 15, lineHeight: 1.7 }}>Three questions, one minute. Every answer shapes the next build, and we read all of them.</p>
        </div>
        <FeedbackForm />
      </section>

      <section className="cta-band" style={{ padding: '48px 0' }}>
        <span className="watermark" aria-hidden="true" />
        <div className="site-wrap" style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <img src="/logo/offcut-mark-lime.svg" alt="" width={28} height={28} />
            <span style={{ fontFamily: 'var(--f-display)', textTransform: 'uppercase', fontSize: 18, color: 'var(--surface)' }}>Offcut-to-Order</span>
          </span>
          <span className="mono" style={{ fontSize: 11, color: 'var(--border)' }}>A STUDENT PROJECT &middot; CLIMATE HACK-TION 2026</span>
          <span className="mono" style={{ fontSize: 11, color: 'var(--border)' }}>CO&#8322;e FIGURES ARE SCENARIO ESTIMATES &middot; NO METHANE CLAIMS</span>
        </div>
      </section>
    </div>
  );
}
