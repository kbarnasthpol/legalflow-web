'use client'
import { useEffect, useState } from 'react'
import api from '@/lib/axios'
import { useRouter } from 'next/navigation'
import Button from '@/components/ui/Button'
import { 
  Search, Briefcase, Plus, Calendar, Clock, 
  CreditCard, ExternalLink, User 
} from 'lucide-react'

// Interfaz alineada con tu Struct de Go + Relación de Cliente
interface Caso {
  id: string;
  titulo: string;
  descripcion: string;
  estado: string;
  fecha_inicio: string;
  honorarios_totales: number;
  monto_pagado: number;
  tipo:string;
  link_carpeta: string;
  proxima_audiencia: string | null;
  // Agregamos el objeto cliente que viene del Preload de Go
  cliente?: {
    nombre: string;
    apellido: string;
  };
}

export default function CasosPage() {
  const [casos, setCasos] = useState<Caso[]>([])
  const [busqueda, setBusqueda] = useState('')
  const [cargando, setCargando] = useState(true)
  const [filtroRama, setFiltroRama] = useState('Todas');
  const router = useRouter()

  useEffect(() => {
    const cargarCasos = async () => {
      try {
        const res = await api.get('/casos')
        // res.data debería ser el array de casos
        setCasos(Array.isArray(res.data) ? res.data : [])
      } catch (error) {
        console.error("Error al cargar casos. Revisa la terminal de Go (Error 500):", error)
      } finally {
        setCargando(false)
      }
    }
    cargarCasos()
  }, [])

 const casosFiltrados = casos.filter(caso => {
  const coincideBusqueda = caso.titulo.toLowerCase().includes(busqueda.toLowerCase());
  const coincideRama = filtroRama === 'Todas' || caso.tipo === filtroRama;
  return coincideBusqueda && coincideRama;
});

  const formatearFecha = (fechaStr: string | null) => {
    if (!fechaStr || fechaStr.startsWith('0001')) return 'Pendiente';
    return new Date(fechaStr).toLocaleDateString('es-AR');
  }

  return (
    <div className="p-8 bg-legal min-h-screen font-lexend">
      {/* Header */}
      <div className="flex justify-between items-end mb-8 relative z-10">
        <div>
          <h1 className="text-4xl font-bold text-azul uppercase tracking-tighter">Expedientes</h1>
          <p className="text-azul/70 font-medium italic">Gestión operativa del estudio</p>
        </div>
        <Button 
          onClick={() => router.push('/dashboard/casos/nuevo')}
          className="bg-dorado text-azul font-bold shadow-lg hover:scale-105 transition-transform"
        >
          <Plus size={20} className="mr-2" /> NUEVO CASO
        </Button>
      </div>

      {/* Buscador */}

      <div className="flex gap-4 mb-8">
  <div className="relative flex-1">
    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-azul" size={20} />
    <input 
      type="text"
      placeholder="Buscar expediente..."
      className="w-full pl-12 pr-4 py-4 bg-azul backdrop-blur-sm rounded-2xl border-2 border-azul/10 focus:border-dorado outline-none"
      onChange={(e) => setBusqueda(e.target.value)}
    />
  </div>

  <select 
    className="px-6 py-4 bg-white/80 backdrop-blur-sm rounded-2xl border-2 border-azul/10 text-azul font-bold outline-none focus:border-dorado appearance-none cursor-pointer"
    value={filtroRama}
    onChange={(e) => setFiltroRama(e.target.value)}
  >
    <option value="Todas">Todas las Ramas</option>
    <option value="Civil">Civil</option>
    <option value="Penal">Penal</option>
    <option value="Laboral">Laboral</option>
    <option value="Familia">Familia</option>
  </select>
</div>

      {/* Grid de Casos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative z-10">
        {cargando ? (
          <p className="col-span-full text-center py-10 text-azul font-bold animate-pulse">Cargando expedientes...</p>
        ) : casosFiltrados.length === 0 ? (
          <div className="col-span-full p-20 text-center bg-white/40 rounded-3xl border-2 border-dashed border-azul/20">
            <p className="text-azul font-black uppercase">No se encontraron casos</p>
            <p className="text-sm text-azul/60">Asegúrate de que el backend de Go esté corriendo sin errores.</p>
          </div>
        ) : (
          casosFiltrados.map((caso) => (
            <div key={caso.id} className="bg-white/95 backdrop-blur-md rounded-3xl border border-azul/10 p-6 flex flex-col shadow-sm hover:shadow-xl transition-all group">
              
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-azul text-beige rounded-2xl shadow-inner">
                    <Briefcase size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-azul uppercase leading-tight group-hover:text-dorado transition-colors">
                      {caso.titulo}
                    </h3>
                    <div className="flex items-center gap-1 text-azul/50">
                      <User size={12} />
                      <span className="text-xs font-bold uppercase tracking-wider">
                        {caso.cliente ? `${caso.cliente.nombre} ${caso.cliente.apellido}` : 'Sin Cliente'}
                      </span>
                    </div>
                  </div>
                </div>
                <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase shadow-sm ${
                  caso.estado === 'Abierto' ? 'bg-esmeralda text-white' : 'bg-coral text-white'
                }`}>
                  {caso.estado || 'Abierto'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 py-4 border-y border-azul/5 my-4">
                <div className="flex items-center gap-2 text-xs font-bold text-azul/70">
                  <Calendar size={14} className="text-dorado" />
                  <span>Inicio: {formatearFecha(caso.fecha_inicio)}</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-azul/70">
                  <Clock size={14} className="text-dorado" />
                  <span>Audiencia: {formatearFecha(caso.proxima_audiencia)}</span>
                </div>
              </div>

              {/* Progreso de Honorarios */}
              <div className="mb-6 bg-azul/5 p-3 rounded-2xl">
                <div className="flex justify-between text-[10px] font-black uppercase mb-2">
                  <span className="text-azul/60 italic">Estado de Cobro</span>
                  <span className="text-azul">${caso.monto_pagado.toLocaleString()} / ${caso.honorarios_totales.toLocaleString()}</span>
                </div>
                <div className="w-full bg-white h-2 rounded-full overflow-hidden border border-azul/5">
                  <div 
                    className={`h-full transition-all duration-1000 ${
                      (caso.monto_pagado / caso.honorarios_totales) >= 1 ? 'bg-esmeralda' : 'bg-dorado'
                    }`}
                    style={{ width: `${Math.min((caso.monto_pagado / caso.honorarios_totales) * 100, 100) || 0}%` }}
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-auto">
                <a 
                  href={caso.link_carpeta} 
                  target="_blank" 
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-azul text-beige rounded-xl hover:bg-azul/90 transition-all font-bold text-xs uppercase"
                >
                  <ExternalLink size={14} /> Carpeta Digital
                </a>
                <button 
                  onClick={() => router.push(`/dashboard/pagos?caso_id=${caso.id}`)}
                  className="p-3 border-2 border-azul/10 text-azul rounded-xl hover:bg-dorado hover:border-dorado transition-all"
                  title="Ver Pagos"
                >
                  <CreditCard size={18} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}