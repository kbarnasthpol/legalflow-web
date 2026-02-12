'use client' // Lo convertimos a Client Component para usar el hook
import { usePathname } from 'next/navigation'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { Lexend } from 'next/font/google'; // Cambia Montserrat por la que elijas
import "./globals.css"
import Sidebar from '@/components/layout/Sidebar'

const myFont = Lexend({
  subsets: ['latin'],
  display: 'swap',
  // Cargamos los pesos: 300 (fino), 400 (normal), 600 (semibod), 700 (bold)
  weight: ['300', '400', '600', '700'],
  variable: '--font-primary', // Creamos una variable CSS
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isLoginPage = pathname === '/login'

  return (
    <html lang="es" className={myFont.variable}>
      <body className="flex">
        {/* Envolvemos TODA la app con el Provider de Google */}
        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
          {!isLoginPage && <Sidebar />}
          <main className={`${!isLoginPage ? 'ml-64' : ''} w-full min-h-screen bg-aqua-medio`}>
            {children}
          </main>
        </GoogleOAuthProvider>
      </body>
    </html>
  )
}