'use client'

import { useState, useEffect, useRef } from 'react'
import I from './icons'

interface Props {
  title: string
  url?: string
}

function enc(s: string) { return encodeURIComponent(s) }

const PLATFORMS = [
  {
    id: 'whatsapp',
    label: 'WhatsApp',
    bg: '#25D366',
    href: (u: string, t: string) => `https://wa.me/?text=${enc(t + '\n' + u)}`,
    icon: (
      <svg viewBox="0 0 24 24" width={17} height={17} fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884M20.52 3.449C18.24 1.245 15.24 0 12.045 0 5.463 0 .104 5.359.101 11.955A11.96 11.96 0 0 0 1.805 16.8L0 24l7.539-1.98A11.96 11.96 0 0 0 12.048 24c6.584 0 11.944-5.36 11.947-11.956a11.93 11.93 0 0 0-3.476-8.595"/>
      </svg>
    ),
  },
  {
    id: 'line',
    label: 'LINE',
    bg: '#00B900',
    href: (u: string) => `https://social-plugins.line.me/lineit/share?url=${enc(u)}`,
    icon: (
      <svg viewBox="0 0 24 24" width={17} height={17} fill="currentColor">
        <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63h2.386c.349 0 .63.285.63.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63.349 0 .631.285.631.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.281.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.07 9.436-6.975C23.176 14.393 24 12.458 24 10.314"/>
      </svg>
    ),
  },
  {
    id: 'x',
    label: 'X',
    bg: '#000',
    href: (u: string, t: string) => `https://twitter.com/intent/tweet?text=${enc(t)}&url=${enc(u)}`,
    icon: (
      <svg viewBox="0 0 24 24" width={17} height={17} fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
  },
  {
    id: 'facebook',
    label: 'Facebook',
    bg: '#1877F2',
    href: (u: string) => `https://www.facebook.com/sharer/sharer.php?u=${enc(u)}`,
    icon: (
      <svg viewBox="0 0 24 24" width={17} height={17} fill="currentColor">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    ),
  },
  {
    id: 'telegram',
    label: 'Telegram',
    bg: '#229ED9',
    href: (u: string, t: string) => `https://t.me/share/url?url=${enc(u)}&text=${enc(t)}`,
    icon: (
      <svg viewBox="0 0 24 24" width={17} height={17} fill="currentColor">
        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.96 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
      </svg>
    ),
  },
]

export function ShareButton({ title, url }: Props) {
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const [canNative, setCanNative] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setCanNative(typeof navigator !== 'undefined' && !!navigator.share)
  }, [])

  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  const shareUrl = url ?? (typeof window !== 'undefined' ? window.location.href : '')

  const handleNative = () => {
    navigator.share({ title, url: shareUrl }).catch(() => {})
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch { /* clipboard unavailable */ }
  }

  if (canNative) {
    return (
      <button className="btn btn-lg" onClick={handleNative}>
        <I.share size={16}/> Share
      </button>
    )
  }

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button className="btn btn-lg" onClick={() => setOpen(o => !o)}>
        <I.share size={16}/> Share
      </button>
      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 8px)', left: 0, zIndex: 20,
          background: 'var(--bg-card)', borderRadius: 14, padding: 14,
          boxShadow: 'var(--shadow-lg, var(--shadow))', width: 230,
          border: '1px solid var(--line)',
          display: 'flex', flexDirection: 'column', gap: 10,
        }}>
          <div className="mono" style={{ fontSize: 11 }}>Share this place</div>
          <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap' }}>
            {PLATFORMS.map(({ id, label, bg, href, icon }) => (
              <a
                key={id}
                href={href(shareUrl, title)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                title={label}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  width: 36, height: 36, borderRadius: 10,
                  background: bg, color: '#fff',
                  textDecoration: 'none', flexShrink: 0,
                }}
              >
                {icon}
              </a>
            ))}
          </div>
          <button
            onClick={handleCopy}
            style={{
              display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px',
              background: copied ? '#2D6A4F12' : 'var(--bg-2)',
              borderRadius: 8, border: '1px solid var(--line)',
              cursor: 'pointer', color: copied ? '#2D6A4F' : 'var(--text)',
              fontSize: 12.5, fontFamily: 'inherit', width: '100%',
            }}
          >
            <I.link size={14}/>
            {copied ? 'Link copied!' : 'Copy link'}
          </button>
        </div>
      )}
    </div>
  )
}
