import { usePortalDoctorVM } from '../viewmodels/usePortalDoctorVM';
import { Stethoscope, ClipboardList, CheckCircle, Clock, UserSquare2, FileText, ChevronRight } from 'lucide-react';

export default function PortalDoctor() {
  const vm = usePortalDoctorVM();

  if (vm.isLoading) return <div className="p-12 text-center text-sky-700 animate-pulse">Cargando tu agenda clínica...</div>;

  return (
    <div className="animate-in fade-in duration-700 space-y-8 pb-10 max-w-7xl mx-auto">
      <section className="flex justify-between items-end border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 mb-1">Box de Atención</h1>
          <p className="text-slate-500 font-medium">Dr/a. {vm.doctorName}</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-full border border-emerald-100 text-emerald-700 font-bold text-sm">
          <Stethoscope className="w-4 h-4" /> Turno Activo
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* COLUMNA IZQUIERDA: AGENDA DEL DÍA */}
        <div className="lg:col-span-1 bg-white border border-slate-200 rounded-2xl shadow-sm flex flex-col h-[700px]">
          <div className="p-6 border-b border-slate-100 bg-slate-50 rounded-t-2xl flex justify-between items-center">
            <h2 className="font-bold text-slate-800 flex items-center gap-2"><ClipboardList size={20} className="text-[#00507d]"/> Pacientes Hoy</h2>
            <span className="bg-[#00507d] text-white text-xs font-bold px-2.5 py-1 rounded-full">{vm.agendaHoy.length}</span>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {vm.agendaHoy.length === 0 ? (
              <div className="text-center text-slate-400 py-10"><CheckCircle size={32} className="mx-auto mb-2 opacity-30"/> No tienes pacientes en espera.</div>
            ) : (
              vm.agendaHoy.map((res: any) => (
                <div 
                  key={res.id} 
                  onClick={() => vm.handleLlamarPaciente(res)}
                  className={`p-4 border rounded-xl cursor-pointer transition-all ${vm.pacienteActivo?.id === res.id ? 'border-[#00507d] bg-sky-50 shadow-md scale-[1.02]' : 'border-slate-200 hover:border-sky-300 hover:bg-slate-50'}`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-slate-900 text-sm">{res.paciente.nombreCompleto}</h3>
                    <span className="text-[10px] font-bold uppercase bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full">{res.estado}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span className="flex items-center gap-1"><Clock size={12}/> {new Date(res.fechaHora).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                    <ChevronRight size={16} className={vm.pacienteActivo?.id === res.id ? 'text-[#00507d]' : 'text-slate-300'} />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* COLUMNA DERECHA: FICHA CLÍNICA (PACIENTE ACTIVO) */}
        <div className="lg:col-span-2">
          {vm.pacienteActivo ? (
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm h-[700px] flex flex-col animate-in slide-in-from-right-8">
              {/* Info del Paciente */}
              <div className="p-8 border-b border-slate-100 bg-[#f7f9fe] rounded-t-2xl flex items-start gap-6">
                <div className="w-20 h-20 bg-white border border-slate-200 rounded-2xl flex items-center justify-center text-slate-300 shadow-sm shrink-0">
                  <UserSquare2 size={40} />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-black text-slate-900">{vm.pacienteActivo.paciente.nombreCompleto}</h2>
                  <div className="flex gap-4 mt-2 text-sm font-medium text-slate-500">
                    <span>RUT: {vm.pacienteActivo.paciente.rut}</span>
                    <span>•</span>
                    <span>Correo: {vm.pacienteActivo.paciente.correo}</span>
                  </div>
                </div>
              </div>

              {/* Evolución Clínica */}
              <div className="p-8 flex-1 flex flex-col gap-4">
                <h3 className="font-bold text-slate-800 flex items-center gap-2"><FileText size={18} className="text-[#00507d]"/> Registro de Atención</h3>
                <textarea 
                  className="w-full flex-1 border border-slate-200 rounded-xl p-4 bg-slate-50 outline-none focus:border-[#00507d] focus:bg-white transition-all resize-none"
                  placeholder="Escriba la evolución clínica, anamnesis, diagnóstico y tratamiento aquí..."
                ></textarea>
                
                <div className="flex justify-end gap-4 pt-4 border-t border-slate-100">
                  <button onClick={() => vm.setPacienteActivo(null)} className="px-6 py-3 font-bold text-slate-500 hover:bg-slate-100 rounded-xl transition-colors">Cerrar Ficha</button>
                  <button 
                    disabled={vm.isUpdating}
                    onClick={() => vm.handleFinalizarAtencion(vm.pacienteActivo.id)} 
                    className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/20 transition-all disabled:opacity-50 flex items-center gap-2"
                  >
                    <CheckCircle size={18} /> {vm.isUpdating ? 'Guardando...' : 'Finalizar Consulta'}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl h-[700px] flex flex-col items-center justify-center text-slate-400 p-12 text-center">
              <Stethoscope size={64} className="mb-4 opacity-20" />
              <h2 className="text-xl font-bold text-slate-600 mb-2">Ningún paciente seleccionado</h2>
              <p>Selecciona un paciente de tu lista de espera para abrir su ficha clínica y comenzar la atención.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}