import { useState, Fragment } from 'react';
import { Link, navigate } from '../router';
import Icon from '../icons';
import { PLACES, CATEGORIES, CITIES } from '../data';
import { PlaceCard, SectionHead, Slot } from '../shared';

export function SavedPage({ auth, savedSet, onToggleSave }) {
  if (!auth.signedIn) {
    return (
      <main className="route-mount">
        <section className="wrap" style={{ padding: '32px 0 24px' }}>
          <div className="mono">Your places</div>
          <h1 className="h1" style={{ marginTop: 10 }}>Saved</h1>
        </section>
        <section className="wrap" style={{ marginBottom: 56 }}>
          <div className="card" style={{ padding: 40, textAlign: 'center', maxWidth: 540, margin: '0 auto' }}>
            <div style={{ width: 64, height: 64, borderRadius: 16, background: '#C13D2F18', color: 'var(--brand)', display: 'grid', placeItems: 'center', margin: '0 auto 16px' }}>
              <Icon.bookmark size={28}/>
            </div>
            <h2 className="h3" style={{ margin: 0 }}>Sign in to save places</h2>
            <p style={{ color: 'var(--muted)', marginTop: 8, marginBottom: 24 }}>Keep your saves across devices and sync them with the mobile app.</p>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="#/signin" className="btn btn-primary btn-lg">Sign in</Link>
              <Link to="#/map" className="btn btn-lg">Keep browsing</Link>
            </div>
          </div>
        </section>
      </main>
    );
  }

  const places = PLACES.filter(p => savedSet.has(p.id));
  return (
    <main className="route-mount">
      <section className="wrap" style={{ padding: '32px 0 24px' }}>
        <div className="mono">Your places</div>
        <h1 className="h1" style={{ marginTop: 10 }}>Saved <span style={{ color: 'var(--muted)' }}>· {places.length}</span></h1>
      </section>
      <section className="wrap" style={{ marginBottom: 56 }}>
        {places.length === 0 ? (
          <div className="card card-flat" style={{ padding: 40, textAlign: 'center', color: 'var(--muted)' }}>
            <div className="h4">Nothing saved yet</div>
            <div style={{ fontSize: 13, marginTop: 6 }}>Tap the bookmark on any place to keep it here.</div>
            <Link to="#/map" className="btn btn-primary" style={{ marginTop: 14 }}>Browse the map</Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: 14, gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
            {places.map(p => <PlaceCard key={p.id} place={p} savedSet={savedSet} onToggleSave={onToggleSave}/>)}
          </div>
        )}
      </section>
    </main>
  );
}

