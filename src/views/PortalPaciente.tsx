import { Link } from 'react-router-dom';
import { usePortalPacienteVM } from '../viewmodels/usePortalPacienteVM';
import { Stethoscope, CalendarDays } from 'lucide-react';

export default function PortalPaciente() {
  const { userName, reservas, isLoading, isError, handleCancelar } = usePortalPacienteVM();

  if (isLoading) return <div className="p-12 text-center text-primary font-h3">Cargando tu portal médico...</div>;
  if (isError) return <div className="p-12 text-center text-error">Error al conectar con los servidores de RedNorte.</div>;

  // Validación defensiva estricta
  const tieneReservas = Array.isArray(reservas) && reservas.length > 0;

  return (
    <div className="animate-fade-in">
      <section className="mb-8">
        <h1 className="font-h1 text-h1 text-on-background mb-2">Buenos días, {userName}.</h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant">
          Este es el resumen de tu gestión de salud en RedNorte.
        </p>
      </section>

      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-h3 text-h3 text-on-background">Próximas Citas</h2>
          {/* Conectado al enrutador base del Layout */}
          <Link 
            to="/agendar" 
            className="bg-primary hover:bg-primary-container text-white hover:text-on-primary-container px-4 py-2 rounded-lg font-medium text-sm transition-colors shadow-sm"
          >
            Nueva Reserva
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {!tieneReservas ? (
            <div className="col-span-full p-8 text-center bg-surface-container-lowest border border-dashed border-outline-variant rounded-xl">
              <p className="text-on-surface-variant font-body-md">No tienes citas agendadas en este momento.</p>
            </div>
          ) : (
            reservas.map((reserva) => (
              <div key={reserva.id} className="bg-surface-container-lowest border border-outline-variant rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container">
                      <Stethoscope className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-h3 text-body-md text-on-surface">ID Médico: {reserva.medicoId}</h3>
                      <p className="font-caption text-caption text-on-surface-variant">{reserva.especialidad}</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-surface-container-high text-on-surface-variant rounded-full text-xs font-medium uppercase tracking-wider">
                    {reserva.estado}
                  </span>
                </div>
                
                <div className="flex items-center gap-2 text-on-surface-variant mb-5 bg-surface-container-lowest p-2 rounded border border-surface-variant">
                  <CalendarDays className="w-5 h-5" />
                  <span className="font-body-md text-sm font-medium">{reserva.fechaHora}</span>
                </div>

                <div className="flex gap-2">
                  <button 
                    onClick={() => handleCancelar(reserva.id)}
                    className="flex-1 bg-error/10 text-error py-2.5 rounded-lg font-medium text-sm hover:bg-error hover:text-white transition-colors"
                  >
                    Cancelar Cita
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}