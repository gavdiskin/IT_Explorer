import Link from 'next/link'
import Image from 'next/image'

export function Footer() {
  return (
    <footer className="footer">
      <div className="wrap" style={{ display: 'grid', gap: 32, gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
        <div>
          <div className="header__brand" style={{ color: 'var(--text-on-deep)', marginBottom: 12 }}>
            <Image src="/logo.png" alt="Inside Thailand" width={32} height={32} style={{ borderRadius: 9 }}/>
            <span>Inside Thailand</span>
          </div>
          <p style={{ fontSize: 13, color: 'rgba(245,238,220,.6)', maxWidth: 280, lineHeight: 1.5 }}>
            A discovery hub for Thailand, built by people who actually live here.
          </p>
        </div>
        <div>
          <h4>Explore</h4>
          <Link href="/map">Map</Link>
          <Link href="/cities/bangkok">Bangkok</Link>
          <Link href="/cities/phuket">Phuket</Link>
          <Link href="/categories/street-food">Street food</Link>
          <Link href="/categories/temples">Temples</Link>
        </div>
        <div>
          <h4>Practical</h4>
          <Link href="/guides">All guides</Link>
          <Link href="/transport">Transport</Link>
          <Link href="/tools/scams">Scam detector</Link>
          <Link href="/tools/prices">Price checker</Link>
          <Link href="/tools/emergency">Emergency numbers</Link>
        </div>
        <div>
          <h4>Contribute</h4>
          <Link href="/submit">Submit a place</Link>
          <Link href="/account">My contributions</Link>
          <Link href="/saved">Saved places</Link>
        </div>
        <div>
          <h4>About</h4>
          <Link href="/">About us</Link>
          <Link href="/">Editorial standards</Link>
          <Link href="/">Contact</Link>
          <Link href="/">Press</Link>
        </div>
      </div>
      <div className="wrap footer__bottom">
        <div>© 2026 Inside Thailand Explorer · Made in Bangkok</div>
        <div style={{ display: 'flex', gap: 18 }}>
          <Link href="/">Privacy</Link>
          <Link href="/">Terms</Link>
        </div>
      </div>
    </footer>
  )
}
