'use client'
import { useEffect, useState } from 'react'
import api from '@/lib/axios'
import { useRouter } from 'next/navigation'
import Button from '@/components/ui/Button'
import { 
  Search, 
  UserPlus, 
  Mail, 
  Phone, 
  CreditCard, 
  FolderOpen, 
  MoreVertical 
} from 'lucide-react'

interface Cliente {
  id: string;
  nombre: string;
  apellido: string;
  dni: string;
  email: string;
  telefono: string;
  clasificacion: string;
}

export default function ClientesPage() {
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [busqueda, setBusqueda] = useState('')
  const router = useRouter()

  useEffect(() => {
    const cargarClientes = async () => {
      try {
        const res = await api.get('/clientes')
        setClientes(res.data)
      } catch (error) {
        console.error("Error cargando clientes:", error)
      }
    }
    cargarClientes()
  }, [])

  // Lógica de búsqueda en tiempo real
  const clientesFiltrados = clientes.filter(c => 
    `${c.nombre} ${c.apellido}`.toLowerCase().includes(busqueda.toLowerCase()) ||
    c.dni.includes(busqueda)
  )

  return (
    <div className="p-8 bg-legal min-h-screen font-lexend">
      {/* Encabezado con Acción Principal */}
      <div className="flex justify-between items-center px-6 py-8 mb-8 border-5 border-azul bg-azul/90 rounded-xl min-h-[140px]">
              <div className='flex flex-col justify-center gap-2 text-center'>
                <h1 className="text-4xl font-bold text-esmeralda uppercase tracking-tighter">MIS CLIENTES</h1>
                <p className="text-beige font-medium">Administración de legajos y contactos</p>
              </div>
              <Button 
                variant="primary" className="hover:scale-[1.05] border-3 border-esmeralda hover:border-transparent"
                onClick={() => router.push('/dashboard/clientes/nuevo')}
              >
                + NUEVO CLIENTE
              </Button>
            </div>

      {/* Barra de Búsqueda Inteligente */}
      <div className="relative mb-8 max-w-2xl">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-azul/40" size={20} />
        <input 
          type="text"
          placeholder="Buscar por nombre, apellido o DNI..."
          className="w-full pl-12 pr-4 py-4 bg-white/80 backdrop-blur-sm text-azul rounded-2xl border-2 border-azul/10 focus:border-dorado outline-none shadow-sm transition-all focus:scale-[1.05]"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
      </div>

      {/* Grilla de Clientes (Cards con estilo de legajo) */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {clientesFiltrados.length === 0 ? (
          <div className="col-span-full py-20 text-center bg-white/50 rounded-3xl border-2 border-dashed border-azul/20">
            <p className="text-azul/50 font-medium italic">No se encontraron clientes que coincidan con la búsqueda.</p>
          </div>
        ) : (
          clientesFiltrados.map((cliente) => (
            <div 
              key={cliente.id} 
              className="bg-white rounded-3xl p-6 shadow-sm border border-azul/5 hover:shadow-xl hover:border-dorado/30 transition-all group relative overflow-hidden"
            >
              {/* Indicador de Clasificación */}
              <div className={`absolute top-0 right-0 px-6 py-2 rounded-bl-2xl text-[10px] font-black uppercase ${
                cliente.clasificacion === 'Moroso' ? 'bg-coral text-white' : 
                cliente.clasificacion === 'VIP' ? 'bg-dorado text-azul' : 'bg-esmeralda text-white'
              }`}>
                {cliente.clasificacion}
              </div>

              <div className="flex items-start gap-4 mb-6">
                <div className="bg-azul text-beige w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-xl shadow-inner">
                  {cliente.nombre[0]}{cliente.apellido[0]}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-azul leading-tight">{cliente.nombre} {cliente.apellido}</h3>
                  <p className="text-sm text-azul/50 font-bold tracking-widest">DNI {cliente.dni}</p>
                </div>
              </div>

              <div className="space-y-2 mb-8">
                <div className="flex items-center gap-3 text-azul/70 text-sm">
                  <Mail size={16} className="text-dorado" />
                  <span className="truncate">{cliente.email}</span>
                </div>
                <div className="flex items-center gap-3 text-azul/70 text-sm">
                  <Phone size={16} className="text-dorado" />
                  <span>{cliente.telefono}</span>
                </div>
              </div>

              {/* Botones de Acción Rápida */}
              <div className="flex gap-2 pt-4 border-t border-azul/5">
                <button 
                  onClick={() => router.push(`/dashboard/casos?clienteId=${cliente.id}`)}
                  className="flex-1 flex items-center justify-center gap-2 py-2 bg-azul text-beige rounded-xl hover:bg-dorado hover:text-azul transition-colors text-xs font-bold uppercase hover:border-azul/50 border-2"
                >
                  <FolderOpen size={14} /> Expedientes
                </button>
                <button 
                  onClick={() => router.push(`/dashboard/pagos?clienteId=${cliente.id}`)}
                  className="flex-1 flex items-center justify-center gap-2 py-2 border-2 border-azul/50 text-azul rounded-xl hover:bg-dorado hover:text-azul transition-all text-xs font-bold uppercase"
                >
                  <CreditCard size={14} /> Pagos
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}