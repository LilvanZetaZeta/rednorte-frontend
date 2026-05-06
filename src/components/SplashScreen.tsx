import React from 'react';
import { Loader2 } from 'lucide-react';

export const SplashScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-white flex flex-col items-center justify-center z-[9999]">
      <div className="relative flex flex-col items-center">
        <div className="flex items-center gap-3 mb-8 animate-in fade-in zoom-in duration-700">
          <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
            <svg viewBox="0 0 24 24" className="w-7 h-7 text-white fill-current">
              <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z" />
            </svg>
          </div>
          <span className="text-2xl font-bold tracking-tight text-on-surface">
            RedNorte <span className="text-primary">CMS</span>
          </span>
        </div>

        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
            <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full animate-pulse" />
          </div>
          <p className="text-sm font-medium text-on-surface-variant animate-pulse tracking-wide uppercase">
            Preparando tu panel...
          </p>
        </div>

        <div className="absolute -top-40 -left-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-secondary/5 rounded-full blur-3xl" />
      </div>
    </div>
  );
};
