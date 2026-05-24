import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sign In — Inside Thailand',
  description: 'Sign in to Inside Thailand to save places, submit new ones, and sync your list across devices.',
}

export default function SignInLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
