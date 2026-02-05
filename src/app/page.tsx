'use client' // Le dice a Next.js que esto tiene interacción del usuario

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import api from '../lib/axios' // El puente que creamos recién

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
      <div className="bg-white p-8 rounded-lg shadow-md w-96 text-black">
        <h1 className="text-2xl font-bold mb-6">LegalFlow Login</h1>
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input 
            type="email" 
            placeholder="Email" 
            className="border p-2 rounded text-black"
            onChange={(e) => setEmail(e.target.value)} // Captura lo que escribís
          />
          <input 
            type="password" 
            placeholder="Contraseña" 
            className="border p-2 rounded text-black"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
            Entrar
          </button>
        </form>
      </div>
    </main>
  )
}