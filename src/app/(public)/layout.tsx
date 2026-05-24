import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { MobileBottomNav } from '@/components/layout/MobileBottomNav'
import { MobileDrawer } from '@/components/layout/MobileDrawer'
import { AuthProvider } from '@/components/AuthProvider'

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <Header/>
      {children}
      <Footer/>
      <MobileBottomNav/>
      <MobileDrawer/>
    </AuthProvider>
  )
}
