import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Submit a Place — Inside Thailand',
  description: 'Know a great place in Bangkok or Phuket? Submit it for editor review and get credited on the listing.',
}

export default function SubmitLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
