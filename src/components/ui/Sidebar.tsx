'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Users, Briefcase, CreditCard, LayoutDashboard } from 'lucide-react'

export default function Sidebar() {
  const pathname = usePathname()

  const menuItems = [
    { name: 'Inicio', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Clientes', href: '/dashboard/clientes/nuevo', icon: Users },
    { name: 'Casos', href: '/dashboard/casos', icon: Briefcase },
    { name: 'Pagos', href: '/dashboard/pagos', icon: CreditCard },
  ]

  return (
    <div className="w-64 bg-slate-900 h-screen text-white p-4 fixed left-0 top-0">
      <div className="mb-10 p-2 text-2xl font-bold border-b border-slate-700">
        LegalFlow
      </div>
      
      <nav className="space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          
          return (
            <Link 
              key={item.name} 
              href={item.href}
              className={`flex items-center gap-3 p-3 rounded-lg transition ${
                isActive ? 'bg-blue-600 text-white' : 'hover:bg-slate-800 text-slate-400'
              }`}
            >
              <Icon size={20} />
              {item.name}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}