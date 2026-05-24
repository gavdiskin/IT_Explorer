import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Price Checker — Inside Thailand',
  description: 'What you should pay in Thailand — taxi fares, pad thai, massage, beer. Know the local price before you get charged tourist rates.',
}

export default function PricesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
