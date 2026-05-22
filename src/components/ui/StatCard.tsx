import type { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: ReactNode;
  colorClass?: string; // Ej: 'bg-primary-container text-primary'
}

export default function StatCard({ 
  title, 
  value, 
  subtitle, 
  icon, 
  colorClass = 'bg-primary-container text-primary' 
}: StatCardProps) {
  return (
    <div className="bg-surface-container-lowest p-6 rounded-3xl border border-outline-variant shadow-sm hover:shadow-md transition-shadow">
      <div className={`p-3 rounded-2xl w-fit mb-4 ${colorClass}`}>
        {icon}
      </div>
      <p className="text-on-surface-variant text-sm font-medium">{title}</p>
      <div className="flex items-baseline gap-2 mt-1">
        <p className="text-3xl font-black text-on-surface">{value}</p>
        {subtitle && (
          <span className="text-xs font-medium text-on-surface-variant">{subtitle}</span>
        )}
      </div>
    </div>
  );
}