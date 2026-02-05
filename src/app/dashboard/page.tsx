'use client'
import { useEffect, useState } from 'react'
import api from '../../lib/axios'
import { useRouter } from 'next/navigation' // Importamos el "conduce-páginas"
import PrimaryButton from '@/src/components/Button'

export default function DashboardPage() {
  const [clientes, setClientes] = useState([])
  const router = useRouter()

  useEffect(() => {
    // Función para traer datos de Go
    const fetchClientes = async () => {
      try {
        const response = await api.get('/clientes')
        setClientes(response.data)
      } catch (error) {
        console.error("Error cargando clientes", error)
      }
    }
    fetchClientes()
  }, [])
interface Cliente {
  id: string;
  nombre: string;
  apellido: string;
  dni: string;
  email: string;
  telefono: string;
  direccion?: string; // El '?' significa que es opcional
  clasificacion?: string;
  estudio_id: string;
  created_at: string;
  // No incluimos 'casos' aquí a menos que los necesites mostrar en la lista principal
}
  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-black">MIS CLIENTES</h1>
        
        {/* Este botón hace la magia */}
        <PrimaryButton
          onClick={() => router.push('/dashboard/clientes/nuevo')}>
          + AGREGAR CLIENTE NUEVO
        </PrimaryButton>
      </div>
      
      <div className="grid gap-4">
        {clientes.length === 0 ? (
          <p>No hay clientes para este estudio jurídico.</p>
        ) : (
          clientes.map((cliente: Cliente) => (
            <div key={cliente.id} className="p-4 border rounded shadow-sm bg-white text-black">
              <p className="font-bold">{cliente.nombre}</p>
              <p className="text-sm text-gray-600">DNI: {cliente.dni}</p>
            </div>
          ))
        )}
      </div>
    </div>
  )
}