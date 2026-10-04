'use client';

import { useState } from 'react';
import Link from 'next/link';

const team = [
  {
    name: 'Kai',
    role: 'Product design & prototype development',
    contribution: 'Timber Yard design system, product design and cutting-plan UI.',
    github: 'https://github.com/KaiCryan',
    linkedin: null,
    portfolio: null,
    photo: '/team/kai.jpg',
    degree: 'Major. Software Technology',
  },
  {
    name: 'Shah',
    role: 'Prototype engineering & video narration',
    contribution: 'Cutting-plan engine and shared exchange backend.',
    github: 'https://github.com/shahnoormostafa-coder',
    linkedin: 'https://www.linkedin.com/in/shah-noor-mostafa-bhuiyan-a42b8134a/',
    portfolio: null,
    photo: '/team/shah.jpg',
    degree: 'Bachelor of Information Technology (Cybersecurity & BIS) · Macquarie University',
  },
  {
    name: 'Jaycee',
    role: 'Project description & prototype ideation',
    contribution: null,
    github: 'https://github.com/jayceemaimia-debug',
    linkedin: 'https://www.linkedin.com/in/mai-phuong-le19102006/',
    portfolio: null,
    photo: '/team/jaycee.jpg',
    degree: 'International Relations & Political Science · Victoria University of Wellington',
  },
  {
    name: 'Tasfia',
    role: 'Punchline & prototype support',
    contribution: null,
    github: 'https://github.com/tasfiadija1',
    linkedin: null,
    portfolio: null,
    photo: null,
    degree: 'Bachelor of Computer Engineering (Software) · University of Sydney',
  },
  {
    name: 'Shelly',
    role: 'Presentation design & prototype ideation',
    contribution: null,
    github: 'https://github.com/ui-ue',
    linkedin: 'https://www.linkedin.com/in/shell3y/',
    portfolio: null,
    photo: '/team/shelly.jpg',
    degree: 'Bachelor of Engineering/Science (Honours) · Macquarie University',
  },
];

const roles = ['Judge', 'Workshop owner', 'Maker / buyer', 'Other'];
const scores = [1, 2, 3, 4, 5];

function FeedbackForm() {
  const [role, setRole] = useState('Judge');
  const [score, setScore] = useState(4);
  const [sent, setSent] = useState(false);

  if (sent) {
    return (
      <div className="about-feedback-preview">
        <div className="stamp stamp--ok"><b>Thanks!</b></div>
        <h3>Preview only</h3>
        <p>This form is not connected. Your response was not sent or stored.</p>
        <button className="about-text-button" type="button" onClick={() => setSent(false)}>Try again</button>
      </div>
    );
  }

  return (
    <form className="about-feedback-form" onSubmit={(event) => { event.preventDefault(); setSent(true); }}>
      <fieldset>
        <legend>I&rsquo;m a&hellip;</legend>
        <div className="role-toggle">
          {roles.map((item) => (
            <button key={item} className="role-pill" type="button" aria-pressed={role === item} onClick={() => setRole(item)}>{item}</button>
          ))}
        </div>
      </fieldset>
      <fieldset>
        <legend>How useful would this be? (1&ndash;5)</legend>
        <div className="rating-row">
          {scores.map((item) => (
            <button key={item} className="rating-dot" type="button" aria-pressed={score === item} onClick={() => setScore(item)}>{item}</button>
          ))}
        </div>
      </fieldset>
      <label className="about-form-label">What would make it better?
        <textarea rows={4} maxLength={500} placeholder="The bit that confused you, the feature you’d need, anything." />
      </label>
      <label className="about-form-label">Email (optional, preview only)
        <input type="email" placeholder="Not collected by this preview" />
      </label>
      <div className="about-form-actions">
        <button type="submit" className="btn btn--primary">Send feedback</button>
        <span className="mono">NO ACCOUNT NEEDED · PREVIEW ONLY</span>
      </div>
    </form>
  );
}

