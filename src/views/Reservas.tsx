import { useNavigate } from 'react-router-dom';
import { useReservasVM } from '../viewmodels/useReservasVM';
import { ShieldPlus, ArrowLeft, Stethoscope, User, Building2, MapPin } from 'lucide-react';

export default function Reservas() {
  const navigate = useNavigate();
  const vm = useReservasVM();

  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col h-screen">
      <header className="bg-surface-container-lowest border-b border-surface-variant h-16 flex items-center gap-4 px-8">
        <button onClick={() => navigate(-1)} className="text-outline"><ArrowLeft /></button>
        <div className="h-6 w-px bg-surface-variant"></div>
        <h1 className="text-primary font-bold"><ShieldPlus className="inline mr-2" /> RedNorte</h1>
      </header>

      <main className="flex-1 overflow-y-auto p-8 flex justify-center bg-surface-container-low">
        <div className="max-w-4xl w-full flex flex-col gap-8">
          
          {/* PASO 1: CENTRO MÉDICO */}
          <div className="bg-surface-container-lowest rounded-[32px] p-8 border border-outline-variant shadow-sm">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3"><Building2 className="text-primary" /> 1. Selecciona un Centro Médico</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {vm.centros?.map(c => (
                <div 
                  key={c.id} 
                  onClick={() => vm.setCentroSelec(c)} 
                  className={`p-6 rounded-2xl cursor-pointer border-2 transition-all flex flex-col gap-2 ${
                    vm.centroSelec?.id === c.id 
                      ? 'border-primary bg-primary-container/20 ring-1 ring-primary' 
                      : 'border-outline-variant hover:border-primary/50 bg-surface-container-low'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <span className="font-bold text-lg">{c.nombreSucursal}</span>
                    <MapPin className={`w-5 h-5 ${vm.centroSelec?.id === c.id ? 'text-primary' : 'text-on-surface-variant'}`} />
                  </div>
                  <span className="text-sm text-on-surface-variant">{c.comuna}, {c.region}</span>
                </div>
              ))}
            </div>
          </div>

          {/* PASO 2: ESPECIALIDAD */}
          {vm.centroSelec && (
            <div className="bg-surface-container-lowest rounded-[32px] p-8 border border-outline-variant shadow-sm animate-in fade-in slide-in-from-top-4 duration-500">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3"><Stethoscope className="text-primary" /> 2. Selecciona una Especialidad</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {vm.especialidades?.map(esp => (
                  <div 
                    key={esp.id} 
                    onClick={() => vm.setEspSelec(esp)} 
                    className={`p-5 rounded-2xl cursor-pointer border-2 transition-all flex items-center gap-3 ${
                      vm.espSelec?.id === esp.id 
                        ? 'border-primary bg-primary-container/20 ring-1 ring-primary' 
                        : 'border-outline-variant hover:border-primary/50 bg-surface-container-low'
                    }`}
                  >
                    <Stethoscope className="w-5 h-5 text-primary" />
                    <span className="font-bold">{esp.nombre}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PASO 3: MÉDICO */}
          {vm.espSelec && (
            <div className="bg-surface-container-lowest rounded-[32px] p-8 border border-outline-variant shadow-sm animate-in fade-in slide-in-from-top-4 duration-500">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3"><User className="text-primary" /> 3. Selecciona un Médico</h2>
              {vm.loadMed ? (
                <p className="text-center py-8">Cargando médicos...</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {vm.medicos?.map(m => (
                    <div 
                      key={m.id} 
                      onClick={() => vm.setMedicoSelec(m)} 
                      className={`p-6 rounded-2xl cursor-pointer border-2 transition-all flex items-center gap-4 ${
                        vm.medicoSelec?.id === m.id 
                          ? 'border-primary bg-primary-container/20 ring-1 ring-primary' 
                          : 'border-outline-variant hover:border-primary/50 bg-surface-container-low'
                      }`}
                    >
                      <div className="p-3 bg-primary-container/30 rounded-full">
                        <User className="text-primary" />
                      </div>
                      <div>
                        <span className="font-bold block text-lg">{m.nombreCompleto}</span>
                        <span className="text-sm text-on-surface-variant">Médico Especialista</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* PASO FINAL: FECHA Y CONFIRMACIÓN */}
          {vm.medicoSelec && (
            <div className="bg-surface-container-lowest rounded-[32px] p-8 border border-outline-variant shadow-sm animate-in fade-in slide-in-from-top-4 duration-500 mb-20">
              <h2 className="text-2xl font-bold mb-6">4. Elige Fecha y Hora</h2>
              <div className="grid grid-cols-1 gap-6">
                <input 
                  type="datetime-local" 
                  onChange={e => vm.setFechaHora(e.target.value)} 
                  className="w-full p-4 rounded-2xl bg-surface-container-high border-none text-on-surface focus:ring-2 focus:ring-primary outline-none text-lg" 
                />
                
                {vm.error && (
                  <div className="p-4 rounded-2xl bg-error-container/20 border border-error text-error text-center font-medium animate-in fade-in slide-in-from-top-2">
                    {vm.error}
                  </div>
                )}
                
                <button 
                  onClick={vm.confirmarReserva} 
                  disabled={!vm.fechaHora || vm.isSubmitting} 
                  className="w-full bg-primary text-on-primary py-5 rounded-[24px] font-bold text-xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-100 transition-all disabled:opacity-50 disabled:hover:scale-100 mt-4"
                >
                  {vm.isSubmitting ? 'Procesando...' : 'Confirmar Cita Médica'}
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}