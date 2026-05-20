import { useState } from 'react';
import { usePortalDirectorVM } from '../viewmodels/usePortalDirectorVM';
import { BarChart3, Users, Building2, CalendarCheck2, Activity, CheckCircle2, AlertCircle, Loader2, ShieldCheck } from 'lucide-react';

export default function PortalDirector() {
  const { userName, resumen, centros, isLoading, handleAsignarAdmin, isAssigning } = usePortalDirectorVM();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);

  const onAssign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    const result = await handleAsignarAdmin(email);
    if (result.success) {
      setMessage({ text: 'Usuario designado como Administrador exitosamente.', type: 'success' });
      setEmail('');
    } else {
      setMessage({ text: result.error || 'Error al asignar administrador', type: 'error' });
    }
    
    setTimeout(() => setMessage(null), 5000);
  };

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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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

        <section className="bg-surface-container-lowest p-8 rounded-3xl border border-outline-variant shadow-sm flex flex-col">
          <h2 className="font-h3 text-h3 mb-6 flex items-center gap-3"><ShieldCheck className="text-primary" /> Crear Administrador</h2>
          <p className="text-on-surface-variant mb-8 text-sm">Designa a usuarios existentes como Administradores de la red ingresando su correo electrónico registrado.</p>
          
          <form onSubmit={onAssign} className="space-y-6 mt-auto">
            <div className="space-y-2">
              <label htmlFor="email-assign" className="block text-sm font-medium text-on-surface ml-1">Correo del Usuario</label>
              <input
                id="email-assign"
                type="email"
                placeholder="ejemplo@rednorte.cl"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-5 py-4 rounded-2xl bg-surface-container-high border-none text-on-surface placeholder:text-on-surface-variant/50 focus:ring-2 focus:ring-primary transition-all outline-none"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isAssigning || !email}
              className="w-full py-4 bg-primary text-on-primary rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-primary/20"
            >
              {isAssigning ? <Loader2 className="w-5 h-5 animate-spin" /> : <ShieldCheck className="w-5 h-5" />}
              {isAssigning ? 'Procesando...' : 'Designar como Administrador'}
            </button>

            {message && (
              <div className={`flex items-center gap-3 p-4 rounded-2xl animate-in slide-in-from-top-2 duration-300 ${
                message.type === 'success' ? 'bg-success-container text-success' : 'bg-error-container text-error'
              }`}>
                {message.type === 'success' ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
                <p className="text-sm font-medium">{message.text}</p>
              </div>
            )}
          </form>
        </section>
      </div>
    </div>
  );
}