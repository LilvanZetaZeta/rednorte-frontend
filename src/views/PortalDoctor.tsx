import { useState } from 'react';
import { usePortalDoctorVM } from '../viewmodels/usePortalDoctorVM';
import { Stethoscope, ClipboardList, CheckCircle, Clock, UserSquare2, FileText, ChevronRight } from 'lucide-react';
import Button from '../components/ui/Button';
import Toast from '../components/ui/Toast';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import type { IReserva } from '../models/types';

export default function PortalDoctor() {
  const vm = usePortalDoctorVM();
  const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);
  const [finalizarConfig, setFinalizarConfig] = useState({ isOpen: false, id: 0 });

  const showMsg = (text: string, type: 'success' | 'error') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 5000);
  };

  const confirmarFinalizacion = async () => {
    const result = await vm.handleFinalizarAtencion(finalizarConfig.id);
    if(result.success) showMsg(result.message || 'Éxito', 'success');
    else showMsg(result.error || 'Error', 'error');
    setFinalizarConfig({ isOpen: false, id: 0 });
  };

  if (vm.isLoading) return <div className="p-12 text-center text-primary animate-pulse">Cargando tu agenda clínica...</div>;

  return (
    <div className="animate-in fade-in duration-700 space-y-8 pb-10 max-w-7xl mx-auto">
      
      {message && <Toast message={message.text} type={message.type} />}

      <section className="flex justify-between items-end border-b border-outline-variant pb-6">
        <div>
          <h1 className="font-h1 text-h1 text-on-background mb-1">Box de Atención</h1>
          <p className="text-on-surface-variant font-medium">Dr/a. {vm.doctorName}</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-success-container text-success rounded-full font-bold text-sm">
          <Stethoscope className="w-4 h-4" /> Turno Activo
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-surface-container-lowest border border-outline-variant rounded-3xl shadow-sm flex flex-col h-[700px] overflow-hidden">
          <div className="p-6 border-b border-outline-variant bg-surface-container-low flex justify-between items-center shrink-0">
            <h2 className="font-bold text-on-surface flex items-center gap-2"><ClipboardList size={20} className="text-primary"/> Pacientes Hoy</h2>
            <span className="bg-primary text-on-primary text-xs font-bold px-3 py-1 rounded-full">{vm.agendaHoy.length}</span>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
            {vm.agendaHoy.length === 0 ? (
              <div className="text-center text-on-surface-variant/50 py-10"><CheckCircle size={32} className="mx-auto mb-2 opacity-50"/> No tienes pacientes en espera.</div>
            ) : (
              vm.agendaHoy.map((res: IReserva) => (
                <div key={res.id} onClick={() => vm.handleLlamarPaciente(res)} className={`p-4 border-2 rounded-2xl cursor-pointer transition-all ${vm.pacienteActivo?.id === res.id ? 'border-primary bg-primary-container/20 shadow-md' : 'border-outline-variant hover:border-primary/50 hover:bg-surface-container-low'}`}>
                  <div className="flex justify-between items-start mb-2"><h3 className="font-bold text-on-surface text-sm">{res.paciente.nombreCompleto}</h3><span className="text-[10px] font-bold uppercase bg-surface-container-high text-on-surface-variant px-2 py-0.5 rounded-full">{res.estado}</span></div>
                  <div className="flex items-center justify-between text-xs text-on-surface-variant font-medium"><span className="flex items-center gap-1"><Clock size={14}/> {new Date(res.fechaHora).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span><ChevronRight size={16} className={vm.pacienteActivo?.id === res.id ? 'text-primary' : 'text-on-surface-variant/50'} /></div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="lg:col-span-2">
          {vm.pacienteActivo ? (
            <div className="bg-surface-container-lowest border border-outline-variant rounded-3xl shadow-sm h-[700px] flex flex-col animate-in slide-in-from-right-8 overflow-hidden">
              <div className="p-8 border-b border-outline-variant bg-surface-container-low flex items-start gap-6 shrink-0">
                <div className="w-20 h-20 bg-surface-container-lowest border border-outline-variant rounded-2xl flex items-center justify-center text-on-surface-variant shadow-sm shrink-0"><UserSquare2 size={40} /></div>
                <div className="flex-1"><h2 className="text-2xl font-black text-on-surface">{vm.pacienteActivo.paciente.nombreCompleto}</h2><div className="flex gap-4 mt-2 text-sm font-medium text-on-surface-variant"><span>RUT: {vm.pacienteActivo.paciente.rut}</span><span>•</span><span>Correo: {vm.pacienteActivo.paciente.correo}</span></div></div>
              </div>
              <div className="p-8 flex-1 flex flex-col gap-4 bg-surface-container-lowest">
                <h3 className="font-bold text-on-surface flex items-center gap-2"><FileText size={18} className="text-primary"/> Registro de Atención</h3>
                <textarea className="w-full flex-1 border border-outline-variant rounded-2xl p-5 bg-surface-container-high outline-none focus:ring-2 focus:ring-primary focus:bg-surface-container-lowest transition-all resize-none text-sm" placeholder="Escriba la evolución clínica, anamnesis, diagnóstico y tratamiento aquí..."></textarea>
                <div className="flex justify-end gap-4 pt-4 border-t border-outline-variant/50">
                  <Button variant="outline" onClick={() => vm.setPacienteActivo(null)}>Cerrar Ficha</Button>
                  <Button variant="primary" onClick={() => setFinalizarConfig({isOpen: true, id: vm.pacienteActivo!.id})} icon={<CheckCircle size={18} />} className="!bg-success !text-on-success hover:!bg-success/90 !shadow-success/20">Finalizar Consulta</Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-surface-container-low border-2 border-dashed border-outline-variant rounded-3xl h-[700px] flex flex-col items-center justify-center text-on-surface-variant p-12 text-center">
              <Stethoscope size={64} className="mb-4 opacity-20" />
              <h2 className="text-xl font-bold text-on-surface mb-2">Ningún paciente seleccionado</h2>
              <p>Selecciona un paciente de tu lista de espera para abrir su ficha clínica y comenzar la atención.</p>
            </div>
          )}
        </div>
      </div>

      <ConfirmDialog
        isOpen={finalizarConfig.isOpen}
        title="Finalizar Atención Clínica"
        message="¿Estás seguro de finalizar la consulta? Esto guardará la evolución y cerrará la ficha del paciente."
        confirmText="Finalizar Atención"
        onConfirm={confirmarFinalizacion}
        onCancel={() => setFinalizarConfig({ isOpen: false, id: 0 })}
      />
    </div>
  );
}