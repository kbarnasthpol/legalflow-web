'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import api from '../../../../lib/axios'
import PrimaryButton from '@/components/ui/PrimaryButton'

export default function NuevoClientePage() {
  const router = useRouter()
  
  // Agrupamos todo en un solo objeto, igual que tu Struct de Go
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    dni: '',
    email: '',
    telefono: '',
    direccion: '',
    clasificacion: 'Consulta' // Valor por defecto
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      // Mandamos el objeto completo a Go
      await api.post('/clientes', formData)
      // Al guardar con éxito:
      alert("Cliente guardado con éxito");
      router.push('/dashboard'); // Rediriges
      router.refresh(); // <-- ESTA LÍNEA es la clave para que Next.js limpie la caché
    } catch (error) {
      console.error(error)
      alert('Error al crear cliente. Revisa los datos.')
    }
  }

  // Esta función es una "plantilla" para actualizar cualquier campo
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData, // Mantenemos lo que ya estaba escrito
      [e.target.name]: e.target.value // Actualizamos solo el campo que cambió
    })
  }

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white shadow rounded-lg text-black">
      <h1 className="text-2xl font-bold mb-6">Registrar Nuevo Cliente</h1>
      
      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
        <div className="flex flex-col">
          <label className="text-sm font-semibold">Nombre</label>
          <input name="nombre" required onChange={handleChange} className="border p-2 rounded" />
        </div>
        
        <div className="flex flex-col">
          <label className="text-sm font-semibold">Apellido</label>
          <input name="apellido" required onChange={handleChange} className="border p-2 rounded" />
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-semibold">DNI</label>
          <input name="dni" required onChange={handleChange} className="border p-2 rounded" />
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-semibold">Email</label>
          <input name="email" type="email" required onChange={handleChange} className="border p-2 rounded" />
        </div>

        <div className="flex flex-col col-span-2">
          <label className="text-sm font-semibold">Teléfono</label>
          <input name="telefono" required onChange={handleChange} className="border p-2 rounded" />
        </div>

        <div className="flex flex-col col-span-2">
          <label className="text-sm font-semibold">Clasificación</label>
          <select name="clasificacion" onChange={handleChange} className="border p-2 rounded bg-white">
            <option value="Consulta Unica">Consulta Única</option>
            <option value="VIP">VIP</option>
            <option value="Moroso">Moroso</option>
          </select>
        </div>

        <PrimaryButton>
          GUARDAR CLIENTE NUEVO
        </PrimaryButton>
      </form>
    </div>
  )
}