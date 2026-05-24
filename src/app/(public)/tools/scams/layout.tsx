import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Scam Detector — Inside Thailand',
  description: 'Know the scam before it happens — tuk-tuk gem tours, jet ski damage, taxi meter refusals, ping-pong show overcharging and more.',
}

export default function ScamsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
