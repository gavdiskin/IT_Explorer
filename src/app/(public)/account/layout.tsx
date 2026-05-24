import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'My Account — Inside Thailand',
  description: 'Manage your contributions, saved places, and account settings.',
}

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
