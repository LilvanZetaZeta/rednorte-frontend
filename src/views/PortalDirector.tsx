import { usePortalDirectorVM } from '../viewmodels/usePortalDirectorVM';
import { 
  BarChart3, 
  Users, 
  Stethoscope, 
  Building2, 
  CalendarCheck2, 
  CalendarX2,
  TrendingUp,
  Activity
} from 'lucide-react';

export default function PortalDirector() {
  const { userName, resumen, centros, isLoading, isError } = usePortalDirectorVM();

  if (isLoading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      <p className="text-primary font-medium">Generando reporte ejecutivo...</p>
    </div>
  );

  if (isError) return (
    <div className="p-8 bg-error-container text-on-error-container rounded-2xl border border-error/20 text-center">
      <p className="font-bold mb-2">Error de Conexión</p>
      <p>No pudimos recuperar las métricas en este momento. Por favor, intente más tarde.</p>
    </div>
  );

  const stats = [
    { label: 'Total Reservas', value: resumen?.totalReservas, icon: BarChart3, color: 'text-primary', bg: 'bg-primary-container' },
    { label: 'Citas Vigentes', value: resumen?.reservasVigentes, icon: CalendarCheck2, color: 'text-secondary', bg: 'bg-secondary-container' },
    { label: 'Citas Canceladas', value: resumen?.reservasCanceladas, icon: CalendarX2, color: 'text-error', bg: 'bg-error-container' },
    { label: 'Personal Médico', value: resumen?.totalMedicos, icon: Stethoscope, color: 'text-tertiary', bg: 'bg-tertiary-container' },
  ];

  return (
    <div className="animate-fade-in space-y-8 pb-12">
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="font-h1 text-h1 text-on-background mb-1">Panel de Control Ejecutivo</h1>
          <p className="text-on-surface-variant font-body-lg">
            Bienvenido, Director {userName}. Aquí está el estado actual de RedNorte.
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-surface-container-high rounded-full border border-outline-variant">
          <Activity className="w-4 h-4 text-primary animate-pulse" />
          <span className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Tiempo Real</span>
        </div>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-surface-container-lowest p-6 rounded-3xl border border-outline-variant shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <TrendingUp className="w-4 h-4 text-secondary opacity-50" />
            </div>
            <p className="text-on-surface-variant text-sm font-medium mb-1">{stat.label}</p>
            <p className="text-3xl font-bold text-on-surface">{stat.value}</p>
          </div>
        ))}
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <section className="lg:col-span-2 bg-surface-container-lowest p-8 rounded-3xl border border-outline-variant shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-h3 text-h3 flex items-center gap-3">
              <Building2 className="w-6 h-6 text-primary" />
              Rendimiento por Sucursal
            </h2>
          </div>
          
          <div className="space-y-6">
            {centros?.map((centro, i) => {
              const max = Math.max(...(centros.map(c => c.cantidadReservas) || [1]));
              const percent = (centro.cantidadReservas / max) * 100;
              
              return (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between text-sm font-medium">
                    <span className="text-on-surface">{centro.nombreCentro}</span>
                    <span className="text-on-surface-variant">{centro.cantidadReservas} reservas</span>
                  </div>
                  <div className="h-3 w-full bg-surface-container-high rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary rounded-full transition-all duration-1000" 
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="bg-surface-container-lowest p-8 rounded-3xl border border-outline-variant shadow-sm">
          <h2 className="font-h3 text-h3 mb-8 flex items-center gap-3">
            <Users className="w-6 h-6 text-primary" />
            Comunidad
          </h2>
          
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-surface-container-low border border-outline-variant">
              <div className="w-12 h-12 rounded-full bg-primary-container flex items-center justify-center text-primary">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl font-bold text-on-surface">{resumen?.totalPacientes}</p>
                <p className="text-xs text-on-surface-variant font-medium uppercase">Pacientes Registrados</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-2xl bg-surface-container-low border border-outline-variant">
              <div className="w-12 h-12 rounded-full bg-secondary-container flex items-center justify-center text-secondary">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl font-bold text-on-surface">{resumen?.totalCentros}</p>
                <p className="text-xs text-on-surface-variant font-medium uppercase">Centros Operativos</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
