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
    primary: "bg-maya-600 text-white hover:bg-maya-950 shadow-sm",
    success: "bg-mint-700 text-white hover:bg-mint-950 shadow-sm",
    danger: "bg-blossom-700 text-white hover:bg-blossom-950 shadow-sm",
    outline: "border-2 border-iron-700 text-iron-700 hover:bg-iron-100"
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