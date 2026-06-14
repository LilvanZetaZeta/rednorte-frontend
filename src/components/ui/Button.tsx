import { Loader2 } from 'lucide-react';
import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  isLoading?: boolean;
  icon?: ReactNode;
}

export default function Button({ 
  children, 
  variant = 'primary', 
  isLoading = false, 
  icon, 
  className = '', 
  ...props 
}: ButtonProps) {
  const baseStyles = "py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-primary text-on-primary shadow-lg shadow-primary/20 hover:bg-primary/90",
    secondary: "bg-secondary-container text-secondary hover:bg-secondary-container/80",
    outline: "border border-outline text-on-surface-variant hover:bg-surface-container-high",
    danger: "bg-error text-on-error hover:bg-error/90 shadow-lg shadow-error/20"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className}`} 
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : icon}
      {children}
    </button>
  );
}