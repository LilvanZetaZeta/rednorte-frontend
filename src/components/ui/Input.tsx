import type { ReactNode } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string | null;
  iconLeft?: ReactNode;
}

export default function Input({ 
  label, 
  error, 
  iconLeft, 
  className = '', 
  id,
  ...props 
}: InputProps) {
  const inputId = id || props.name;

  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-on-surface ml-1">
          {label}
        </label>
      )}
      
      <div className="relative">
        {iconLeft && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/50">
            {iconLeft}
          </div>
        )}
        
        <input
          id={inputId}
          className={`
            w-full py-3.5 rounded-2xl bg-surface-container-high border border-transparent
            text-sm text-on-surface placeholder:text-on-surface-variant/50 
            focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all
            ${iconLeft ? 'pl-11 pr-4' : 'px-5'}
            ${error ? '!border-error !ring-error/20' : ''}
            disabled:opacity-60 disabled:cursor-not-allowed
          `}
          {...props}
        />
      </div>

      {error && (
        <p className="text-xs font-bold text-error ml-1 animate-in slide-in-from-top-1">
          {error}
        </p>
      )}
    </div>
  );
}