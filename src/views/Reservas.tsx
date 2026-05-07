import { useNavigate } from 'react-router-dom';
import { useReservasVM } from '../viewmodels/useReservasVM';
import { ShieldPlus, ArrowLeft, Stethoscope, User, MapPin} from 'lucide-react';

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
      <main className="flex-1 overflow-y-auto p-8 flex justify-center">
        <div className="max-w-4xl w-full flex flex-col gap-8">
          <div className="bg-surface-container-lowest rounded-xl p-8 border border-surface-variant">
            <h2 className="text-2xl font-bold mb-6">Selecciona una Especialidad</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {vm.especialidades?.map(esp => (
                <div key={esp.id} onClick={() => { vm.setEspSelec(esp); vm.setMedicoSelec(null); }} className={`border-2 p-4 rounded-lg cursor-pointer ${vm.espSelec?.id === esp.id ? 'border-primary bg-primary-fixed/20' : 'border-surface-variant hover:border-primary/50'}`}>
                  <Stethoscope className="mb-2 text-primary" /> <span className="font-bold">{esp.nombre}</span>
                </div>
              ))}
            </div>
            
            {vm.espSelec && (
              <div className="mt-8 pt-8 border-t border-surface-variant">
                <h2 className="text-xl font-bold mb-4">Médicos Disponibles</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {vm.medicos?.map(m => (
                    <div key={m.id} onClick={() => vm.setMedicoSelec(m)} className={`border-2 p-4 rounded-lg cursor-pointer flex items-center gap-3 ${vm.medicoSelec?.id === m.id ? 'border-primary bg-primary-fixed/20' : 'border-surface-variant hover:border-primary/50'}`}>
                      <User className="text-primary" /> <div><span className="font-bold block">{m.nombreCompleto}</span><span className="text-xs text-outline">Médico Especialista</span></div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {vm.medicoSelec && (
              <div className="mt-8 pt-8 border-t border-surface-variant grid grid-cols-2 gap-6">
                <div>
                  <label className="text-xs font-bold text-outline uppercase">Centro Médico</label>
                  <select onChange={e => vm.setCentroSelec(vm.centros?.find(c => c.id === Number(e.target.value)))} className="w-full mt-2 p-3 rounded-lg border border-surface-variant">
                    <option value="">Selecciona...</option>
                    {vm.centros?.map(c => <option key={c.id} value={c.id}>{c.nombreSucursal} ({c.comuna})</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-outline uppercase">Fecha y Hora</label>
                  <input type="datetime-local" onChange={e => vm.setFechaHora(e.target.value)} className="w-full mt-2 p-3 rounded-lg border border-surface-variant" />
                </div>
              </div>
            )}

            <button onClick={vm.confirmarReserva} disabled={!vm.medicoSelec || !vm.centroSelec || !vm.fechaHora || vm.isSubmitting} className="w-full mt-8 bg-primary text-white py-4 rounded-lg font-bold disabled:opacity-50 transition-colors">
              Confirmar Reserva
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}