import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="wrap route-mount" style={{ padding: '80px 0', textAlign: 'center' }}>
      <div className="mono">404</div>
      <h1 className="h1" style={{ marginTop: 10 }}>{"That page isn't here."}</h1>
      <Link href="/" className="btn btn-primary btn-lg" style={{ marginTop: 24 }}>Go home</Link>
    </main>
  )
}
