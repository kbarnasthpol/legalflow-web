'use client'
import { useEffect, useState } from 'react'
import api from '../../lib/axios'
import { useRouter } from 'next/navigation' // Importamos el "conduce-páginas"
import PrimaryButton from '@/src/components/Button'
import { Users, Briefcase, DollarSign } from 'lucide-react'
interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode; // Este es el tipo especial para componentes o íconos
  color: string;
}
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
export default function DashboardPage() {
  const [clientes, setClientes] = useState([])
  const router = useRouter()
const [stats, setStats] = useState({ clientes: 0, casos: 0, recaudado: 0 })
  useEffect(() => {
  const cargarTodo = async () => {
    try {
      // Ejecutamos ambas peticiones en paralelo y esperamos a que AMBAS terminen
      const [resClientes, resStats] = await Promise.all([
        api.get('/clientes'),
        api.get('/dashboard/stats')
      ]);

      console.log("Clientes recibidos:", resClientes.data);
      console.log("Stats recibidas:", resStats.data);

      // Seteamos los estados uno tras otro
      setClientes(resClientes.data);
      setStats(resStats.data);
    } catch (error) {
      console.error("Error cargando el Dashboard:", error);
    }
  };

  cargarTodo();
}, []);
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-slate-800 mb-8">Panel de Control</h1>
      
      {/* Tarjetas de Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <StatCard title="Clientes" value={stats.clientes} icon={<Users />} color="bg-blue-500" />
        <StatCard title="Casos Activos" value={stats.casos} icon={<Briefcase />} color="bg-purple-500" />
        <StatCard title="Recaudación" value={`$${stats.recaudado}`} icon={<DollarSign />} color="bg-emerald-500" />
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
        <h2 className="text-xl font-semibold mb-4 text-black">Próximas Acciones</h2>
        <p className="text-slate-500 text-sm">Aquí podrías listar las audiencias de hoy o tareas pendientes.</p>
      </div>
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
function StatCard({ title, value, icon, color }: StatCardProps) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-5">
      <div className={`${color} p-4 rounded-xl text-white shadow-lg`}>
        {icon}
      </div>
      <div>
        <p className="text-slate-500 text-sm font-medium">{title}</p>
        <p className="text-2xl font-bold text-slate-800">{value}</p>
      </div>
    </div>
  )
}