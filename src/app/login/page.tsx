'use client' // Le dice a Next.js que esto tiene interacción del usuario
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { useState } from 'react'
import { GoogleLogin } from '@react-oauth/google'
import { useRouter } from 'next/navigation'
import api from '@/lib/axios' // El puente que creamos recién

export default function LoginPage() {
  // En Go declararías: var email string
  // En React usamos "States":
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault() // Evita que la página se recargue
    
    try {
      // Mandamos el JSON al backend de Go
      const response = await api.post('/login', { email, password })
      
      // Si Go responde OK, guardamos el Token
      const token = response.data.token
      localStorage.setItem('token', token)
      
      router.push('/dashboard') //Lo mandamos al dashboard
    } catch (error) {
      alert('Error al iniciar sesión (credenciales incorrectas)')
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="bg-gris p-8 rounded-lg shadow-md w-96 text-black">
        <h1 className="text-beige text-2xl font-bold mb-6">LegalFlow</h1>
          <h1 className="text-beige text-2xl font-bold mb-6">LOGIN</h1>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <Input 
            type="email" 
            placeholder="Email" 
           className="border border-gris focus:border-beige focus:ring-1 focus:ring-beige outline-none p-2 rounded-md"
            onChange={(e) => setEmail(e.target.value)} // Captura lo que escribís
          />
          <Input 
            type="password" 
            placeholder="Contraseña" 
            className="border border-gris focus:border-beige focus:ring-1 focus:ring-beige outline-none p-2 rounded-md"
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button type="submit" variant='success'>Entrar</Button>
        </form>
        <div className="mt-6 flex flex-col items-center gap-4">
  <div className="flex items-center w-full gap-2">
    <hr className="flex-grow border-gris" />
    <span className="text-azul text-sm">O</span>
    <hr className="flex-grow border-gris" />
  </div>

  <GoogleLogin
    onSuccess={async (credentialResponse) => {
      try {
        const res = await api.post('/auth/google', {
          token: credentialResponse.credential 
        })
        
        localStorage.setItem('token', res.data.token)
        router.push('/dashboard')
      } catch (error) {
        alert('Error al autenticar con Google')
      }
    }}
    onError={() => {
      console.log('Login Failed')
    }}
    useOneTap // Esto muestra el popup flotante de Google, ¡queda muy pro!
  />
</div>
      </div>
    </main>
  )
}