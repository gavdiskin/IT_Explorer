import { useState, useEffect } from 'react';
import { Link, navigate } from './router';
import Icon from './icons';
import { CITIES } from './data';

export function useAuth(initial = false) {
  const [signedIn, setSignedIn] = useState(initial);
  return { signedIn, signIn: () => setSignedIn(true), signOut: () => setSignedIn(false) };
}

export function Header({ auth, route, city, setCity, onMenu }) {
  const isActive = (n) => n === route.name || (n === 'home' && route.name === '404');

  return (
    <header className="header">
      <div className="wrap header__inner">
        <Link to="#/home" className="header__brand">
          <img src="/logo.png" alt=""/>
          <span>Inside Thailand</span>
        </Link>

        <nav className="header__nav" aria-label="Primary">
          <Link to="#/map"    className={isActive('map') ? 'is-active' : ''}>Map</Link>
          <Link to="#/city/bangkok" className={['city','category'].includes(route.name) ? 'is-active' : ''}>Explore</Link>
          <Link to="#/guides" className={['guides','guide','transport'].includes(route.name) ? 'is-active' : ''}>Guides</Link>
          <Link to="#/tools"  className={['tools','tools-scams','tools-prices','tools-phrasebook','tools-emergency','tools-sim'].includes(route.name) ? 'is-active' : ''}>Tools</Link>
        </nav>

        <div className="header__spacer"/>

        <div className="header__search">
          <Icon.search size={16}/>
          <input
            placeholder='Search "boat market", "rooftop bar"…'
            onKeyDown={(e) => { if (e.key === 'Enter') navigate('#/map?q=' + encodeURIComponent(e.currentTarget.value)); }}
          />
        </div>

        <div className="header__city">
          <select className="select" value={city} onChange={e => setCity(e.target.value)} style={{ padding: '8px 12px', fontSize: 13, borderRadius: 999, background: 'var(--bg-card)' }}>
            {CITIES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>

        <div className="header__actions">
          <Link to="#/map" className="btn btn-sq btn-ghost only-mobile" aria-label="Search">
            <Icon.search size={18}/>
          </Link>
          {auth.signedIn ? (
            <ProfileMenu auth={auth}/>
          ) : (
            <>
              <Link to="#/signin" className="btn inline-only-tablet-up" style={{ background: 'transparent', boxShadow: 'none' }}>Sign in</Link>
              <Link to="#/signin" className="btn btn-primary inline-only-desktop">Get the local edge</Link>
            </>
          )}
          <button className="btn btn-sq btn-ghost only-mobile" aria-label="Menu" onClick={onMenu}>
            <Icon.menu size={20}/>
          </button>
        </div>
      </div>
    </header>
  );
}

function ProfileMenu({ auth }) {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!open) return;
    const close = (e) => { if (!e.target.closest('[data-profile]')) setOpen(false); };
    document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, [open]);

  const menuRow = { display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', borderRadius: 10, fontSize: 13.5, color: 'var(--text)' };

  return (
    <div data-profile style={{ position: 'relative' }}>
      <button onClick={() => setOpen(o => !o)} className="btn btn-sq" aria-label="Profile" style={{ background: 'var(--bg-deep)', color: 'var(--text-on-deep)', boxShadow: 'none' }}>
        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 13 }}>SK</span>
      </button>
      {open && (
        <div style={{
          position: 'absolute', right: 0, top: 'calc(100% + 8px)', zIndex: 50,
          background: 'var(--bg-card)', borderRadius: 14, boxShadow: 'var(--shadow-lg)',
          minWidth: 220, padding: 8, border: '1px solid var(--line)',
        }}>
          <div style={{ padding: '10px 12px 12px', borderBottom: '1px solid var(--line)' }}>
            <div style={{ fontWeight: 600, fontSize: 14 }}>Sai K.</div>
            <div style={{ color: 'var(--muted)', fontSize: 12 }}>sai@example.com</div>
          </div>
          <Link to="#/saved" style={menuRow}><Icon.bookmark size={16}/> Saved places</Link>
          <Link to="#/account" style={menuRow}><Icon.user size={16}/> Recently viewed</Link>
          <Link to="#/submit-place" style={menuRow}><Icon.plus size={16}/> Submit a place</Link>
          <Link to="#/account" style={menuRow}><Icon.sliders size={16}/> Account & settings</Link>
          <div style={{ borderTop: '1px solid var(--line)', margin: '6px -8px 0' }}/>
          <button onClick={() => { auth.signOut(); setOpen(false); }} style={{ ...menuRow, width: '100%', border: 0, background: 'transparent', textAlign: 'left', cursor: 'pointer' }}>Sign out</button>
        </div>
      )}
    </div>
  );
}

