import { useState } from 'react';
import { usePortalDirectorVM } from '../viewmodels/usePortalDirectorVM';
import { BarChart3, Users, Building2, CalendarCheck2, Activity, ShieldCheck } from 'lucide-react';
import StatCard from '../components/ui/StatCard';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Toast from '../components/ui/Toast';
import { validations } from '../utils/validations';

export default function PortalDirector() {
  const { userName, resumen, centros, isLoading, handleAsignarAdmin, isAssigning } = usePortalDirectorVM();
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);

  const handleEmailChange = (val: string) => {
    setEmail(val);
    setError(validations.email(val));
  };

  const onAssign = async (e: React.FormEvent) => {
    e.preventDefault();
    const emailErr = validations.email(email) || (!email ? 'El correo es requerido' : null);
    setError(emailErr);
    if (emailErr) {
      setMessage({ text: 'Por favor ingresa un correo válido.', type: 'error' });
      setTimeout(() => setMessage(null), 5000);
      return;
    }

    const result = await handleAsignarAdmin(email);
    setMessage({ 
      text: result.success ? 'Usuario designado como Administrador exitosamente.' : (result.error || 'Error al asignar'), 
      type: result.success ? 'success' : 'error' 
    });
    
    if (result.success) {
      setEmail('');
      setError(null);
    }
    setTimeout(() => setMessage(null), 5000);
  };

  if (isLoading) return <div className="p-12 text-center text-primary">Cargando reporte ejecutivo...</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      
      {message && <Toast message={message.text} type={message.type} />}

      <section className="flex justify-between items-end">
        <div>
          <h1 className="font-h1 text-h1 text-on-background mb-1">Panel Ejecutivo</h1>
          <p className="text-on-surface-variant">Director {userName}</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-surface-container-high rounded-full border border-outline-variant">
          <Activity className="w-4 h-4 text-primary animate-pulse" />
          <span className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Tiempo Real</span>
        </div>
      </section>

      {/* Uso de StatCard limpio y semántico */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Reservas" value={resumen?.totalReservas || 0} icon={<BarChart3 />} />
        <StatCard title="Citas Vigentes" value={resumen?.reservasVigentes || 0} icon={<CalendarCheck2 />} colorClass="bg-secondary-container text-secondary" />
        <StatCard title="Personal Médico" value={resumen?.totalMedicos || 0} icon={<Users />} colorClass="bg-tertiary-container text-tertiary" />
        <StatCard title="Centros" value={resumen?.totalCentros || 0} icon={<Building2 />} />
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section className="bg-surface-container-lowest p-8 rounded-3xl border border-outline-variant shadow-sm">
          <h2 className="font-h3 text-h3 mb-8 flex items-center gap-3"><Building2 className="text-primary" /> Rendimiento por Sucursal</h2>
          <div className="space-y-6">
            {centros?.map((c, i) => {
              const max = Math.max(...(centros.map(c => c.cantidadReservas) || [1]));
              return (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between text-sm font-medium">
                    <span>{c.nombreCentro}</span><span className="text-on-surface-variant">{c.cantidadReservas} reservas</span>
                  </div>
                  <div className="h-3 w-full bg-surface-container-high rounded-full overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: `${(c.cantidadReservas / max) * 100}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="bg-surface-container-lowest p-8 rounded-3xl border border-outline-variant shadow-sm flex flex-col">
          <h2 className="font-h3 text-h3 mb-6 flex items-center gap-3"><ShieldCheck className="text-primary" /> Crear Administrador</h2>
          <p className="text-on-surface-variant mb-8 text-sm">Designa a usuarios existentes como Administradores de la red ingresando su correo electrónico registrado.</p>
          
          <form onSubmit={onAssign} className="space-y-6 mt-auto">
            {/* Uso del Input limpio */}
            <Input
              label="Correo del Usuario"
              type="email"
              placeholder="ejemplo@rednorte.cl"
              value={email}
              onChange={(e) => handleEmailChange(e.target.value)}
              error={error}
            />

            {/* Uso del Button limpio */}
            <Button
              type="submit"
              isLoading={isAssigning}
              disabled={!email}
              icon={<ShieldCheck className="w-5 h-5" />}
              className="w-full"
            >
              Designar como Administrador
            </Button>
          </form>
        </section>
      </div>
    </div>
  );
}