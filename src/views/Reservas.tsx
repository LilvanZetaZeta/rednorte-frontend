import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useReservasVM } from '../viewmodels/useReservasVM';
import { ShieldPlus, ArrowLeft, Stethoscope, User, Building2, CalendarDays, ArrowRight } from 'lucide-react';
import Button from '../components/ui/Button';
import Toast from '../components/ui/Toast';

export default function Reservas() {
  const navigate = useNavigate();
  const vm = useReservasVM();

  const [step, setStep] = useState(1);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const handleVolver = () => {
    if (step > 1) setStep(step - 1);
    else navigate(-1);
  };

  const handleConfirmar = async () => {
    try {
      await vm.confirmarReserva();
      if (!vm.error) {
        setMessage({ text: '¡Cita médica reservada con éxito!', type: 'success' });
        setTimeout(() => setMessage(null), 2000);
      } else {
        setMessage({ text: vm.error || 'No se pudo realizar la reserva', type: 'error' });
        setTimeout(() => setMessage(null), 5000);
      }
    } catch {
      setMessage({ text: 'Ocurrió un error inesperado al procesar la cita.', type: 'error' });
      setTimeout(() => setMessage(null), 5000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col h-screen overflow-hidden">

      {message && <Toast message={message.text} type={message.type} />}

      {/* Header */}
      <header className="bg-surface-container-lowest border-b border-surface-variant h-16 flex items-center gap-4 px-8 shrink-0">
        <button onClick={handleVolver} className="text-outline hover:text-primary transition-colors">
          <ArrowLeft />
        </button>
        <div className="h-6 w-px bg-surface-variant"></div>
        <h1 className="text-primary font-bold flex items-center">
          <ShieldPlus className="inline mr-2" /> RedNorte
        </h1>
      </header>

      {/* Main Layout */}
      <main className="flex-1 p-8 bg-surface-container-low overflow-y-auto custom-scrollbar flex justify-center">
        <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-3 gap-8 items-start pb-20">

          {/* COLUMNA IZQUIERDA */}
          <div className="lg:col-span-2 space-y-6">

            {/* PASO 1: CENTRO MÉDICO */}
            {step === 1 && (
              <div className="bg-surface-container-lowest rounded-[32px] p-8 border border-outline-variant shadow-sm animate-fade-in">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                  <Building2 className="text-primary" /> 1. Centro Médico
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {vm.centros?.map(c => (
                    <div
                      key={c.id}
                      onClick={() => { vm.setCentroSelec(c); setStep(2); }}
                      className={`p-6 rounded-2xl cursor-pointer border-2 transition-all flex flex-col justify-between ${vm.centroSelec?.id === c.id
                        ? 'border-primary bg-primary-container/20'
                        : 'border-outline-variant hover:border-primary/50'
                        }`}
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
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                  <Stethoscope className="text-primary" /> 2. Especialidad
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {vm.especialidades?.map(esp => (
                    <div
                      key={esp.id}
                      onClick={() => { vm.setEspSelec(esp); setStep(3); }}
                      className={`p-5 rounded-2xl cursor-pointer border-2 transition-all flex items-center justify-between ${vm.espSelec?.id === esp.id
                        ? 'border-primary bg-primary-container/20'
                        : 'border-outline-variant hover:border-primary/50'
                        }`}
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
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                  <User className="text-primary" /> 3. Médico
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {vm.medicos?.map(m => (
                    <div
                      key={m.id}
                      onClick={() => { vm.setMedicoSelec(m); setStep(4); }}
                      className={`p-6 rounded-2xl cursor-pointer border-2 transition-all flex items-center justify-between ${vm.medicoSelec?.id === m.id
                        ? 'border-primary bg-primary-container/20'
                        : 'border-outline-variant hover:border-primary/50'
                        }`}
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
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                  <CalendarDays className="text-primary" /> 4. Fecha y Hora
                </h2>

                {/* Selector de día */}
                <div className="mb-6">
                  <label className="block text-sm font-bold text-on-surface-variant mb-2 uppercase tracking-wider">
                    Selecciona el día
                  </label>
                  <input
                    type="date"
                    min={vm.hoy}
                    value={vm.fechaSelec}
                    onChange={e => { vm.setFechaSelec(e.target.value); vm.setSlotSelec(''); }}
                    className="w-full p-4 rounded-2xl bg-surface-container-high border border-outline-variant outline-none text-on-surface focus:ring-2 focus:ring-primary"
                  />
                </div>

                {/* Grid de slots — solo aparece cuando hay fecha seleccionada */}
                {vm.fechaSelec && (
                  <div>
                    <label className="block text-sm font-bold text-on-surface-variant mb-3 uppercase tracking-wider">
                      Horarios disponibles
                    </label>

                    {vm.loadSlots && (
                      <p className="text-on-surface-variant text-sm text-center py-4">
                        Cargando horarios...
                      </p>
                    )}

                    {!vm.loadSlots && vm.slots && vm.slots.length === 0 && (
                      <p className="text-error font-medium text-center py-4">
                        No hay horarios disponibles para este médico en la fecha seleccionada.
                      </p>
                    )}

                    {!vm.loadSlots && vm.slots && vm.slots.length > 0 && (
                      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                        {vm.slots.map(slot => {
                          const hora = new Date(slot).toLocaleTimeString('es-CL', {
                            hour: '2-digit',
                            minute: '2-digit',
                          });
                          const seleccionado = vm.slotSelec === slot;
                          return (
                            <button
                              key={slot}
                              type="button"
                              onClick={() => vm.setSlotSelec(slot)}
                              className={`py-2.5 rounded-xl text-sm font-bold border-2 transition-all ${seleccionado
                                ? 'border-primary bg-primary text-on-primary'
                                : 'border-outline-variant bg-surface-container-high text-on-surface hover:border-primary/60'
                                }`}
                            >
                              {hora}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}

                {vm.error && (
                  <p className="text-error font-bold text-center mt-4 mb-2 animate-bounce">
                    {vm.error}
                  </p>
                )}

                <Button
                  onClick={handleConfirmar}
                  isLoading={vm.isSubmitting}
                  disabled={!vm.slotSelec}
                  className="w-full !text-xl mt-6"
                >
                  Confirmar Cita Médica
                </Button>
              </div>
            )}

          </div>

          {/* COLUMNA DERECHA: PANEL DE RESUMEN */}
          <div className="lg:col-span-1 bg-surface-container-lowest border border-outline-variant rounded-[32px] p-6 shadow-md sticky top-0 lg:max-h-[calc(100vh-120px)] flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-xl text-on-surface border-b border-surface-variant pb-4 mb-5 flex items-center gap-2">
                Resumen de Reserva
              </h3>

              <div className="space-y-5">

                {/* Centro */}
                <div
                  onClick={() => vm.centroSelec && setStep(1)}
                  className={`transition-all p-2 rounded-xl ${vm.centroSelec ? 'cursor-pointer hover:bg-surface-container-high/60' : ''}`}
                >
                  <p className="text-xs font-bold text-primary uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5" /> Centro Médico
                  </p>
                  <p className="font-medium text-sm text-on-surface">
                    {vm.centroSelec
                      ? vm.centroSelec.nombreSucursal
                      : <span className="text-on-surface-variant/50 italic font-normal">No seleccionado todavía</span>
                    }
                  </p>
                </div>

                {/* Especialidad */}
                <div
                  onClick={() => vm.espSelec && setStep(2)}
                  className={`transition-all p-2 rounded-xl ${vm.espSelec ? 'cursor-pointer hover:bg-surface-container-high/60' : ''}`}
                >
                  <p className="text-xs font-bold text-primary uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <Stethoscope className="w-3.5 h-3.5" /> Especialidad
                  </p>
                  <p className="font-medium text-sm text-on-surface">
                    {vm.espSelec
                      ? vm.espSelec.nombre
                      : <span className="text-on-surface-variant/50 italic font-normal">No seleccionada todavía</span>
                    }
                  </p>
                </div>

                {/* Médico */}
                <div
                  onClick={() => vm.medicoSelec && setStep(3)}
                  className={`transition-all p-2 rounded-xl ${vm.medicoSelec ? 'cursor-pointer hover:bg-surface-container-high/60' : ''}`}
                >
                  <p className="text-xs font-bold text-primary uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5" /> Médico
                  </p>
                  <p className="font-medium text-sm text-on-surface">
                    {vm.medicoSelec
                      ? vm.medicoSelec.nombreCompleto
                      : <span className="text-on-surface-variant/50 italic font-normal">No seleccionado todavía</span>
                    }
                  </p>
                </div>

                {/* Fecha y Hora — ahora muestra el slot seleccionado */}
                <div className="p-2">
                  <p className="text-xs font-bold text-primary uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <CalendarDays className="w-3.5 h-3.5" /> Fecha y Hora
                  </p>
                  <p className="font-medium text-sm text-on-surface">
                    {vm.slotSelec
                      ? new Date(vm.slotSelec).toLocaleString('es-CL', { dateStyle: 'short', timeStyle: 'short' })
                      : <span className="text-on-surface-variant/50 italic font-normal">No agendada todavía</span>
                    }
                  </p>
                </div>
              </div>
            </div>
            {/* Botón volver */}
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