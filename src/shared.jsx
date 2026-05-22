import { Link } from './router';
import Icon from './icons';
import { CATEGORIES } from './data';

export function Slot({ tone = 'clay', label, sub, tag, h, aspect = '4/3', children, style, className = '' }) {
  const cls = `slot slot-${tone} ${className}`;
  return (
    <div className={cls} style={{ height: h, aspectRatio: h ? undefined : aspect, ...style }}>
      {tag && <span className="slot__tag">{tag}</span>}
      <div className="slot__caption">Image slot</div>
      <div className="slot__label">{label}</div>
      {sub && <div className="slot__sub">{sub}</div>}
      {children}
    </div>
  );
}

export function PriceMark({ n = 1 }) {
  return (
    <span className="mono" style={{ color: 'var(--muted)', textTransform: 'none', letterSpacing: '.04em', fontSize: 11 }}>
      <span style={{ color: 'var(--text)' }}>{'฿'.repeat(n)}</span>
      <span style={{ color: 'var(--line-2)' }}>{'฿'.repeat(4 - n)}</span>
    </span>
  );
}

export function StarRating({ value = 4.5, reviews }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 12.5 }}>
      <Icon.star size={13}/>
      <span style={{ fontWeight: 700 }}>{value.toFixed(1)}</span>
      {reviews != null && <span style={{ color: 'var(--muted)', fontWeight: 400 }}>({reviews.toLocaleString()})</span>}
    </span>
  );
}

export function PlaceCard({ place, compact, savedSet, onToggleSave }) {
  const cat = CATEGORIES.find(c => c.id === place.category);
  const saved = savedSet && savedSet.has(place.id);
  if (compact) {
    return (
      <Link to={`#/place/${place.id}`} className="card card-hov" style={{ display: 'flex', gap: 12, padding: 10, alignItems: 'center' }}>
        <Slot tone={place.slot.tone} label={place.slot.label.split(' ')[0]} h={64} style={{ width: 84, flexShrink: 0, padding: 8 }} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="place-card__title" style={{ fontSize: 14 }}>{place.name}</div>
          <div className="place-card__meta">{cat?.label} · {place.area}</div>
          <div className="place-card__row" style={{ marginTop: 5 }}>
            <StarRating value={place.rating}/>
            <span className="dot-sep"/>
            <PriceMark n={place.price}/>
            <span className="dot-sep"/>
            <span className={place.open ? 'badge-open' : 'badge-closed'}>{place.open ? 'Open' : 'Closed'}</span>
          </div>
        </div>
        {onToggleSave && (
          <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); onToggleSave(place.id); }} className="btn btn-sq btn-ghost" aria-label={saved ? 'Saved' : 'Save'} style={{ color: saved ? 'var(--brand)' : 'var(--muted)' }}>
            {saved ? <Icon.bookmarkFill size={18}/> : <Icon.bookmark size={18}/>}
          </button>
        )}
      </Link>
    );
  }
  return (
    <Link to={`#/place/${place.id}`} className="place-card">
      <Slot tone={place.slot.tone} label={place.slot.label} sub={place.slot.sub} h={170} tag={cat?.label} style={{ borderRadius: 0 }}/>
      <div className="place-card__body">
        <div className="place-card__title">{place.name}</div>
        <div className="place-card__meta">{place.area}{place.area && place.city && ' · '}{place.city === 'bangkok' ? 'Bangkok' : place.city === 'phuket' ? 'Phuket' : ''}</div>
        <div className="place-card__row">
          <StarRating value={place.rating} reviews={place.reviews}/>
          <span className="dot-sep"/>
          <PriceMark n={place.price}/>
          <span className="dot-sep"/>
          <span className={place.open ? 'badge-open' : 'badge-closed'}>{place.open ? 'Open' : 'Closed'}</span>
        </div>
      </div>
    </Link>
  );
}

export function CategoryTile({ category, big }) {
  const Ic = Icon[category.icon] || Icon.dot;
  return (
    <Link to={`#/category/${category.id}`} className="cat-tile" style={{ padding: big ? 18 : 14 }}>
      <div className="cat-tile__icon" style={{ background: category.accent + '18', color: category.accent }}>
        <Ic size={big ? 24 : 22}/>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, letterSpacing: '-.01em', fontSize: big ? 16 : 14.5 }}>
          {category.label}
        </div>
      </div>
      <Icon.chevR size={16} stroke={1.5}/>
    </Link>
  );
}

export function SectionHead({ kicker, title, subtitle, action }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
      <div style={{ flex: 1, minWidth: 200 }}>
        {kicker && <div className="mono" style={{ marginBottom: 4 }}>{kicker}</div>}
        <h2 className="h2" style={{ margin: 0 }}>{title}</h2>
        {subtitle && <div style={{ color: 'var(--muted)', fontSize: 14, marginTop: 4, maxWidth: 580 }}>{subtitle}</div>}
      </div>
      {action}
    </div>
  );
}
