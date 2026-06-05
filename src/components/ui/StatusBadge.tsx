interface StatusBadgeProps {
  estado: string;
  className?: string;
}

export default function StatusBadge({ estado, className = '' }: StatusBadgeProps) {
  const label = estado.replace(/_/g, ' ');

  let styles = '';
  switch (estado) {
    case 'VIGENTE':
      styles = 'bg-blue-50 text-blue-700 border-blue-100';
      break;
    case 'CONFIRMADA':
      styles = 'bg-green-50 text-green-700 border-green-100';
      break;
    case 'ATENDIDO':
    case 'FINALIZADA':
      styles = 'bg-emerald-50 text-emerald-700 border-emerald-100';
      break;
    case 'CANCELADA':
    case 'CANCELADA_MEDICO':
    case 'CANCELADA_SISTEMA':
      styles = 'bg-red-50 text-red-700 border-red-100';
      break;
    case 'NO_ASISTE':
      styles = 'bg-amber-50 text-amber-700 border-amber-100';
      break;
    default:
      styles = 'bg-slate-50 text-slate-700 border-slate-100';
      break;
  }

  return (
    <span className={`px-3 py-1.5 border rounded-full text-xs font-bold uppercase tracking-wide inline-block ${styles} ${className}`}>
      {label}
    </span>
  );
}
