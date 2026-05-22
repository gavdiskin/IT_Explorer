import { useState, useMemo } from 'react';
import { Link } from '../router';
import Icon from '../icons';
import { CATEGORIES, CITIES, PLACES, STATIONS, GUIDES, FOOD_FILTERS, ESSENTIAL_APPS } from '../data';
import { Slot, PlaceCard, CategoryTile, SectionHead } from '../shared';
import { NotFound } from './place';

export function CategoryPage({ route, city, savedSet, onToggleSave, tweaks }) {
  const cat = CATEGORIES.find(c => c.id === route.params.id);
  if (!cat) return <NotFound title="Category" subtitle="No such category."/>;

  const Ic = Icon[cat.icon] || Icon.dot;
  const places = PLACES.filter(p => (!p.optional || tweaks.showCannabis) && p.category === cat.id);
  const [sortBy, setSortBy] = useState('rating');

  const sorted = useMemo(() => {
    const r = [...places];
    if (sortBy === 'rating') r.sort((a, b) => b.rating - a.rating);
    if (sortBy === 'price-asc') r.sort((a, b) => a.price - b.price);
    if (sortBy === 'reviews') r.sort((a, b) => b.reviews - a.reviews);
    return r;
  }, [places, sortBy]);

  return (
    <main className="route-mount">
      <section style={{ background: cat.accent + '12', borderBottom: '1px solid var(--line)', padding: '32px 0 40px' }}>
        <div className="wrap" style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', alignItems: 'center' }}>
          <div>
            <div className="mono" style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
              <Link to="#/home" style={{ color: 'var(--muted)' }}>Home</Link> / <span style={{ color: cat.accent }}>{cat.label}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 56, height: 56, borderRadius: 16, background: cat.accent, color: '#fff', display: 'grid', placeItems: 'center' }}><Ic size={28} stroke={1.8}/></div>
              <h1 className="h1" style={{ margin: 0, fontSize: 'clamp(28px, 4vw, 48px)' }}>{cat.label}</h1>
            </div>
            <p style={{ color: 'var(--muted)', marginTop: 14, maxWidth: 520, fontSize: 14.5 }}>
              {places.length} {places.length === 1 ? 'place' : 'places'} in {city === 'phuket' ? 'Phuket' : 'Bangkok'}, hand-picked by editors.{cat.id === 'cannabis' ? ' Verify current legal status before visiting — laws are in flux.' : ''}
            </p>
            <div style={{ marginTop: 18, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <Link to={`#/map?cat=${cat.id}`} className="btn btn-primary"><Icon.map size={16}/> Show on map</Link>
            </div>
          </div>
          <div className="only-tablet-up">
            <Slot tone={cat.tone} label={cat.label} sub={`${places.length} places · ${city === 'phuket' ? 'Phuket' : 'Bangkok'}`} h={240}/>
          </div>
        </div>
      </section>

      <section className="wrap" style={{ padding: '24px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }} className="hide-scrollbar">
          {cat.id === 'food' && FOOD_FILTERS.slice(0, 6).map(t => (
            <button key={t} className="chip">{t}</button>
          ))}
          {cat.id !== 'food' && places.slice(0, 4).map(p => (
            <span key={p.id} className="chip" style={{ background: 'transparent' }}>{p.area}</span>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
          <span style={{ color: 'var(--muted)' }}>Sort by</span>
          <select className="select" style={{ padding: '8px 12px', fontSize: 13 }} value={sortBy} onChange={e => setSortBy(e.target.value)}>
            <option value="rating">Top rated</option>
            <option value="reviews">Most reviewed</option>
            <option value="price-asc">Price (low → high)</option>
          </select>
        </div>
      </section>

      <section className="wrap" style={{ marginBottom: 56 }}>
        <div style={{ display: 'grid', gap: 14, gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
          {sorted.map(p => <PlaceCard key={p.id} place={p} savedSet={savedSet} onToggleSave={onToggleSave}/>)}
        </div>
        {sorted.length === 0 && (
          <div className="card card-flat" style={{ textAlign: 'center', padding: 40, color: 'var(--muted)' }}>
            <div className="h4">No {cat.label.toLowerCase()} listed yet</div>
            <div style={{ fontSize: 13, marginTop: 6 }}>Be the first — <Link to="#/submit-place" style={{ color: 'var(--brand)', fontWeight: 600 }}>submit a place</Link>.</div>
          </div>
        )}
      </section>
    </main>
  );
}

export function CityPage({ route, savedSet, onToggleSave, tweaks }) {
  const cityId = route.params.id;
  const city = CITIES.find(c => c.id === cityId);
  if (!city) return <NotFound title="City" subtitle="No such city."/>;

  const places = PLACES.filter(p => (!p.optional || tweaks.showCannabis) && p.city === cityId);
  const cats = CATEGORIES.filter(c => !c.optional || tweaks.showCannabis).slice(0, 8);
  const featured = places.slice(0, 6);

  const intros = {
    bangkok: {
      knownFor: 'Street food, temples, nightlife, malls, chaos that somehow works.',
      bestFor: 'First-timers, food obsessives, anyone with a layover that became a week.',
      transport: 'BTS + MRT cover most tourist areas. Use Bolt or Grab — Bangkok taxis often refuse meter.',
      tips: [
        'Avoid Khao San Road tuk-tuks.',
        'Sundays the BTS gets brutal — go early.',
        'Best weather Nov–Feb. Apr is hellfire.',
      ],
    },
    phuket: {
      knownFor: 'Beaches, big nightlife, day-trip islands.',
      bestFor: 'Beach holidays, families on the west coast, parties at Patong.',
      transport: 'No real public transport. Grab limited. Rent a scooter or hire a driver.',
      tips: [
        "Avoid Patong if you don't want noise.",
        'Jet ski scam is still very real.',
        'Wet season Apr–Oct — rough water.',
      ],
    },
  };
  const intro = intros[cityId] || intros.bangkok;

  return (
    <main className="route-mount">
      <section style={{ position: 'relative' }}>
        <Slot tone={cityId === 'phuket' ? 'teal' : 'clay'} label={city.name} sub={city.tagline} h={'clamp(220px, 30vw, 360px)'} style={{ borderRadius: 0 }} tag={cityId === 'bangkok' ? 'MVP focus' : 'Coming soon'}/>
        <div className="wrap" style={{ marginTop: -60, position: 'relative', zIndex: 2 }}>
          <div className="card" style={{ padding: 22 }}>
            <div className="mono" style={{ marginBottom: 6 }}>City guide · {city.country}</div>
            <h1 className="h1" style={{ margin: 0, fontSize: 'clamp(32px, 5vw, 56px)' }}>{city.name}</h1>
            <div style={{ color: 'var(--muted)', marginTop: 8 }}>{city.tagline} · {city.placeCount} places mapped</div>
            <div style={{ display: 'flex', gap: 10, marginTop: 18, flexWrap: 'wrap' }}>
              <Link to="#/map" className="btn btn-primary"><Icon.map size={16}/> Browse on map</Link>
              <Link to="#/guides" className="btn">Practical guides</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="wrap" style={{ marginTop: 32, marginBottom: 48 }}>
        <div style={{ display: 'grid', gap: 14, gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
          <Fact2 label="Known for" value={intro.knownFor}/>
          <Fact2 label="Best for" value={intro.bestFor}/>
          <Fact2 label="Getting around" value={intro.transport}/>
        </div>
      </section>

      <section className="wrap" style={{ marginBottom: 48 }}>
        <SectionHead title="Browse by category" action={<Link to="#/map" className="btn">All on map</Link>}/>
        <div style={{ display: 'grid', gap: 10, gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
          {cats.map(c => <CategoryTile key={c.id} category={c}/>)}
        </div>
      </section>

      <section className="wrap" style={{ marginBottom: 48 }}>
        <SectionHead kicker="Hand-picked" title={`Featured places in ${city.name}`}/>
        <div style={{ display: 'grid', gap: 14, gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
          {featured.map(p => <PlaceCard key={p.id} place={p} savedSet={savedSet} onToggleSave={onToggleSave}/>)}
        </div>
      </section>

      <section className="wrap" style={{ marginBottom: 56 }}>
        <SectionHead title="Local tips" badge="from locals"/>
        <div className="card card-deep" style={{ padding: 28 }}>
          <ul style={{ margin: 0, paddingLeft: 18, fontSize: 14.5, lineHeight: 1.7, color: 'rgba(245,238,220,.9)' }}>
            {intro.tips.map((t, i) => <li key={i} style={{ marginBottom: 6 }}>{t}</li>)}
          </ul>
        </div>
      </section>
    </main>
  );
}

function Fact2({ label, value }) {
  return (
    <div className="card">
      <div className="mono" style={{ marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: 14, lineHeight: 1.5 }}>{value}</div>
    </div>
  );
}

export function StationPage({ route, savedSet, onToggleSave, tweaks }) {
  const station = STATIONS.find(s => s.id === route.params.id);
  if (!station) return <NotFound title="Station" subtitle="No such station."/>;

  const places = PLACES.filter(p => (!p.optional || tweaks.showCannabis) && p.station === station.id);

  return (
    <main className="route-mount">
      <section style={{ background: station.color + '14', padding: '32px 0 32px' }}>
        <div className="wrap">
          <div className="mono" style={{ marginBottom: 12 }}>
            <Link to="#/transport" style={{ color: 'var(--muted)' }}>Transport</Link> / <span style={{ color: station.color }}>{station.line}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 64, height: 64, borderRadius: 16, background: station.color, color: '#fff', display: 'grid', placeItems: 'center' }}><Icon.train size={28} stroke={1.8}/></div>
            <div>
              <h1 className="h1" style={{ margin: 0, fontSize: 'clamp(26px, 4vw, 42px)' }}>{station.name}</h1>
              <div className="mono" style={{ marginTop: 4 }}>{station.line}</div>
            </div>
          </div>
          <p style={{ marginTop: 18, maxWidth: 560 }}>{station.knownFor}</p>
        </div>
      </section>

      <section className="wrap" style={{ marginTop: 24, marginBottom: 48 }}>
        <SectionHead title={`Places near ${station.name}`} subtitle={`${places.length} ${places.length === 1 ? 'place' : 'places'} within easy walk.`}/>
        {places.length > 0 ? (
          <div style={{ display: 'grid', gap: 14, gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
            {places.map(p => <PlaceCard key={p.id} place={p} savedSet={savedSet} onToggleSave={onToggleSave}/>)}
          </div>
        ) : (
          <div className="card card-flat" style={{ padding: 32, textAlign: 'center', color: 'var(--muted)' }}>
            <div className="h4">Nothing tagged here yet</div>
            <div style={{ fontSize: 13, marginTop: 6 }}>Help fill the map — <Link to="#/submit-place" style={{ color: 'var(--brand)', fontWeight: 600 }}>submit a place</Link>.</div>
          </div>
        )}
      </section>
    </main>
  );
}

export function GuidesPage({ route }) {
  if (route.name === 'guide') {
    const g = GUIDES.find(x => x.id === route.params.id);
    if (!g) return <NotFound title="Guide" subtitle="That guide isn't here."/>;
    return (
      <main className="wrap route-mount" style={{ padding: '24px var(--gutter) 64px', maxWidth: 860 }}>
        <div className="mono" style={{ marginBottom: 12 }}>
          <Link to="#/guides" style={{ color: 'var(--muted)' }}>← All guides</Link>
        </div>
        <div className="tag" style={{ background: '#C13D2F20', color: 'var(--brand)' }}>{g.area} · {g.mins} min</div>
        <h1 className="h1" style={{ marginTop: 12 }}>{g.title}</h1>
        <p style={{ marginTop: 18, fontSize: 17, lineHeight: 1.6 }}>{g.body}</p>

        <h3 className="h3" style={{ marginTop: 32 }}>Step by step</h3>
        <ol style={{ paddingLeft: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 14, marginTop: 14 }}>
          {['Get to the right counter', 'Bring the right documents', 'Pay and wait', 'Confirm before you leave'].map((s, i) => (
            <li key={i} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
              <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'var(--brand)', color: '#fff', display: 'grid', placeItems: 'center', fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 700, flexShrink: 0 }}>{i + 1}</div>
              <div>
                <div className="h4">{s}</div>
                <div style={{ color: 'var(--muted)', fontSize: 14, marginTop: 4, lineHeight: 1.55 }}>Detailed steps with prices, exact addresses, and what to say go here.</div>
              </div>
            </li>
          ))}
        </ol>

        <div className="card" style={{ marginTop: 32, padding: 18, background: '#FFF4E5', boxShadow: 'inset 0 0 0 1px #D9A23A40' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#9A6E15', marginBottom: 8 }}>
            <Icon.warning size={20}/>
            <span className="h4" style={{ color: '#9A6E15' }}>Watch out for</span>
          </div>
          <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13.5, lineHeight: 1.6, color: '#5C4615' }}>
            <li>Touts at arrivals/exit offering "special prices"</li>
            <li>Anyone asking you to follow them away from the official counter</li>
            <li>Keep digital backups of your passport</li>
          </ul>
        </div>
      </main>
    );
  }

  const groups = {};
  GUIDES.forEach(g => { (groups[g.area] = groups[g.area] || []).push(g); });

  return (
    <main className="route-mount">
      <section className="wrap" style={{ padding: '32px 0 24px' }}>
        <div className="mono">Practical · step by step</div>
        <h1 className="h1" style={{ marginTop: 10 }}>How-to guides</h1>
        <p style={{ color: 'var(--muted)', maxWidth: 560, marginTop: 10, marginBottom: 0 }}>
          The annoying-but-necessary stuff. SIM cards, visas, banks, transport apps — all the things people end up googling at 11pm in a hostel.
        </p>
      </section>

      <section className="wrap" style={{ marginBottom: 56 }}>
        <div style={{ display: 'grid', gap: 24, gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
          {Object.entries(groups).map(([area, items]) => (
            <div key={area} className="card" style={{ padding: 20 }}>
              <div className="mono" style={{ marginBottom: 12 }}>{area}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {items.map(g => (
                  <Link key={g.id} to={`#/guides/${g.id}`} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 8px', borderRadius: 10, color: 'var(--text)' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: 14.5 }}>{g.title}</div>
                      <div className="mono" style={{ marginTop: 2 }}>{g.mins} min read</div>
                    </div>
                    <Icon.chevR size={16}/>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="wrap" style={{ marginBottom: 56 }}>
        <SectionHead kicker="Setup" title="Essential apps for Thailand"/>
        <div style={{ display: 'grid', gap: 10, gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
          {ESSENTIAL_APPS.map(app => (
            <div key={app.id} className="card" style={{ display: 'flex', gap: 12, alignItems: 'center', padding: 14 }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: '#C13D2F18', color: 'var(--brand)', display: 'grid', placeItems: 'center', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 16 }}>{app.name[0]}</div>
              <div>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{app.name}</div>
                <div style={{ fontSize: 12, color: 'var(--muted)' }}>{app.use}</div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

export function TransportPage() {
  const modes = [
    { id: 'bts',  name: 'BTS Skytrain',     color: '#1F8A5B', icon: 'train',      cost: '฿17–62',    summary: 'Elevated train. Cleanest, most reliable.' },
    { id: 'mrt',  name: 'MRT Metro',        color: '#1F6FB4', icon: 'metro',      cost: '฿17–70',    summary: 'Underground. Connects to BTS at Asok/Sukhumvit.' },
    { id: 'arl',  name: 'Airport Rail Link', color: '#9C2A6E', icon: 'planeTrain', cost: '฿15–45',    summary: 'Cheapest airport-to-city route. 26 min Phaya Thai → Suvarnabhumi.' },
    { id: 'bus',  name: 'Local buses',      color: '#D9A23A', icon: 'bus',        cost: '฿8–25',     summary: 'Old red buses are free. Air-con white ones cost more.' },
    { id: 'moto', name: 'Motorbike taxis',  color: '#C13D2F', icon: 'moto',       cost: '฿20–80',    summary: 'Fastest way through Bangkok traffic.' },
    { id: 'tuk',  name: 'Tuk-tuks',         color: '#7B5E3A', icon: 'moto',       cost: 'Negotiate', summary: 'Touristy. Never on the meter. Bolt cheaper.' },
  ];

  return (
    <main className="route-mount">
      <section className="wrap" style={{ padding: '32px 0 24px' }}>
        <div className="mono">Getting around</div>
        <h1 className="h1" style={{ marginTop: 10 }}>Transport · Bangkok</h1>
        <p style={{ color: 'var(--muted)', maxWidth: 560, marginTop: 10 }}>
          Six ways across the city. Which one wins depends on the hour, the area, and how much you mind being stuck in traffic.
        </p>
      </section>

      <section className="wrap" style={{ marginBottom: 32 }}>
        <div className="card" style={{ padding: 24, display: 'flex', gap: 16, alignItems: 'flex-start', background: '#FCEFD3', boxShadow: 'inset 0 0 0 1px #D9A23A40' }}>
          <div style={{ width: 48, height: 48, borderRadius: 12, background: 'var(--gold)', color: '#1B1816', display: 'grid', placeItems: 'center', flexShrink: 0 }}><Icon.planeTrain size={22}/></div>
          <div>
            <h3 className="h3" style={{ margin: 0 }}>Airport → Bangkok center</h3>
            <p style={{ marginTop: 6, marginBottom: 0, fontSize: 14, lineHeight: 1.55 }}>
              <strong>Suvarnabhumi:</strong> Airport Rail Link ฿45, 26 min. &nbsp;
              <strong>Don Mueang:</strong> A1 bus to Mo Chit BTS ฿30, 30 min. &nbsp;
              <strong>Taxi:</strong> ฿250–400 + ฿70 expressway.
            </p>
            <Link to="#/guides/airport" className="btn btn-dark" style={{ marginTop: 12 }}>Read full guide →</Link>
          </div>
        </div>
      </section>

      <section className="wrap" style={{ marginBottom: 48 }}>
        <SectionHead title="Mode by mode"/>
        <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
          {modes.map(m => {
            const Ic = Icon[m.icon] || Icon.dot;
            return (
              <div key={m.id} className="card" style={{ display: 'flex', gap: 12, padding: 16 }}>
                <div style={{ width: 44, height: 44, borderRadius: 11, background: m.color, color: '#fff', display: 'grid', placeItems: 'center', flexShrink: 0 }}><Ic size={22}/></div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 8 }}>
                    <div className="h4">{m.name}</div>
                    <div className="mono" style={{ color: m.color, textTransform: 'none', letterSpacing: '.02em', fontSize: 11.5, fontWeight: 700 }}>{m.cost}</div>
                  </div>
                  <div style={{ fontSize: 13.5, color: 'var(--muted)', marginTop: 4, lineHeight: 1.5 }}>{m.summary}</div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="wrap" style={{ marginBottom: 56 }}>
        <SectionHead title="Popular stations" subtitle="Each station has its own personality. Tap any to see what's around it."/>
        <div style={{ display: 'grid', gap: 10, gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
          {STATIONS.map(s => (
            <Link key={s.id} to={`#/station/${s.id}`} className="card card-hov" style={{ display: 'flex', gap: 12, padding: 14 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: s.color, color: '#fff', display: 'grid', placeItems: 'center' }}><Icon.train size={20}/></div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{s.name}</div>
                <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>{s.knownFor}</div>
              </div>
              <Icon.chevR size={16}/>
            </Link>
          ))}
        </div>
      </section>

      <section className="wrap" style={{ marginBottom: 56 }}>
        <SectionHead title="Quick costs (Bangkok · 2026)"/>
        <div className="card card-flat" style={{ padding: 0, overflow: 'hidden' }}>
          {[
            ['BTS Skytrain', '฿17–62'],
            ['MRT Metro', '฿17–70'],
            ['Airport Rail Link', '฿15–45'],
            ['City taxi (start)', '฿35 + ฿2/100m'],
            ['Motorbike taxi short', '฿20–40'],
            ['Tuk-tuk (avoid)', '฿100+ negotiate'],
            ['Grab/Bolt 5km', '฿80–140'],
          ].map(([k, v], i, arr) => (
            <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '14px 18px', borderBottom: i < arr.length - 1 ? '1px solid var(--line)' : 'none', fontSize: 14 }}>
              <span>{k}</span>
              <span className="mono" style={{ color: 'var(--text)', fontSize: 12, textTransform: 'none', fontWeight: 600 }}>{v}</span>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