export default function Page() {
  return (
    <div className="site about-page">
      <section className="hero about-hero">
        <div className="blob blob--hero-a" />
        <div className="blob blob--hero-c" />
        <div className="site-wrap">
          <nav className="hero-nav" aria-label="Main navigation">
            <Link href="/" aria-label="Offcut-to-Order home" className="about-brand">
              <img src="/logo/offcut-mark.svg" alt="" width={44} height={44} />
              <span>Offcut-to-Order</span>
            </Link>
            <div className="hero-nav-links">
              <Link href="/#how">How it works</Link>
              <Link href="/app?tab=materials">Marketplace</Link>
              <Link href="/about" aria-current="page">About</Link>
              <Link href="/app">Sign in</Link>
              <Link href="/app?tab=materials" className="btn btn--dark">List an offcut</Link>
            </div>
          </nav>
          <div className="hero-grid about-hero-grid">
            <div className="about-hero-copy">
              <span className="hero-badge">About the team</span>
              <h1>The people behind the offcuts.</h1>
              <p className="lede">Offcut-to-Order is a student entry for Climate Hack-tion 2026. Here&rsquo;s who built it, and how to reach us.</p>
              <div className="hero-ctas">
                <a href="#contact" className="btn btn--dark btn--lg">Contact us</a>
                <a href="#feedback" className="btn btn--secondary btn--lg">Leave feedback</a>
              </div>
            </div>
            <div className="about-competition-wrap">
              <span className="about-string" />
              <div className="about-competition-card">
                <span className="hero-tag-hole" />
                <span className="about-card-eyebrow">Entered in</span>
                <strong>Climate Hack-tion 2026</strong>
                <span className="about-rule" />
                <span className="hero-tag-pill">Green Industrialization</span>
                <span className="hero-tag-pill hero-tag-pill--fill">Zero Waste &amp; Methane Reduction</span>
                <span className="about-placeholder">[University placeholder] · [City placeholder]</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="about-team-section">
        <div className="about-section-intro">
          <span className="eyebrow">The team</span>
          <h2>Who built it</h2>
        </div>
        <div className="about-team-grid">
          {team.map((member) => (
            <article className="about-person" key={member.name}>
              <div className="about-team-card">
                <span className="about-card-hole" />
                {member.photo ? (
                  <div className="about-photo-placeholder">
                    <img src={member.photo} alt={member.name} width={480} height={480} />
                  </div>
                ) : (
                  <div className="about-photo-placeholder" role="img" aria-label={`Photo placeholder for ${member.name}`}>
                    <span>Photo<br />placeholder</span>
                  </div>
                )}
                <div className="about-person-copy">
                  <h3>{member.name}</h3>
                  <span className="about-person-role">{member.role}</span>
                  <span className="about-placeholder">{member.degree ?? '[Degree · University placeholder]'}</span>
                </div>
                {member.contribution && <p className="about-contribution">{member.contribution}</p>}
                <div className="about-person-links">
                  <a className="about-profile-link" href={member.github} target="_blank" rel="noreferrer">GitHub ↗</a>
                  {member.linkedin && <a className="about-profile-link" href={member.linkedin} target="_blank" rel="noreferrer">LinkedIn ↗</a>}
                  {member.portfolio && <a className="about-profile-link" href={member.portfolio} target="_blank" rel="noreferrer">Portfolio ↗</a>}
                </div>
              </div>
              <span className="about-person-string" />
            </article>
          ))}
        </div>
      </section>

      <section id="contact" className="about-contact-section">
        <div className="about-contact-card">
          <div className="about-contact-copy">
            <span className="eyebrow">Contact</span>
            <h2>Get in touch</h2>
            <p>Judges, workshops, sponsors or anyone with a pile of offcuts: we reply within two days.</p>
          </div>
          <div className="about-contact-actions">
            <a className="about-email-link" href="mailto:kaithecryan@gmail.com"><span>Contact the team</span><strong>kaithecryan@gmail.com</strong></a>
            <div className="about-contact-links">
              <a className="btn btn--secondary" href="https://github.com/climate-hacktion-2026/offcut-to-order" target="_blank" rel="noreferrer">GitHub repo ↗</a>
              <span className="about-profile-placeholder">Pitch deck · placeholder</span>
            </div>
          </div>
        </div>
      </section>

      <section id="feedback" className="about-feedback-section">
        <div className="about-feedback-copy">
          <span className="eyebrow">Feedback</span>
          <h2>Tell us what you think</h2>
          <p>Three questions, one minute. This feedback form is a preview and does not send or store responses.</p>
        </div>
        <FeedbackForm />
      </section>

      <footer className="cta-band about-footer">
        <span className="watermark" aria-hidden="true" />
        <div className="site-wrap about-footer-inner">
          <div className="about-footer-brand">
            <img src="/logo/offcut-mark-lime.svg" alt="" width={48} height={48} />
            <span>Offcut-to-Order</span>
          </div>
          <div className="about-footer-disclosure">
            <span>A STUDENT PROJECT · CLIMATE HACK-TION 2026</span>
            <span>CO₂e FIGURES ARE SCENARIO ESTIMATES · NO METHANE CLAIMS</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
