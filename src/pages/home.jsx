import { useState } from 'react';
import { Link, navigate } from '../router';
import Icon from '../icons';
import { CATEGORIES, CITIES, PLACES, GUIDES, TOURIST_TOOLS } from '../data';
import { Slot, PlaceCard, CategoryTile, SectionHead } from '../shared';
import { GMap } from '../gmap';

export function HomePage({ tweaks, city, setCity, savedSet, onToggleSave }) {
  const layout = tweaks.homeLayout || 'hub';
  if (layout === 'mapfirst') return <HomeMapFirst city={city} setCity={setCity} savedSet={savedSet} onToggleSave={onToggleSave} tweaks={tweaks}/>;
  if (layout === 'editorial') return <HomeEditorial city={city} setCity={setCity} savedSet={savedSet} onToggleSave={onToggleSave} tweaks={tweaks}/>;
  return <HomeHub city={city} setCity={setCity} savedSet={savedSet} onToggleSave={onToggleSave} tweaks={tweaks}/>;
}

function HomeHub({ city, setCity, savedSet, onToggleSave, tweaks }) {
  const cats = CATEGORIES.filter(c => !c.optional || tweaks.showCannabis);
  const places = PLACES.filter(p => (!p.optional || tweaks.showCannabis) && p.city === city);
  const featured = places.slice(0, 6);
  const guides = GUIDES.slice(0, 4);

  return (
    <main className="route-mount">
      <section className="hero">
        <div className="wrap">
          <div className="mono" style={{ marginBottom: 14 }}>Inside Thailand · the local edge</div>
          <h1 className="h1" style={{ maxWidth: 980 }}>
            Thailand,&nbsp;
            <span style={{ color: 'var(--brand)' }} className="italic">from the inside</span>.
          </h1>
          <p style={{ maxWidth: 640 }}>
            A discovery hub for places, food, transport, and the practical stuff —
            written by people who actually live here, not a marketing department.
          </p>

          <form className="searchbar" onSubmit={(e) => { e.preventDefault(); const q = e.currentTarget.q.value; navigate('#/map' + (q ? `?q=${encodeURIComponent(q)}` : '')); }}>
            <select name="city" defaultValue={city} onChange={e => setCity(e.target.value)} className="only-tablet-up" style={{ border: 0, background: 'var(--bg-2)', padding: '0 14px', borderRadius: 12, font: 'inherit', fontSize: '13.5px', color: 'var(--text)' }}>
              {CITIES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <input name="q" placeholder='"boat market", "rooftop bar", "muay thai"…'/>
            <button type="submit" className="btn btn-primary" aria-label="Search">
              <Icon.search size={18}/> <span className="inline-only-tablet-up">Search</span>
            </button>
          </form>

          <div className="hide-scrollbar" style={{ marginTop: 16, display: 'flex', gap: 8 }}>
            {['Night markets','Street food','Rooftop bars','Temples','Muay Thai gyms','Beaches'].map((label, i) => (
              <Link key={i} to={`#/category/${label.toLowerCase().replace(/\s+/g, '-')}`} className="chip">
                <Icon.search size={12}/> {label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="wrap" style={{ marginBottom: 56 }}>
        <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
          <MapPreviewCard city={city}/>
          <ActionCard
            kicker="Scam-aware"
            title="Avoid the 8 most common Bangkok scams"
            cta="Read the list"
            to="#/tools/scams"
            tone="brand"
            icon={<Icon.shield size={22}/>}
          />
          <ActionCard
            kicker="Real prices"
            title="What things actually cost — taxi, food, beer, more"
            cta="Open price checker"
            to="#/tools/prices"
            tone="gold"
            icon={<Icon.tag size={22}/>}
          />
        </div>
      </section>

      <section className="wrap" style={{ marginBottom: 56 }}>
        <SectionHead kicker="Browse" title="By category" subtitle="16 ways to slice Thailand." action={<Link to="#/map" className="btn">All on map</Link>}/>
        <div style={{ display: 'grid', gap: 10, gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
          {cats.map(c => <CategoryTile key={c.id} category={c}/>)}
        </div>
      </section>

      <section className="wrap" style={{ marginBottom: 56 }}>
        <SectionHead kicker="Hand-picked" title={`Featured places in ${city === 'phuket' ? 'Phuket' : 'Bangkok'}`} action={<Link to="#/map" className="btn">See all</Link>}/>
        <div style={{ display: 'grid', gap: 14, gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
          {featured.map(p => <PlaceCard key={p.id} place={p} savedSet={savedSet} onToggleSave={onToggleSave}/>)}
        </div>
      </section>

      <section className="wrap" style={{ marginBottom: 56 }}>
        <SectionHead kicker="Tourist tools" title="The everyday utilities" subtitle="What we wish someone had built for us when we first arrived."/>
        <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
          {TOURIST_TOOLS.map(t => <ToolCard key={t.id} tool={t}/>)}
        </div>
      </section>

      <section className="wrap" style={{ marginBottom: 56 }}>
        <SectionHead kicker="Practical" title="Popular guides" action={<Link to="#/guides" className="btn">All guides</Link>}/>
        <div style={{ display: 'grid', gap: 10, gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
          {guides.map(g => (
            <Link key={g.id} to={`#/guides/${g.id}`} className="card card-hov" style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: '#C13D2F15', color: 'var(--brand)', display: 'grid', placeItems: 'center', fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700, flexShrink: 0 }}>
                {String(GUIDES.indexOf(g) + 1).padStart(2, '0')}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="h4" style={{ fontSize: 15 }}>{g.title}</div>
                <div className="mono" style={{ marginTop: 4 }}>{g.area} · {g.mins} min read</div>
              </div>
              <Icon.chevR size={16}/>
            </Link>
          ))}
        </div>
      </section>

      <section className="wrap" style={{ marginBottom: 56 }}>
        <div className="card card-deep" style={{ padding: 28 }}>
          <div style={{ display: 'grid', gap: 18, gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', alignItems: 'center' }}>
            <div>
              <div className="mono" style={{ color: 'rgba(245,238,220,.55)' }}>Contribute</div>
              <h3 className="h2" style={{ marginTop: 6 }}>Know a place we missed?</h3>
              <p style={{ color: 'rgba(245,238,220,.75)', marginTop: 8, maxWidth: 540 }}>
                Every entry is reviewed by an editor before going live. Quality over quantity — we'd rather miss your favourite than publish the wrong one.
              </p>
            </div>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <Link to="#/submit-place" className="btn btn-primary btn-lg"><Icon.plus size={18}/> Submit a place</Link>
              <Link to="#/home" className="btn" style={{ background: 'rgba(255,255,255,.08)', color: 'var(--text-on-deep)', boxShadow: 'none' }}>How review works</Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function HomeMapFirst({ city, setCity, savedSet, onToggleSave, tweaks }) {
  const cats = CATEGORIES.filter(c => !c.optional || tweaks.showCannabis).slice(0, 8);
  const places = PLACES.filter(p => (!p.optional || tweaks.showCannabis) && p.city === city);

  return (
    <main className="route-mount">
      <section style={{ position: 'relative', padding: 0 }}>
        <div className="wrap" style={{ padding: '24px var(--gutter) 16px', position: 'relative', zIndex: 2 }}>
          <div className="mono" style={{ marginBottom: 10 }}>Inside Thailand</div>
          <h1 className="h1" style={{ maxWidth: 900 }}>
            Find your next <span style={{ color: 'var(--brand)' }} className="italic">place</span>.
          </h1>
          <p style={{ color: 'var(--muted)', maxWidth: 540, marginBottom: 18 }}>
            {places.length} places mapped across {city === 'phuket' ? 'Phuket' : 'Bangkok'} — categorised, filtered, opinionated.
          </p>
          <form className="searchbar" onSubmit={(e) => { e.preventDefault(); const q = e.currentTarget.q.value; navigate('#/map' + (q ? `?q=${encodeURIComponent(q)}` : '')); }}>
            <input name="q" placeholder='Try "boat market", "rooftop bar"…'/>
            <button className="btn btn-primary"><Icon.search size={18}/> Search</button>
          </form>
        </div>
        <div style={{ position: 'relative', height: 'clamp(280px, 36vw, 460px)', marginTop: -12 }}>
          <GMap pins={places} city={city}/>
          <Link to="#/map" className="btn btn-dark btn-lg" style={{ position: 'absolute', left: '50%', bottom: 22, transform: 'translateX(-50%)' }}>
            <Icon.map size={18}/> Open full map
          </Link>
        </div>
      </section>

      <section className="wrap" style={{ marginTop: 48, marginBottom: 48 }}>
        <SectionHead title="Pick a category" subtitle="Or filter the map yourself."/>
        <div style={{ display: 'grid', gap: 10, gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
          {cats.map(c => <CategoryTile key={c.id} category={c}/>)}
        </div>
      </section>

      <section className="wrap" style={{ marginBottom: 56 }}>
        <SectionHead kicker="Hand-picked" title="Featured places"/>
        <div style={{ display: 'grid', gap: 14, gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
          {places.slice(0, 6).map(p => <PlaceCard key={p.id} place={p} savedSet={savedSet} onToggleSave={onToggleSave}/>)}
        </div>
      </section>

      <section className="wrap" style={{ marginBottom: 56 }}>
        <SectionHead title="Tourist tools"/>
        <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
          {TOURIST_TOOLS.slice(0, 4).map(t => <ToolCard key={t.id} tool={t}/>)}
        </div>
      </section>
    </main>
  );
}

function HomeEditorial({ city, setCity, savedSet, onToggleSave, tweaks }) {
  const places = PLACES.filter(p => (!p.optional || tweaks.showCannabis) && p.city === city);

  return (
    <main className="route-mount">
      <section className="wrap" style={{ padding: '32px 0 24px' }}>
        <div style={{ display: 'grid', gap: 24, gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', alignItems: 'center' }}>
          <div>
            <div className="mono" style={{ marginBottom: 12 }}>Issue 03 · May 2026</div>
            <h1 className="h1">
              The Bangkok <span style={{ color: 'var(--brand)' }} className="italic">we'd</span><br/>
              actually show a friend.
            </h1>
            <p style={{ color: 'var(--muted)', marginTop: 14, maxWidth: 520 }}>
              Hand-picked places, working transport tips, scams to skip, and the prices nobody tells you. Updated by editors who live here.
            </p>
            <div style={{ display: 'flex', gap: 10, marginTop: 22, flexWrap: 'wrap' }}>
              <Link to="#/map" className="btn btn-primary btn-lg"><Icon.map size={18}/> Open the map</Link>
              <Link to="#/guides" className="btn btn-lg">Read the guides</Link>
            </div>
          </div>
          <div>
            <Slot tone="charcoal" label={places[0]?.slot.label || 'Featured'} sub={places[0]?.slot.sub} h={420} tag="THIS WEEK"/>
          </div>
        </div>
      </section>

      <section className="wrap" style={{ marginBottom: 48 }}>
        <form className="searchbar" onSubmit={(e) => { e.preventDefault(); const q = e.currentTarget.q.value; navigate('#/map' + (q ? `?q=${encodeURIComponent(q)}` : '')); }} style={{ maxWidth: '100%' }}>
          <input name="q" placeholder='Search 240 places in Bangkok, 68 in Phuket…'/>
          <button className="btn btn-primary"><Icon.search size={18}/> Search</button>
        </form>
      </section>

      <section className="wrap" style={{ marginBottom: 56 }}>
        <div style={{ display: 'grid', gap: 14, gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
          {places.slice(0, 6).map(p => <PlaceCard key={p.id} place={p} savedSet={savedSet} onToggleSave={onToggleSave}/>)}
        </div>
      </section>

      <section className="wrap" style={{ marginBottom: 56 }}>
        <SectionHead kicker="Tools" title="Built for everyday Thailand"/>
        <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
          {TOURIST_TOOLS.slice(0, 6).map(t => <ToolCard key={t.id} tool={t}/>)}
        </div>
      </section>
    </main>
  );
}

export function MapPreviewCard({ city }) {
  const places = PLACES.filter(p => p.city === city).slice(0, 8);
  return (
    <Link to="#/map" className="card card-hov" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <div style={{ position: 'relative', height: 200 }}>
        <GMap pins={places} city={city}/>
        <div style={{ position: 'absolute', left: 14, top: 12, padding: '5px 10px', background: 'rgba(255,255,255,.92)', backdropFilter: 'blur(8px)', borderRadius: 999, fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '.1em', textTransform: 'uppercase', fontWeight: 700 }}>
          {city === 'phuket' ? 'Phuket' : 'Bangkok'} · {places.length}+ places
        </div>
      </div>
      <div style={{ padding: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 44, height: 44, borderRadius: 11, background: 'var(--teal)', color: '#fff', display: 'grid', placeItems: 'center' }}><Icon.map size={22}/></div>
        <div style={{ flex: 1 }}>
          <div className="h4">Open the map</div>
          <div style={{ fontSize: 12.5, color: 'var(--muted)' }}>Pan, filter, save — full screen</div>
        </div>
        <Icon.chevR size={18}/>
      </div>
    </Link>
  );
}

export function ActionCard({ kicker, title, cta, to, tone = 'brand', icon }) {
  const tones = {
    brand: { bg: 'var(--brand)', fg: '#fff' },
    gold:  { bg: 'var(--gold)',  fg: '#1B1816' },
    teal:  { bg: 'var(--teal)',  fg: '#fff' },
  };
  const c = tones[tone];
  return (
    <Link to={to} className="card" style={{ background: c.bg, color: c.fg, boxShadow: 'none', display: 'flex', flexDirection: 'column', gap: 14, minHeight: 200 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(255,255,255,.15)', display: 'grid', placeItems: 'center' }}>{icon}</div>
        <Icon.chevR size={20}/>
      </div>
      <div style={{ marginTop: 'auto' }}>
        <div className="mono" style={{ color: 'currentColor', opacity: .65, textTransform: 'uppercase' }}>{kicker}</div>
        <div className="h3" style={{ marginTop: 6, color: 'inherit' }}>{title}</div>
        <div style={{ marginTop: 14, fontSize: 13, fontWeight: 600, opacity: .9, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          {cta} <Icon.arrowL size={14} style={{ transform: 'rotate(180deg)' }}/>
        </div>
      </div>
    </Link>
  );
}

export function ToolCard({ tool }) {
  const Ic = Icon[tool.icon] || Icon.dot;
  return (
    <Link to={tool.route} className="card card-hov" style={{ display: 'flex', flexDirection: 'column', gap: 10, minHeight: 150 }}>
      <div style={{ width: 40, height: 40, borderRadius: 11, background: tool.tone + '18', color: tool.tone, display: 'grid', placeItems: 'center' }}><Ic size={22}/></div>
      <div className="h4" style={{ fontSize: 15.5, marginTop: 4 }}>{tool.name}</div>
      <div style={{ fontSize: 12.5, color: 'var(--muted)', lineHeight: 1.45, flex: 1 }}>{tool.desc}</div>
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600, color: tool.tone }}>
        Open <Icon.arrowL size={12} style={{ transform: 'rotate(180deg)' }}/>
      </div>
    </Link>
  );
}
