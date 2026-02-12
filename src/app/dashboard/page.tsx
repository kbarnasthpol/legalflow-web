'use client'
import { useEffect, useState } from 'react'
import api from '../../lib/axios'
import { useRouter } from 'next/navigation'
import Button from '@/components/ui/Button'
import { Users, Briefcase, DollarSign, StickyNote, CalendarDays, ChevronRight } from 'lucide-react'

export default function DashboardPage() {
  const router = useRouter()
  const [stats, setStats] = useState({ clientes: 0, casos: 0, recaudado: 0 })
  const [nota, setNota] = useState<string>('')

  useEffect(() => {
    // Recuperar nota del localStorage al cargar
    const savedNote = localStorage.getItem('legalflow_quick_note')
    if (savedNote) setNota(savedNote)

    const cargarStats = async () => {
      try {
        const resStats = await api.get('/dashboard/stats')
        setStats(resStats.data)
      } catch (error) {
        console.error("Error stats:", error)
      }
    }
    cargarStats()
  }, [])

  // Guardar nota automáticamente mientras escribes
  const handleNoteChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value
    setNota(val)
    localStorage.setItem('legalflow_quick_note', val)
  }

  return (
    <div className="p-8 bg-beige min-h-screen font-lexend text-beige">
      
      {/* Encabezado */}
      <div className="flex justify-between items-end mb-8 border-b border-azul pb-4">
        <div>
          <h1 className="text-4xl font-bold text-azul uppercase tracking-tighter">Panel de Control</h1>
          <p className="text-azul/80 font-medium">Gestión integral de tu estudio</p>
        </div>
        <Button 
          variant="primary" className="hover:scale-[1.02]"
          onClick={() => router.push('/dashboard/clientes/nuevo')}
        >
          + NUEVO CLIENTE
        </Button>
      </div>
      
      {/* 1. Tarjetas de Métricas con tu Contraste Azul/Dorado */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <StatCard title="Clientes" value={stats.clientes} icon={<Users />} color="bg-azul" textColor="text-dorado" />
        <StatCard title="Casos Activos" value={stats.casos} icon={<Briefcase />} color="bg-azul" textColor="text-esmeralda" />
        <StatCard title="Recaudación" value={`$${stats.recaudado}`} icon={<DollarSign />} color="bg-azul" textColor="text-coral" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* 2. Actividades de la Semana */}
        <div className="bg-azul p-6 rounded-2xl shadow-xl">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <CalendarDays className="text-dorado" />
              <h2 className="text-xl font-bold text-beige uppercase">Agenda Semanal</h2>
            </div>
            <button onClick={() => router.push('/dashboard/calendario')} className="text-dorado text-sm font-bold hover:underline flex items-center">
              VER CALENDARIO <ChevronRight size={16} />
            </button>
          </div>

          <div className="space-y-3">
            {/* Ejemplo de item de agenda */}
            <div className="flex items-center p-4 bg-gris/20 rounded-xl border-l-4 border-dorado hover:bg-gris/30 transition-all cursor-pointer">
              <div className="w-16 text-center border-r border-beige/20 mr-4">
                <p className="text-[10px] text-dorado font-bold">LUN</p>
                <p className="text-xl font-bold text-beige">16</p>
              </div>
              <p className="font-medium text-beige flex-1">Audiencia Preliminar - García vs. Seguros</p>
              <span className="text-[10px] bg-esmeralda text-azul px-2 py-1 rounded font-bold">JUZGADO</span>
            </div>
          </div>
        </div>

        {/* 3. Bloc de Notas Rápidas (Estilo Post-it Legal) */}
        <div className="bg-azul p-6 rounded-2xl shadow-xl flex flex-col">
          <div className="flex items-center gap-2 mb-4">
            <StickyNote className="text-dorado" />
            <h2 className="text-xl font-bold uppercase text-beige">Notas del día</h2>
          </div>
          <textarea
            className="flex-1 w-full p-4 bg-gris/20 rounded-xl text-beige resize-none focus:outline-none focus:border-dorado transition-colors placeholder:text-dorado"
            placeholder="Anota aquí expedientes, recordatorios o tareas..."
            value={nota}
            onChange={handleNoteChange}
          />
        </div>

      </div>
    </div>
  )
}
interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  textColor: string;
}
function StatCard({ title, value, icon, color, textColor }: StatCardProps) {
  return (
    <div className={`${color} p-6 rounded-2xl shadow-lg  flex items-center gap-5 hover:scale-[1.02] transition-transform`}>
      <div className={`p-4 rounded-xl bg-gris/30 ${textColor}`}>
        {icon}
      </div>
      <div>
        <p className="text-beige text-xs font-bold uppercase tracking-widest">{title}</p>
        <p className={`text-3xl font-bold ${textColor}`}>{value}</p>
      </div>
    </div>
  )
}