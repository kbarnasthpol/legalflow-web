'use client'
import Link from 'next/link'
import { LucideIcon, ChevronRight } from 'lucide-react'

interface SidebarItemProps {
  href: string;
  icon: LucideIcon;
  label: string;
  isActive: boolean;
}

export default function SidebarItem({ href, icon: Icon, label, isActive }: SidebarItemProps) {
  return (
    <Link
      href={href}
      className={`group flex items-center justify-between p-3 rounded-lg transition-all duration-300  ${
        isActive 
          ? 'bg-dorado text-azul shadow-gris ' 
          : 'hover:bg-beige hover:text-azul text-beige'
      }`}
    >
      <div className="flex items-center gap-3 transition-transform duration-200 group-hover:translate-x-[10px] group-hover:scale-110">
        <Icon size={20} />
        <span className="font-medium uppercase tracking-wider">{label}</span>
      </div>

      {/* Animación de la flecha */}
     <ChevronRight
  size={18}
  className="
    animate-slide-x
    opacity-0
    group-hover:opacity-100
  "
/>

    </Link>
  )
}