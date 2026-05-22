import { useState, useEffect } from 'react';

function parseHash() {
  const raw = window.location.hash || '#/home';
  const path = raw.replace(/^#/, '');
  const [bare, queryStr = ''] = path.split('?');
  const parts = bare.split('/').filter(Boolean);
  const query = {};
  queryStr.split('&').filter(Boolean).forEach(p => {
    const [k, v = ''] = p.split('=');
    query[decodeURIComponent(k)] = decodeURIComponent(v);
  });
  return { path: bare || '/', parts, query, raw };
}

function match(parts, pattern) {
  const pp = pattern.split('/').filter(Boolean);
  if (pp.length !== parts.length) return null;
  const params = {};
  for (let i = 0; i < pp.length; i++) {
    if (pp[i].startsWith(':')) params[pp[i].slice(1)] = decodeURIComponent(parts[i]);
    else if (pp[i] !== parts[i]) return null;
  }
  return params;
}

function resolve(parts) {
  const table = [
    ['/',                    'home'],
    ['/home',                'home'],
    ['/map',                 'map'],
    ['/place/:id',           'place'],
    ['/category/:id',        'category'],
    ['/city/:id',            'city'],
    ['/station/:id',         'station'],
    ['/saved',               'saved'],
    ['/submit-place',        'submit'],
    ['/account',             'account'],
    ['/signin',              'signin'],
    ['/guides',              'guides'],
    ['/guides/:id',          'guide'],
    ['/transport',           'transport'],
    ['/tools',               'tools'],
    ['/tools/scams',         'tools-scams'],
    ['/tools/prices',        'tools-prices'],
    ['/tools/phrasebook',    'tools-phrasebook'],
    ['/tools/emergency',     'tools-emergency'],
    ['/tools/sim',           'tools-sim'],
  ];
  for (const [pat, name] of table) {
    const params = match(parts, pat);
    if (params) return { name, params };
  }
  return { name: '404', params: {} };
}

export function useRoute() {
  const [route, setRoute] = useState(() => {
    const p = parseHash();
    return { ...p, ...resolve(p.parts) };
  });
  useEffect(() => {
    const onHash = () => {
      const p = parseHash();
      setRoute({ ...p, ...resolve(p.parts) });
      window.scrollTo({ top: 0, behavior: 'instant' });
    };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);
  return route;
}

export function navigate(hashPath, { replace = false } = {}) {
  const target = hashPath.startsWith('#') ? hashPath : '#' + hashPath;
  if (replace) {
    history.replaceState(null, '', target);
    window.dispatchEvent(new HashChangeEvent('hashchange'));
  } else {
    window.location.hash = target.replace(/^#/, '');
  }
}

export function Link({ to, className, style, onClick, children, replace: rep, ...rest }) {
  const handle = (e) => {
    if (onClick) onClick(e);
    if (e.defaultPrevented) return;
    e.preventDefault();
    navigate(to, { replace: rep });
  };
  const href = to.startsWith('#') ? to : '#' + to;
  return (
    <a href={href} onClick={handle} className={className} style={style} {...rest}>{children}</a>
  );
}
