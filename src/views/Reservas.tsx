import { useNavigate } from 'react-router-dom';
import { useReservasVM } from '../viewmodels/useReservasVM';
import { ShieldPlus, ArrowLeft, Stethoscope, User, Building2 } from 'lucide-react';
import Button from '../components/ui/Button';
import { useMemo } from 'react';

export default function Reservas() {
  const navigate = useNavigate();
  const vm = useReservasVM();

  const minDateTime = useMemo(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col h-screen overflow-y-auto">
      <header className="bg-surface-container-lowest border-b border-surface-variant h-16 flex items-center gap-4 px-8 shrink-0">
        <button onClick={() => navigate(-1)} className="text-outline"><ArrowLeft /></button>
        <div className="h-6 w-px bg-surface-variant"></div>
        <h1 className="text-primary font-bold"><ShieldPlus className="inline mr-2" /> RedNorte</h1>
      </header>

      <main className="flex-1 p-8 flex justify-center bg-surface-container-low">
        <div className="max-w-4xl w-full flex flex-col gap-8 pb-20">
          
          <div className="bg-surface-container-lowest rounded-[32px] p-8 border border-outline-variant shadow-sm">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3"><Building2 className="text-primary" /> 1. Centro Médico</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {vm.centros?.map(c => (
                <div key={c.id} onClick={() => vm.setCentroSelec(c)} className={`p-6 rounded-2xl cursor-pointer border-2 transition-all ${vm.centroSelec?.id === c.id ? 'border-primary bg-primary-container/20' : 'border-outline-variant hover:border-primary/50'}`}>
                  <div className="font-bold text-lg">{c.nombreSucursal}</div>
                  <div className="text-sm text-on-surface-variant">{c.comuna}, {c.region}</div>
                </div>
              ))}
            </div>
          </div>

          {vm.centroSelec && (
            <div className="bg-surface-container-lowest rounded-[32px] p-8 border border-outline-variant shadow-sm">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3"><Stethoscope className="text-primary" /> 2. Especialidad</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {vm.especialidades?.map(esp => (
                  <div key={esp.id} onClick={() => vm.setEspSelec(esp)} className={`p-5 rounded-2xl cursor-pointer border-2 ${vm.espSelec?.id === esp.id ? 'border-primary bg-primary-container/20' : 'border-outline-variant hover:border-primary/50'}`}>
                    <span className="font-bold">{esp.nombre}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {vm.espSelec && (
            <div className="bg-surface-container-lowest rounded-[32px] p-8 border border-outline-variant shadow-sm">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3"><User className="text-primary" /> 3. Médico</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {vm.medicos?.map(m => (
                  <div key={m.id} onClick={() => vm.setMedicoSelec(m)} className={`p-6 rounded-2xl cursor-pointer border-2 ${vm.medicoSelec?.id === m.id ? 'border-primary bg-primary-container/20' : 'border-outline-variant hover:border-primary/50'}`}>
                    <span className="font-bold text-lg">{m.nombreCompleto}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {vm.medicoSelec && (
            <div className="bg-surface-container-lowest rounded-[32px] p-8 border border-outline-variant shadow-sm">
              <h2 className="text-2xl font-bold mb-6">4. Fecha y Hora</h2>
              <input type="datetime-local" min={minDateTime} onChange={e => vm.setFechaHora(e.target.value)} className="w-full p-4 rounded-2xl bg-surface-container-high border-none outline-none mb-4" />
              {vm.error && <p className="text-error font-bold text-center mb-4">{vm.error}</p>}
              <Button onClick={vm.confirmarReserva} isLoading={vm.isSubmitting} className="w-full !text-xl">
                Confirmar Cita Médica
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}