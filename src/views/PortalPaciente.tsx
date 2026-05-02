import { usePortalPacienteVM } from '../viewmodels/usePortalPacienteVM';

export default function PortalPaciente() {
  const { userName, reservas, isLoading, isError, handleCancelar, handleCerrarSesion } = usePortalPacienteVM();

  if (isLoading) return <div className="p-12 text-center text-primary font-h3">Cargando tu portal médico...</div>;
  if (isError) return <div className="p-12 text-center text-error">Error al conectar con los servidores de RedNorte.</div>;

  return (
    <div className="bg-background text-on-background min-h-screen font-body-md">
      {/* TopAppBar */}
      <header className="fixed top-0 w-full z-50 h-16 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm flex justify-between items-center px-6 lg:px-12">
        <div className="text-lg font-bold tracking-tight text-sky-700">Servicio de Salud RedNorte</div>
        <div className="flex items-center gap-4">
          <button onClick={handleCerrarSesion} className="text-sm font-medium text-error hover:underline">Cerrar Sesión</button>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-24 p-6 md:p-12 max-w-[1280px] mx-auto">
        <section className="mb-lg">
          <h1 className="font-h1 text-h1 text-on-background mb-2">Buenos días, {userName}.</h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant">Este es el resumen de tu gestión de salud en RedNorte.</p>
        </section>

        <section>
          <div className="flex justify-between items-center mb-md">
            <h2 className="font-h3 text-h3 text-on-background">Próximas Citas</h2>
            <button className="bg-primary-container text-white px-4 py-2 rounded-lg font-medium text-sm">Nueva Reserva</button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
            {reservas.length === 0 ? (
              <p className="text-on-surface-variant">No tienes citas agendadas.</p>
            ) : (
              reservas.map((reserva) => (
                <div key={reserva.id} className="bg-surface-container-lowest border border-outline-variant rounded-xl p-md shadow-sm">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container">
                        <span className="material-symbols-outlined">medical_services</span>
                      </div>
                      <div>
                        <h3 className="font-h3 text-body-md text-on-surface">ID Médico: {reserva.medicoId}</h3>
                        <p className="font-caption text-caption text-on-surface-variant">{reserva.especialidad}</p>
                      </div>
                    </div>
                    <span className="px-3 py-1 bg-surface-container-high text-on-surface-variant rounded-full text-xs font-medium">
                      {reserva.estado}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-on-surface-variant mb-4">
                    <span className="material-symbols-outlined text-[18px]">calendar_today</span>
                    <span className="font-body-md text-sm">{reserva.fechaHora}</span>
                  </div>

                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleCancelar(reserva.id)}
                      className="flex-1 bg-error/10 text-error py-2 rounded-lg font-medium text-sm hover:bg-error/20 transition-colors"
                    >
                      Cancelar Cita
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </main>
    </div>
  );
}