export function SubmitPage({ auth }) {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', category: '', area: '', city: 'bangkok', desc: '' });

  if (!auth.signedIn) {
    return (
      <main className="wrap route-mount" style={{ padding: '32px var(--gutter) 64px', maxWidth: 720 }}>
        <div className="mono">Contribute</div>
        <h1 className="h1" style={{ marginTop: 10 }}>Submit a place</h1>
        <div className="card" style={{ padding: 28, marginTop: 22 }}>
          <p style={{ marginTop: 0 }}>Submissions are tied to a contributor account so we can credit you and follow up if an editor has questions.</p>
          <Link to="#/signin" className="btn btn-primary btn-lg">Sign in to submit →</Link>
        </div>
      </main>
    );
  }

  if (submitted) {
    return (
      <main className="wrap route-mount" style={{ padding: '60px var(--gutter)', maxWidth: 540, textAlign: 'center' }}>
        <div style={{ width: 64, height: 64, borderRadius: 16, background: '#5E7A3A20', color: 'var(--moss)', display: 'grid', placeItems: 'center', margin: '0 auto 16px' }}>
          <Icon.send size={28}/>
        </div>
        <h1 className="h2">Thanks — we'll take a look.</h1>
        <p style={{ color: 'var(--muted)', marginTop: 8 }}>An editor will review your submission within 48 hours. We'll email you if we have questions.</p>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginTop: 22 }}>
          <Link to="#/account" className="btn">See my contributions</Link>
          <Link to="#/map" className="btn btn-primary">Back to the map</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="wrap route-mount" style={{ padding: '32px var(--gutter) 64px', maxWidth: 720 }}>
      <div className="mono">Contribute · editor reviewed</div>
      <h1 className="h1" style={{ marginTop: 10 }}>Submit a place</h1>
      <p style={{ color: 'var(--muted)', maxWidth: 540, marginTop: 8 }}>Tell us about a place we should add. We'll review for accuracy and edit for clarity — but your name stays on the entry.</p>

      <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginTop: 24, marginBottom: 20 }}>
        {[1, 2, 3].map(n => (
          <Fragment key={n}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: n <= step ? 'var(--brand)' : 'var(--bg-2)', color: n <= step ? '#fff' : 'var(--muted)', display: 'grid', placeItems: 'center', fontWeight: 700, fontSize: 12 }}>{n}</div>
              <div className="mono" style={{ color: n === step ? 'var(--text)' : 'var(--muted)' }}>{['Basics', 'Details', 'Review'][n - 1]}</div>
            </div>
            {n < 3 && <div style={{ flex: 1, height: 2, background: n < step ? 'var(--brand)' : 'var(--line)' }}/>}
          </Fragment>
        ))}
      </div>

      <form className="card" style={{ padding: 22, display: 'flex', flexDirection: 'column', gap: 14 }} onSubmit={e => { e.preventDefault(); if (step < 3) setStep(step + 1); else setSubmitted(true); }}>
        {step === 1 && <>
          <div className="field"><label>Place name *</label><input className="input" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Sang Som Noodles"/></div>
          <div className="field"><label>Category *</label>
            <select className="select" required value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
              <option value="">— select —</option>
              {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
            </select>
          </div>
          <div className="field"><label>City *</label>
            <select className="select" required value={form.city} onChange={e => setForm({ ...form, city: e.target.value })}>
              {CITIES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="field"><label>Area / neighbourhood</label><input className="input" value={form.area} onChange={e => setForm({ ...form, area: e.target.value })} placeholder="e.g. Thong Lor"/></div>
        </>}

        {step === 2 && <>
          <div className="field"><label>Short description *</label>
            <textarea className="textarea" required value={form.desc} onChange={e => setForm({ ...form, desc: e.target.value })}
              placeholder="What's special? What do regulars order? Anything to skip? 2–3 sentences is perfect."/>
            <div className="hint">No marketing copy please. Honest, specific, useful.</div>
          </div>
          <div className="field"><label>Address or Google Maps link</label><input className="input" placeholder="https://maps.google.com/..."/></div>
          <div className="field"><label>Opening hours</label><input className="input" placeholder="e.g. Daily 10:00 – 22:00"/></div>
          <div className="field"><label>Price level</label>
            <div style={{ display: 'flex', gap: 6 }}>
              {[1, 2, 3, 4].map(n => <button key={n} type="button" className="chip" style={{ flex: 1, justifyContent: 'center' }}>{'฿'.repeat(n)}</button>)}
            </div>
          </div>
        </>}

        {step === 3 && <>
          <div className="card card-flat" style={{ padding: 14 }}>
            <div className="mono" style={{ marginBottom: 8 }}>Review</div>
            <div style={{ fontSize: 14.5 }}><strong>{form.name || '(no name)'}</strong> — {(CATEGORIES.find(c => c.id === form.category) || {}).label || '(no category)'}</div>
            <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 2 }}>{form.area || '(area)'}, {form.city === 'phuket' ? 'Phuket' : 'Bangkok'}</div>
            <div style={{ fontSize: 13, marginTop: 12, lineHeight: 1.55 }}>{form.desc || '(description)'}</div>
          </div>
          <div style={{ fontSize: 12.5, color: 'var(--muted)' }}>By submitting you agree to our editorial standards. We may edit for accuracy and tone. You'll be credited.</div>
        </>}

        <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
          {step > 1 && <button type="button" className="btn" onClick={() => setStep(step - 1)}>← Back</button>}
          <button type="submit" className="btn btn-primary" style={{ marginLeft: 'auto' }}>{step < 3 ? 'Continue →' : <><Icon.send size={16}/> Submit</>}</button>
        </div>
      </form>
    </main>
  );
}

