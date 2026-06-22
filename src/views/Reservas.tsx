import { useNavigate } from 'react-router-dom';
import { useReservasVM } from '../viewmodels/useReservasVM';
import { ShieldPlus, ArrowLeft, Stethoscope, User, Building2, CalendarDays, ArrowRight } from 'lucide-react';
import Button from '../components/ui/Button';
import Toast from '../components/ui/Toast'; 
import { useMemo, useState } from 'react';

export default function Reservas() {
  const navigate = useNavigate();
  const vm = useReservasVM();
  
  // Estado para controlar el paso actual del flujo
  const [step, setStep] = useState(1);
  
  // Estado local para controlar la visibilidad del Toast de éxito o error
  const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);

  const minDateTime = useMemo(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }, []);

  // Función para retroceder de paso de forma segura
  const handleVolver = () => {
    if (step > 1) setStep(step - 1);
    else navigate(-1);
  };

  // Intercepta la confirmación de la reserva para mostrar el Toast antes de salir
  const handleConfirmar = async () => {
    try {
      // 1. Ejecutamos la reserva
      await vm.confirmarReserva();
      
      // 2. Evaluamos si falló o fue un éxito
      if (!vm.error) {
        // Levantamos el aviso verde de éxito
        setMessage({ text: '¡Cita médica reservada con éxito!', type: 'success' });
        
        setTimeout(() => setMessage(null), 2000);
        
      } else {
        setMessage({ text: vm.error || 'No se pudo realizar la reserva', type: 'error' });
        setTimeout(() => setMessage(null), 5000);
      }
    } catch (err) {
      setMessage({ text: 'Ocurrió un error inesperado al procesar la cita.', type: 'error' });
      setTimeout(() => setMessage(null), 5000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col h-screen overflow-hidden">
      
      {/* RENDERIZADO DEL TOAST */}
      {message && <Toast message={message.text} type={message.type} />}

      {/* Header */}
      <header className="bg-surface-container-lowest border-b border-surface-variant h-16 flex items-center gap-4 px-8 shrink-0">
        <button onClick={handleVolver} className="text-outline hover:text-primary transition-colors">
          <ArrowLeft />
        </button>
        <div className="h-6 w-px bg-surface-variant"></div>
        <h1 className="text-primary font-bold flex items-center"><ShieldPlus className="inline mr-2" /> RedNorte</h1>
      </header>

      {/* Main Layout */}
      <main className="flex-1 p-8 bg-surface-container-low overflow-y-auto custom-scrollbar flex justify-center">
        <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-3 gap-8 items-start pb-20">
          
          {/* COLUMNA IZQUIERDA: FORMULARIO DINÁMICO POR PASOS */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* PASO 1: CENTRO MÉDICO */}
            {step === 1 && (
              <div className="bg-surface-container-lowest rounded-[32px] p-8 border border-outline-variant shadow-sm animate-fade-in">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-3"><Building2 className="text-primary" /> 1. Centro Médico</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {vm.centros?.map(c => (
                    <div 
                      key={c.id} 
                      onClick={() => {
                        vm.setCentroSelec(c);
                        setStep(2);
                      }} 
                      className={`p-6 rounded-2xl cursor-pointer border-2 transition-all flex flex-col justify-between ${vm.centroSelec?.id === c.id ? 'border-primary bg-primary-container/20' : 'border-outline-variant hover:border-primary/50'}`}
                    >
                      <div>
                        <div className="font-bold text-lg text-on-surface">{c.nombreSucursal}</div>
                        <div className="text-sm text-on-surface-variant mt-1">{c.comuna}, {c.region}</div>
                      </div>
                      <div className="mt-4 flex justify-end text-primary font-medium text-sm gap-1 items-center">
                        Seleccionar <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* PASO 2: ESPECIALIDAD */}
            {step === 2 && (
              <div className="bg-surface-container-lowest rounded-[32px] p-8 border border-outline-variant shadow-sm animate-fade-in">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-3"><Stethoscope className="text-primary" /> 2. Especialidad</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {vm.especialidades?.map(esp => (
                    <div 
                      key={esp.id} 
                      onClick={() => {
                        vm.setEspSelec(esp);
                        setStep(3);
                      }} 
                      className={`p-5 rounded-2xl cursor-pointer border-2 transition-all flex items-center justify-between ${vm.espSelec?.id === esp.id ? 'border-primary bg-primary-container/20' : 'border-outline-variant hover:border-primary/50'}`}
                    >
                      <span className="font-bold text-on-surface">{esp.nombre}</span>
                      <ArrowRight className="w-4 h-4 text-primary" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* PASO 3: MÉDICO */}
            {step === 3 && (
              <div className="bg-surface-container-lowest rounded-[32px] p-8 border border-outline-variant shadow-sm animate-fade-in">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-3"><User className="text-primary" /> 3. Médico</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {vm.medicos?.map(m => (
                    <div 
                      key={m.id} 
                      onClick={() => {
                        vm.setMedicoSelec(m);
                        setStep(4);
                      }} 
                      className={`p-6 rounded-2xl cursor-pointer border-2 transition-all flex items-center justify-between ${vm.medicoSelec?.id === m.id ? 'border-primary bg-primary-container/20' : 'border-outline-variant hover:border-primary/50'}`}
                    >
                      <span className="font-bold text-lg text-on-surface">{m.nombreCompleto}</span>
                      <ArrowRight className="w-4 h-4 text-primary" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* PASO 4: FECHA Y HORA */}
            {step === 4 && (
              <div className="bg-surface-container-lowest rounded-[32px] p-8 border border-outline-variant shadow-sm animate-fade-in">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-3"><CalendarDays className="text-primary" /> 4. Fecha y Hora</h2>
                <input 
                  type="datetime-local" 
                  min={minDateTime} 
                  onChange={e => vm.setFechaHora(e.target.value)} 
                  className="w-full p-4 rounded-2xl bg-surface-container-high border border-outline-variant outline-none mb-4 text-on-surface focus:ring-2 focus:ring-primary" 
                />
                
                {vm.error && <p className="text-error font-bold text-center mb-4 animate-bounce">{vm.error}</p>}
                
                <Button onClick={handleConfirmar} isLoading={vm.isSubmitting} className="w-full !text-xl mt-2">
                  Confirmar Cita Médica
                </Button>
              </div>
            )}

          </div>

          {/* COLUMNA DERECHA: PANEL DE RESUMEN ACUMULATIVO */}
          <div className="lg:col-span-1 bg-surface-container-lowest border border-outline-variant rounded-[32px] p-6 shadow-md sticky top-0 lg:max-h-[calc(100vh-120px)] flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-xl text-on-surface border-b border-surface-variant pb-4 mb-5 flex items-center gap-2">
                Resumen de Reserva
              </h3>
              
              <div className="space-y-5">
                {/* Detalle Centro */}
                <div onClick={() => vm.centroSelec && setStep(1)} className={`transition-all p-2 rounded-xl ${vm.centroSelec ? 'cursor-pointer hover:bg-surface-container-high/60' : ''}`}>
                  <p className="text-xs font-bold text-primary uppercase tracking-wider mb-1 flex items-center gap-1.5"><Building2 className="w-3.5 h-3.5" /> Centro Médico</p>
                  <p className="font-medium text-sm text-on-surface">
                    {vm.centroSelec ? vm.centroSelec.nombreSucursal : <span className="text-on-surface-variant/50 italic font-normal">No seleccionado todavía</span>}
                  </p>
                </div>

                {/* Detalle Especialidad */}
                <div onClick={() => vm.espSelec && setStep(2)} className={`transition-all p-2 rounded-xl ${vm.espSelec ? 'cursor-pointer hover:bg-surface-container-high/60' : ''}`}>
                  <p className="text-xs font-bold text-primary uppercase tracking-wider mb-1 flex items-center gap-1.5"><Stethoscope className="w-3.5 h-3.5" /> Especialidad</p>
                  <p className="font-medium text-sm text-on-surface">
                    {vm.espSelec ? vm.espSelec.nombre : <span className="text-on-surface-variant/50 italic font-normal">No seleccionada todavía</span>}
                  </p>
                </div>

                {/* Detalle Médico */}
                <div onClick={() => vm.medicoSelec && setStep(3)} className={`transition-all p-2 rounded-xl ${vm.medicoSelec ? 'cursor-pointer hover:bg-surface-container-high/60' : ''}`}>
                  <p className="text-xs font-bold text-primary uppercase tracking-wider mb-1 flex items-center gap-1.5"><User className="w-3.5 h-3.5" /> Médico</p>
                  <p className="font-medium text-sm text-on-surface">
                    {vm.medicoSelec ? vm.medicoSelec.nombreCompleto : <span className="text-on-surface-variant/50 italic font-normal">No seleccionado todavía</span>}
                  </p>
                </div>

                {/* Detalle Fecha y Hora */}
                <div className="p-2">
                  <p className="text-xs font-bold text-primary uppercase tracking-wider mb-1 flex items-center gap-1.5"><CalendarDays className="w-3.5 h-3.5" /> Fecha y Hora</p>
                  <p className="font-medium text-sm text-on-surface">
                    {vm.fechaHora ? new Date(vm.fechaHora).toLocaleString('es-CL', { dateStyle: 'short', timeStyle: 'short' }) : <span className="text-on-surface-variant/50 italic font-normal">No agendada todavía</span>}
                  </p>
                </div>
              </div>
            </div>

            {/* Botón inferior de retroceso interno */}
            {step > 1 && (
              <div className="mt-8 pt-4 border-t border-surface-variant/60">
                <button 
                  onClick={handleVolver} 
                  className="w-full py-2.5 rounded-xl border border-outline text-sm font-bold text-on-surface-variant hover:bg-surface-container-high transition-all"
                >
                  ← Volver al paso anterior
                </button>
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}