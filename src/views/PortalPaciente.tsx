import { Link } from 'react-router-dom';
import { usePortalPacienteVM } from '../viewmodels/usePortalPacienteVM';
import { Stethoscope, CalendarDays } from 'lucide-react';

export default function PortalPaciente() {
  const { userName, reservas, isLoading, handleCancelar } = usePortalPacienteVM();

  if (isLoading) return <div className="p-12 text-center text-primary">Cargando tu portal...</div>;

  return (
    <div className="animate-fade-in space-y-8">
      <section><h1 className="font-h1 text-h1 mb-2">Buenos días, {userName}.</h1><p className="text-on-surface-variant">Este es tu resumen de salud.</p></section>
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-h3 text-h3">Próximas Citas</h2>
          <Link to="/agendar" className="bg-primary text-white px-4 py-2 rounded-lg font-medium text-sm">Nueva Reserva</Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reservas.length === 0 ? (
            <div className="col-span-full p-8 text-center bg-surface-container-lowest border border-dashed border-outline-variant rounded-xl"><p>No tienes citas.</p></div>
          ) : (
            reservas.map((res: any) => (
              <div key={res.id} className="bg-surface-container-lowest border border-outline-variant rounded-xl p-5 shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container"><Stethoscope /></div>
                    <div><h3 className="font-h3 text-body-md">Dr. {res.medico.nombreCompleto}</h3><p className="text-caption text-on-surface-variant">{res.centro.nombreSucursal}</p></div>
                  </div>
                  <span className="px-3 py-1 bg-surface-container-high rounded-full text-xs font-medium uppercase">{res.estado}</span>
                </div>
                <div className="flex items-center gap-2 text-on-surface-variant mb-5 bg-surface-container-lowest p-2 rounded border border-surface-variant"><CalendarDays className="w-5 h-5" /><span className="text-sm font-medium">{res.fechaHora}</span></div>
                <button onClick={() => handleCancelar(res.id)} className="w-full bg-error/10 text-error py-2.5 rounded-lg text-sm hover:bg-error hover:text-white transition-colors">Cancelar Cita</button>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}