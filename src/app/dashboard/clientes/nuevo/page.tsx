'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import api from '@/lib/axios' // Usamos el alias @ para que sea más limpio
import Button from '@/components/ui/Button'
import { UserPlus, ArrowLeft } from 'lucide-react'

export default function NuevoClientePage() {
  const router = useRouter()
  
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    dni: '',
    email: '',
    telefono: '',
    direccion: '',
    clasificacion: 'Consulta Unica'
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await api.post('/clientes', formData)
      // En lugar de alert, podrías usar un toast después, pero por ahora mantenemos tu lógica
      alert("Cliente guardado con éxito");
      router.push('/dashboard/clientes'); // Te sugiero redirigir a la LISTA de clientes
      router.refresh();
    } catch (error) {
      console.error(error)
      alert('Error al crear cliente. Revisa los datos.')
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="p-8 bg-beige min-h-screen">
      {/* Botón Volver */}
      <button 
        onClick={() => router.back()}
        className="flex items-center gap-2 text-azul hover:text-coral font-bold mb-6 transition-colors uppercase text-sm hover:translate-x-[-5px]"
      >
        <ArrowLeft size={20} /> Volver
      </button>

      <div className="max-w-2xl mx-auto bg-azul p-8 shadow-2xl rounded-2xl border border-dorado/20 text-beige">
        <div className="flex items-center gap-3 mb-8 border-b border-dorado/30 pb-4 justify-center">
          <h1 className="text-3xl font-bold uppercase tracking-tighter">Registrar Nuevo Cliente</h1>
        </div>
        
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase text-dorado">Nombre</label>
            <input 
              name="nombre" 
              required 
              onChange={handleChange} 
              className="bg-gris/10 border border-beige/30 p-3 rounded-xl focus:outline-none focus:border-dorado focus:scale-[1.02] active:scale-[0.99] transition-colors text-beige " 
              placeholder="Ej: Juan"
            />
          </div>
          
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase text-dorado">Apellido</label>
            <input 
              name="apellido" 
              required 
              onChange={handleChange} 
              className="bg-gris/10 border border-beige/30 p-3 rounded-xl focus:outline-none focus:border-dorado focus:scale-[1.02] active:scale-[0.99] transition-colors text-beige" 
              placeholder="Ej: Pérez"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase text-dorado">DNI</label>
            <input 
              name="dni" 
              required 
              onChange={handleChange}
              placeholder="Ej: 12345678"
              className="bg-gris/10 border border-beige/30 p-3 rounded-xl focus:outline-none focus:border-dorado focus:scale-[1.02] active:scale-[0.99] transition-colors text-beige" 
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase text-dorado">Email</label>
            <input 
              name="email" 
              type="email" 
              required 
              onChange={handleChange} 
              className="bg-gris/10 border border-beige/30 p-3 rounded-xl focus:outline-none focus:border-dorado focus:scale-[1.02] active:scale-[0.99] transition-colors text-beige" 
              placeholder="Ej: ejemplo@gmail.com.ar"
            />
          </div>

          <div className="flex flex-col col-span-2 gap-2">
            <label className="text-xs font-bold uppercase text-dorado">Teléfono</label>
            <input 
              name="telefono" 
              required 
              onChange={handleChange} 
              placeholder="Ej: +5492213144339"
              className="bg-gris/10 border border-beige/30 p-3 rounded-xl focus:outline-none focus:border-dorado focus:scale-[1.02] active:scale-[0.99] transition-colors text-beige" 
            />
          </div>

          <div className="flex flex-col col-span-2 gap-2">
            <label className="text-xs font-bold uppercase text-dorado">Clasificación</label>
            <select 
              name="clasificacion" 
              onChange={handleChange} 
              className="bg-gris/10 border border-beige/30 p-3 rounded-xl focus:outline-none focus:border-dorado focus:scale-[1.02] active:scale-[0.99] transition-colors text-beige cursor-pointer appearance-none"
            >
              <option value="Consulta Unica" className="bg-azul">Consulta Única</option>
              <option value="VIP" className="bg-azul text-dorado">VIP</option>
              <option value="Moroso" className="bg-azul text-coral">Moroso</option>
            </select>
          </div>

          <div className="col-span-2 mt-4">
            <Button
  variant="success"
  className="
    relative
    w-full
    py-4
    rounded-xl
    shadow-lg
    transition-all duration-200
    group
    flex items-center justify-center
    border border-transparent
    hover:scale-[1.02] active:scale-[0.99]
  "
>
  {/* TEXTO centrado real */}
  <span className="uppercase tracking-wider">
    GUARDAR CLIENTE NUEVO
  </span>

  {/* ICONO a la derecha */}
  <UserPlus
    size={26}
    className="
      absolute right-5
      animate-slide-x-soft
      opacity-0
      group-hover:opacity-100
      transition-opacity
    "
  />
</Button>
          </div>
        </form>
      </div>
    </div>
  )
}