export function MobileDrawer({ open, onClose, auth, city, setCity }) {
  return (
    <>
      <div className={'drawer-bg' + (open ? ' is-open' : '')} onClick={onClose}/>
      <div className={'drawer' + (open ? ' is-open' : '')}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
          <div className="header__brand">
            <img src="/logo.png" alt="" style={{ width: 30, height: 30, borderRadius: 8 }}/>
            <span>Inside Thailand</span>
          </div>
          <button className="btn btn-sq btn-ghost" onClick={onClose} aria-label="Close"><Icon.x size={20}/></button>
        </div>

        <div className="field" style={{ marginBottom: 20 }}>
          <label>City</label>
          <select className="select" value={city} onChange={e => setCity(e.target.value)}>
            {CITIES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 2, marginBottom: 18 }}>
          <DrawerLink to="#/map"    icon={<Icon.map size={18}/>} onClose={onClose}>Map</DrawerLink>
          <DrawerLink to="#/city/bangkok" icon={<Icon.compass size={18}/>} onClose={onClose}>Explore Bangkok</DrawerLink>
          <DrawerLink to="#/city/phuket" icon={<Icon.beach size={18}/>} onClose={onClose}>Phuket guide</DrawerLink>
          <DrawerLink to="#/guides" icon={<Icon.book size={18}/>} onClose={onClose}>Practical guides</DrawerLink>
          <DrawerLink to="#/transport" icon={<Icon.train size={18}/>} onClose={onClose}>Transport (BTS / MRT)</DrawerLink>
          <DrawerLink to="#/tools"  icon={<Icon.sliders size={18}/>} onClose={onClose}>Tourist tools</DrawerLink>
          <DrawerLink to="#/tools/scams" icon={<Icon.shield size={18}/>} onClose={onClose}>Scam detector</DrawerLink>
          <DrawerLink to="#/tools/prices" icon={<Icon.tag size={18}/>} onClose={onClose}>Price checker</DrawerLink>
          <DrawerLink to="#/saved"  icon={<Icon.bookmark size={18}/>} onClose={onClose}>Saved places</DrawerLink>
          <DrawerLink to="#/submit-place" icon={<Icon.plus size={18}/>} onClose={onClose}>Submit a place</DrawerLink>
        </div>

        {auth.signedIn ? (
          <button onClick={() => { auth.signOut(); onClose(); }} className="btn" style={{ width: '100%' }}>Sign out</button>
        ) : (
          <Link to="#/signin" onClick={onClose} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>Sign in</Link>
        )}
      </div>
    </>
  );
}

function DrawerLink({ to, icon, onClose, children }) {
  return (
    <Link to={to} onClick={onClose} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 8px', borderRadius: 10, fontSize: 15, color: 'var(--text)' }}>
      <span style={{ color: 'var(--muted)' }}>{icon}</span>
      {children}
    </Link>
  );
}

export function MobileBottomNav({ route }) {
  const is = (...names) => names.some(n => n === route.name);
  return (
    <nav className="bottomnav">
      <Link to="#/home"   className={is('home') ? 'is-active' : ''}><Icon.compass size={22}/><span>Explore</span></Link>
      <Link to="#/map"    className={is('map','place') ? 'is-active' : ''}><Icon.map size={22}/><span>Map</span></Link>
      <Link to="#/guides" className={is('guides','guide','transport') ? 'is-active' : ''}><Icon.book size={22}/><span>Guides</span></Link>
      <Link to="#/tools"  className={is('tools','tools-scams','tools-prices','tools-phrasebook','tools-emergency','tools-sim') ? 'is-active' : ''}><Icon.shield size={22}/><span>Tools</span></Link>
      <Link to="#/saved"  className={is('saved','account','submit') ? 'is-active' : ''}><Icon.bookmark size={22}/><span>Saved</span></Link>
    </nav>
  );
}

export function Footer() {
  return (
    <footer className="footer">
      <div className="wrap" style={{ display: 'grid', gap: 32, gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
        <div>
          <div className="header__brand" style={{ color: 'var(--text-on-deep)', marginBottom: 12 }}>
            <img src="/logo.png" alt="" style={{ width: 32, height: 32, borderRadius: 9 }}/>
            <span>Inside Thailand</span>
          </div>
          <p style={{ fontSize: 13, color: 'rgba(245,238,220,.6)', maxWidth: 280, lineHeight: 1.5 }}>
            A discovery hub for Thailand, built by people who actually live here.
          </p>
        </div>
        <div>
          <h4>Explore</h4>
          <Link to="#/map">Map</Link>
          <Link to="#/city/bangkok">Bangkok</Link>
          <Link to="#/city/phuket">Phuket</Link>
          <Link to="#/category/street-food">Street food</Link>
          <Link to="#/category/temples">Temples</Link>
        </div>
        <div>
          <h4>Practical</h4>
          <Link to="#/guides">All guides</Link>
          <Link to="#/transport">Transport</Link>
          <Link to="#/tools/scams">Scam detector</Link>
          <Link to="#/tools/prices">Price checker</Link>
          <Link to="#/tools/emergency">Emergency numbers</Link>
        </div>
        <div>
          <h4>Contribute</h4>
          <Link to="#/submit-place">Submit a place</Link>
          <Link to="#/account">My contributions</Link>
          <Link to="#/saved">Saved places</Link>
        </div>
        <div>
          <h4>About</h4>
          <Link to="#/home">About us</Link>
          <Link to="#/home">Editorial standards</Link>
          <Link to="#/home">Contact</Link>
          <Link to="#/home">Press</Link>
        </div>
      </div>
      <div className="wrap footer__bottom">
        <div>© 2026 Inside Thailand Explorer · Made in Bangkok</div>
        <div style={{ display: 'flex', gap: 18 }}>
          <Link to="#/home">Privacy</Link>
          <Link to="#/home">Terms</Link>
        </div>
      </div>
    </footer>
  );
}
