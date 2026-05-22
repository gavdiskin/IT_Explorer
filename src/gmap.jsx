import Icon from './icons';
import { CATEGORIES } from './data';

export function GMap({ pins = [], selectedId, onSelect, city = 'bangkok', style }) {
  const palette = {
    land:    '#F5F1E9',
    landAlt: '#EBE6DA',
    water:   '#A8D6E2',
    waterLine: '#82BFCF',
    road:    '#FFFFFF',
    roadCase:'#E2D9C8',
    motorway:'#FFF1A8',
    motorwayCase: '#D9B83B',
    park:    '#C2D9B0',
    park2:   '#AFCE9A',
    label:   '#5C5247',
    labelHi: '#1B1816',
    poi:     '#9C8865',
    building:'rgba(60,52,42,.08)',
  };

  return (
    <div className="gmap" style={style}>
      <svg viewBox="0 0 1200 900" preserveAspectRatio="xMidYMid slice"
           width="100%" height="100%" style={{ display: 'block' }}>
        <rect x="0" y="0" width="1200" height="900" fill={palette.land}/>

        <path d="M -50 700 C 150 600 200 480 280 420 S 420 280 520 220 S 740 80 900 60 S 1180 -20 1300 -40"
              fill="none" stroke={palette.water} strokeWidth="44" strokeLinecap="round"/>
        <path d="M -50 700 C 150 600 200 480 280 420 S 420 280 520 220 S 740 80 900 60 S 1180 -20 1300 -40"
              fill="none" stroke={palette.waterLine} strokeWidth="2"/>

        <g stroke={palette.water} strokeWidth="14" fill="none" strokeLinecap="round" opacity=".82">
          <path d="M 60 400 C 200 380 380 460 600 460 S 980 480 1200 460"/>
          <path d="M 200 800 C 360 780 540 720 700 740"/>
        </g>

        <g>
          <path d="M 760 380 q -30 -30 0 -80 q 80 -40 160 -10 q 60 30 30 90 q -40 80 -110 70 q -50 -10 -80 -70 z" fill={palette.park}/>
          <path d="M 920 340 q 30 -20 70 -10 q 30 30 0 60 q -40 30 -70 0 q -30 -30 0 -50z" fill={palette.park2}/>
          <rect x="220" y="160" width="120" height="80" rx="14" fill={palette.park}/>
          <rect x="1020" y="660" width="160" height="120" rx="20" fill={palette.park}/>
        </g>

        <g>
          <path d="M -50 540 C 240 510 460 500 720 480 S 980 460 1300 420" stroke={palette.motorwayCase} strokeWidth="22" fill="none" strokeLinecap="round"/>
          <path d="M -50 540 C 240 510 460 500 720 480 S 980 460 1300 420" stroke={palette.motorway} strokeWidth="14" fill="none" strokeLinecap="round"/>
          <path d="M 600 -50 C 620 200 650 480 700 900" stroke={palette.motorwayCase} strokeWidth="22" fill="none" strokeLinecap="round"/>
          <path d="M 600 -50 C 620 200 650 480 700 900" stroke={palette.motorway} strokeWidth="14" fill="none" strokeLinecap="round"/>
        </g>

        <g>
          <g stroke={palette.roadCase} strokeWidth="16" fill="none" strokeLinecap="round">
            <path d="M -20 320 C 240 300 480 280 760 270 S 1100 250 1240 240"/>
            <path d="M -20 620 C 240 610 480 600 760 590 S 1100 580 1240 570"/>
            <path d="M 340 -20 C 360 200 380 480 400 920"/>
            <path d="M 900 -20 C 910 220 920 500 940 920"/>
          </g>
          <g stroke={palette.road} strokeWidth="9" fill="none" strokeLinecap="round">
            <path d="M -20 320 C 240 300 480 280 760 270 S 1100 250 1240 240"/>
            <path d="M -20 620 C 240 610 480 600 760 590 S 1100 580 1240 570"/>
            <path d="M 340 -20 C 360 200 380 480 400 920"/>
            <path d="M 900 -20 C 910 220 920 500 940 920"/>
          </g>
        </g>

        <g stroke={palette.road} strokeWidth="5" fill="none" opacity=".8">
          <path d="M -20 180 C 200 175 460 170 740 165 S 1100 158 1240 155"/>
          <path d="M -20 440 C 200 432 460 422 740 414 S 1100 405 1240 400"/>
          <path d="M -20 760 C 200 753 460 743 740 736 S 1100 728 1240 724"/>
          <path d="M 180 -20 C 180 200 180 600 180 920"/>
          <path d="M 540 -20 C 540 200 540 600 540 920"/>
          <path d="M 720 -20 C 720 200 720 600 720 920"/>
          <path d="M 1080 -20 C 1080 200 1080 600 1080 920"/>
        </g>

        <g fill={palette.building}>
          <rect x="50"  y="200" width="80" height="60" rx="3"/>
          <rect x="150" y="200" width="60" height="60" rx="3"/>
          <rect x="240" y="270" width="80" height="60" rx="3"/>
          <rect x="60"  y="350" width="100" height="60" rx="3"/>
          <rect x="180" y="350" width="70" height="60" rx="3"/>
          <rect x="450" y="170" width="60" height="60" rx="3"/>
          <rect x="540" y="190" width="80" height="60" rx="3"/>
          <rect x="640" y="200" width="50" height="60" rx="3"/>
          <rect x="450" y="650" width="80" height="60" rx="3"/>
          <rect x="540" y="650" width="80" height="60" rx="3"/>
          <rect x="640" y="650" width="70" height="60" rx="3"/>
          <rect x="780" y="650" width="80" height="60" rx="3"/>
          <rect x="940" y="170" width="60" height="60" rx="3"/>
          <rect x="1020" y="200" width="80" height="60" rx="3"/>
        </g>

        <g fill={palette.label} fontFamily='"Geist", system-ui, sans-serif' fontWeight="500">
          <text x="180" y="120" fontSize="13">SIAM SQUARE</text>
          <text x="420" y="110" fontSize="13">RATTANAKOSIN</text>
          <text x="780" y="160" fontSize="13">SUKHUMVIT</text>
          <text x="180" y="500" fontSize="13">SILOM</text>
          <text x="580" y="500" fontSize="13">LUMPINI</text>
          <text x="900" y="540" fontSize="13">THONG LOR</text>
          <text x="220" y="780" fontSize="13">SATHORN</text>
          <text x="680" y="800" fontSize="13">KHLONG TOEI</text>
        </g>

        <g fill="#3A5A2A" fontFamily='"Geist", system-ui, sans-serif' fontSize="11" fontWeight="500">
          <text x="800" y="390">LUMPINI PARK</text>
          <text x="240" y="200">BENJAKITI</text>
          <text x="1040" y="700">BENJASIRI</text>
        </g>

        <g fill="#3A6E80" fontFamily='"Geist", serif' fontSize="13" fontStyle="italic">
          <text x="500" y="280" transform="rotate(-26 500 280)">Chao Phraya River</text>
        </g>

        <g transform="translate(60, 60)" fill={palette.label}>
          <circle cx="0" cy="0" r="14" fill="#fff" stroke={palette.roadCase} strokeWidth="1"/>
          <path d="M 0 -10 L 4 0 L 0 10 L -4 0 z" fill="#C13D2F"/>
          <text x="0" y="-18" fontSize="9" textAnchor="middle">N</text>
        </g>
      </svg>

      {pins.map(p => {
        const cat = CATEGORIES.find(c => c.id === p.category) || {};
        const Ic  = Icon[cat.icon] || Icon.dot;
        const sel = selectedId === p.id;
        return (
          <button key={p.id} onClick={() => onSelect && onSelect(p)} style={{
            position: 'absolute',
            left: `${p.coords?.[0] ?? 50}%`,
            top:  `${p.coords?.[1] ?? 50}%`,
            transform: `translate(-50%, -100%) ${sel ? 'scale(1.15)' : ''}`,
            border: 0, background: 'transparent', padding: 0, cursor: 'pointer',
            zIndex: sel ? 4 : 3, transition: 'transform .18s',
            filter: sel ? 'drop-shadow(0 4px 10px rgba(0,0,0,.3))' : 'drop-shadow(0 2px 4px rgba(0,0,0,.25))',
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: '50% 50% 50% 0',
              transform: 'rotate(-45deg)',
              background: cat.accent || '#C13D2F',
              border: '2px solid #fff',
              display: 'grid', placeItems: 'center',
            }}>
              <span style={{ transform: 'rotate(45deg)', color: '#fff', display: 'grid', placeItems: 'center' }}>
                {Ic ? <Ic size={16} stroke={2.2}/> : null}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
