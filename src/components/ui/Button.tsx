// src/components/ui/Button.tsx
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'success' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

export default function Button({ 
  children, 
  variant = 'primary', 
  size = 'md',
  className = '', 
  ...props 
}: ButtonProps) {
  
  // Estilos base: transiciones, bordes y comportamiento del click
  const baseStyles = "inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:pointer-events-none";
  
  // Tamaños
  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-5 py-2.5 text-base",
    lg: "px-8 py-3 text-lg"
  };

  // Variantes usando tu paleta personalizada
 const variants = {
    primary: "bg-azul text-beige hover:bg-dorado shadow-azul hover:text-azul hover:border-azul",
    success: "bg-esmeralda text-beige hover:border-beige shadow-sm hover:bg-esmeralda/80",
    danger: "bg-coral text-beige hover:border-gris shadow-sm",
    login: "bg-dorado/30 text-beige border-2 hover:bg-dorado border-dorado hover:text-azul hover:border-transparent hover:scale-110",
    outline: "border-2 border-gris text-gris hover:bg-beige bg-beige hover:text-beige"
  };

  return (
    <button 
      className={`${baseStyles} ${sizes[size]} ${variants[variant]} ${className}`} 
      {...props}
    >
      {children}
    </button>
  );
}