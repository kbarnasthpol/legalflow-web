'use client'
import { usePathname } from 'next/navigation'
import SidebarItem from '@/components/ui/sidebar-flecha' // Importamos el nuevo componente
import { 
  Users, 
  Briefcase, 
  CreditCard, 
  LayoutDashboard, 
  Calendar, 
  Settings, 
  LogOut,
  Hand,
} from 'lucide-react'
import Link from 'next/link'

export default function Sidebar() {
  const pathname = usePathname()

  const menuItems = [
    { name: 'INICIO', href: '/dashboard', icon: LayoutDashboard },
    { name: 'CLIENTES', href: '/dashboard/clientes', icon: Users },
    { name: 'CASOS', href: '/dashboard/casos', icon: Briefcase },
    { name: 'PAGOS', href: '/dashboard/pagos', icon: CreditCard },
    { name: 'CALENDARIO', href: '/dashboard/calendario', icon: Calendar },
  ]

  return (
    <div className="w-64 bg-azul h-screen text-beige p-4 fixed left-0 top-0 flex flex-col font-lexend">
      {/* Logo / Título */}
      <div className="mb-10 p-2 text-2xl font-bold border-b border-gris text-beige text-center">
        LEGALFLOW
      </div>
      
      {/* Navegación Principal */}
      <nav className="space-y-2 flex-1 ">
        {menuItems.map((item) => (
          <SidebarItem 
            key={item.name}
            href={item.href}
            icon={item.icon}
            label={item.name}
            isActive={pathname === item.href}
          />
        ))}
      </nav>

      {/* Sección Inferior */}
      <div className="pt-4 border-t border-azul space-y-1 ">
        {/* Ítem de Configuración con engranaje giratorio */}
        <Link
          href="/dashboard/configuracion"
          className={`group flex items-center justify-between p-3 rounded-lg transition-all duration-300   ${
            pathname === '/dashboard/configuracion' 
              ? 'bg-dorado text-azul shadow-lg shadow-gris ' 
              : 'hover:bg-beige hover:text-azul text-beige'
          }`}
        >
          <div className="flex items-center gap-3 group-hover:translate-x-[5px]">
            <Settings 
              size={20} 
              className="transition-all group-hover:animate-spin"
              style={{ animationDuration: '2s' }}
            />
            <span className="font-medium uppercase">CONFIGURACIÓN</span>
          </div>
        </Link>

        {/* Botón de Cerrar Sesión con mano saludando sin parar */}
       <button 
  onClick={() => console.log("Cerrando sesión...")}
  className="w-full group flex items-center justify-between p-3 rounded-lg transition-all duration-300 text-coral hover:bg-coral hover:text-beige mt-1"
>
  <div className="flex items-center gap-3 group-hover:translate-x-[5px]">
    <LogOut size={20} className="transition-transform duration-300 group-hover:scale-110" />
    <span className="font-medium uppercase">CERRAR SESIÓN</span>
  </div>

 <Hand
  size={18}
  className="
    animate-wave
    opacity-0
    group-hover:opacity-100
  "
/>
</button>
      </div>
    </div>
  )
}