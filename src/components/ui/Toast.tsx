import { CheckCircle2, AlertCircle } from 'lucide-react';

interface ToastProps {
  message: string;
  type: 'success' | 'error';
}

export default function Toast({ message, type }: ToastProps) {
  const isSuccess = type === 'success';

  return (
    <div className={`
      fixed top-20 right-8 z-[200] flex items-center gap-3 p-4 rounded-2xl shadow-xl border 
      animate-in slide-in-from-right-4 duration-300 max-w-sm
      ${isSuccess ? 'bg-success-container text-success border-success/20' : 'bg-error-container text-error border-error/20'}
    `}>
      {isSuccess ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
      <p className="text-sm font-bold leading-snug">{message}</p>
    </div>
  );
}