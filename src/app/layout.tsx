'use client' // Lo convertimos a Client Component para usar el hook
import { usePathname } from 'next/navigation'
import { GoogleOAuthProvider } from '@react-oauth/google'
import "./globals.css"
import Sidebar from '@/components/ui/Sidebar'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isLoginPage = pathname === '/login'

  return (
    <html lang="es">
      <body className="flex">
        {/* Envolvemos TODA la app con el Provider de Google */}
        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
          {!isLoginPage && <Sidebar />}
          <main className={`${!isLoginPage ? 'ml-64' : ''} w-full min-h-screen bg-slate-50`}>
            {children}
          </main>
        </GoogleOAuthProvider>
      </body>
    </html>
  )
}