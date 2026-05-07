import { usePortalDirectorVM } from '../viewmodels/usePortalDirectorVM';
import { BarChart3, Users, Building2, CalendarCheck2, Activity } from 'lucide-react';

export default function PortalDirector() {
  const { userName, resumen, centros, isLoading } = usePortalDirectorVM();

  if (isLoading) return <div className="p-12 text-center text-primary">Cargando reporte ejecutivo...</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <section className="flex justify-between items-end">
        <div><h1 className="font-h1 text-h1 text-on-background mb-1">Panel Ejecutivo</h1><p className="text-on-surface-variant">Director {userName}</p></div>
        <div className="flex items-center gap-2 px-4 py-2 bg-surface-container-high rounded-full border border-outline-variant"><Activity className="w-4 h-4 text-primary animate-pulse" /><span className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Tiempo Real</span></div>
      </section>
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-surface-container-lowest p-6 rounded-3xl border border-outline-variant shadow-sm"><div className="p-3 bg-primary-container text-primary rounded-2xl w-fit mb-4"><BarChart3 /></div><p className="text-on-surface-variant text-sm font-medium">Total Reservas</p><p className="text-3xl font-bold">{resumen?.totalReservas}</p></div>
        <div className="bg-surface-container-lowest p-6 rounded-3xl border border-outline-variant shadow-sm"><div className="p-3 bg-secondary-container text-secondary rounded-2xl w-fit mb-4"><CalendarCheck2 /></div><p className="text-on-surface-variant text-sm font-medium">Citas Vigentes</p><p className="text-3xl font-bold">{resumen?.reservasVigentes}</p></div>
        <div className="bg-surface-container-lowest p-6 rounded-3xl border border-outline-variant shadow-sm"><div className="p-3 bg-tertiary-container text-tertiary rounded-2xl w-fit mb-4"><Users /></div><p className="text-on-surface-variant text-sm font-medium">Personal Médico</p><p className="text-3xl font-bold">{resumen?.totalMedicos}</p></div>
        <div className="bg-surface-container-lowest p-6 rounded-3xl border border-outline-variant shadow-sm"><div className="p-3 bg-primary-container text-primary rounded-2xl w-fit mb-4"><Building2 /></div><p className="text-on-surface-variant text-sm font-medium">Centros</p><p className="text-3xl font-bold">{resumen?.totalCentros}</p></div>
      </section>
      <section className="bg-surface-container-lowest p-8 rounded-3xl border border-outline-variant shadow-sm">
        <h2 className="font-h3 text-h3 mb-8 flex items-center gap-3"><Building2 className="text-primary" /> Rendimiento por Sucursal</h2>
        <div className="space-y-6">
          {centros?.map((c, i) => {
            const max = Math.max(...(centros.map(c => c.cantidadReservas) || [1]));
            return (
              <div key={i} className="space-y-2">
                <div className="flex justify-between text-sm font-medium"><span>{c.nombreCentro}</span><span className="text-on-surface-variant">{c.cantidadReservas} reservas</span></div>
                <div className="h-3 w-full bg-surface-container-high rounded-full overflow-hidden"><div className="h-full bg-primary" style={{ width: `${(c.cantidadReservas / max) * 100}%` }} /></div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}