import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export default function Input({ label, className = '', ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1 w-full">
      {label && <label className="text-sm font-medium text-iron-oscuro">{label}</label>}
      <input 
        className={`border border-gris focus:border-azul focus:ring-2 focus:ring-azul/20 outline-none p-2 rounded-md transition-all ${className}`}
        {...props}
      />
    </div>
  );
}