export function AccountPage({ auth, savedSet, onToggleSave }) {
  if (!auth.signedIn) {
    return (
      <main className="wrap route-mount" style={{ padding: '60px var(--gutter)', maxWidth: 540, textAlign: 'center' }}>
        <h1 className="h2">Sign in to view your account</h1>
        <Link to="#/signin" className="btn btn-primary btn-lg" style={{ marginTop: 18 }}>Sign in</Link>
      </main>
    );
  }

  const recent = PLACES.slice(0, 4);
  const contributions = PLACES.slice(4, 6);

  return (
    <main className="route-mount">
      <section className="wrap" style={{ padding: '32px 0 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
          <div style={{ width: 64, height: 64, borderRadius: 18, background: 'var(--bg-deep)', color: 'var(--text-on-deep)', display: 'grid', placeItems: 'center', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 22 }}>SK</div>
          <div>
            <div className="mono">Contributor</div>
            <h1 className="h2" style={{ margin: '4px 0 0' }}>Sai K.</h1>
            <div style={{ color: 'var(--muted)', fontSize: 13 }}>Joined March 2025 · {contributions.length} contributions</div>
          </div>
          <div style={{ marginLeft: 'auto' }}>
            <button onClick={auth.signOut} className="btn">Sign out</button>
          </div>
        </div>
      </section>

      <section className="wrap" style={{ marginBottom: 32 }}>
        <SectionHead title="Recently viewed"/>
        <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
          {recent.map(p => <PlaceCard key={p.id} place={p} compact savedSet={savedSet} onToggleSave={onToggleSave}/>)}
        </div>
      </section>

      <section className="wrap" style={{ marginBottom: 32 }}>
        <SectionHead title="My contributions" action={<Link to="#/submit-place" className="btn"><Icon.plus size={14}/> Submit another</Link>}/>
        <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
          {contributions.map(p => (
            <div key={p.id} className="card" style={{ display: 'flex', gap: 12 }}>
              <Slot tone={p.slot.tone} label={p.slot.label.split(' ')[0]} h={70} style={{ width: 92, flexShrink: 0, padding: 8 }}/>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: 14, fontFamily: 'var(--font-display)' }}>{p.name}</div>
                <div style={{ fontSize: 11.5, color: 'var(--muted)' }}>{p.area}</div>
                <div className="mono" style={{ marginTop: 6, color: 'var(--moss)' }}>● Published</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="wrap" style={{ marginBottom: 56 }}>
        <SectionHead title="Account & settings"/>
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          {[
            { label: 'Email & password',    value: 'sai@example.com' },
            { label: 'Default city',        value: 'Bangkok' },
            { label: 'Show cannabis shops', value: 'Off' },
            { label: 'Language',            value: 'English' },
            { label: 'Notifications',       value: 'Editor replies only' },
          ].map((row, i, arr) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '14px 18px', borderBottom: i < arr.length - 1 ? '1px solid var(--line)' : 'none', alignItems: 'center', fontSize: 14 }}>
              <span>{row.label}</span>
              <span style={{ color: 'var(--muted)', display: 'inline-flex', alignItems: 'center', gap: 6 }}>{row.value} <Icon.chevR size={14}/></span>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

export function SignInPage({ auth }) {
  const onSignIn = (e) => {
    e.preventDefault();
    auth.signIn();
    navigate('#/home');
  };
  return (
    <main className="wrap route-mount" style={{ padding: '40px var(--gutter)', maxWidth: 460 }}>
      <div className="card" style={{ padding: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <img src="/logo.png" alt="" style={{ width: 32, height: 32, borderRadius: 9 }}/>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 17 }}>Inside Thailand</span>
        </div>
        <h1 className="h2" style={{ margin: '8px 0 4px' }}>Welcome back</h1>
        <p style={{ color: 'var(--muted)', marginTop: 0, marginBottom: 22, fontSize: 14 }}>Sign in to save places, submit new ones, and sync with the mobile app.</p>

        <button onClick={onSignIn} className="btn" style={{ width: '100%', justifyContent: 'center', padding: 12 }}>
          Continue with Google
        </button>
        <button onClick={onSignIn} className="btn" style={{ width: '100%', justifyContent: 'center', marginTop: 8, padding: 12 }}>
          Continue with Apple
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '20px 0', color: 'var(--muted)', fontSize: 11.5 }}>
          <div style={{ flex: 1, height: 1, background: 'var(--line)' }}/>
          OR
          <div style={{ flex: 1, height: 1, background: 'var(--line)' }}/>
        </div>

        <form onSubmit={onSignIn} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div className="field"><label>Email</label><input type="email" className="input" placeholder="you@example.com" required/></div>
          <div className="field"><label>Password</label><input type="password" className="input" required/></div>
          <button type="submit" className="btn btn-primary btn-lg" style={{ justifyContent: 'center' }}>Sign in</button>
        </form>

        <div style={{ marginTop: 16, fontSize: 12.5, color: 'var(--muted)', textAlign: 'center' }}>
          No account? <a href="#/signin" style={{ color: 'var(--brand)', fontWeight: 600 }}>Create one</a>
        </div>
      </div>
    </main>
  );
}
