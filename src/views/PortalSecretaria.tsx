import { useMemo, useState } from 'react';
import { useSecretariaVM } from '../viewmodels/useSecretariaVM';
import { useGetUsuariosStaffQuery } from '../services/usuariosApi';
import type { IUsuario } from '../models/types';
import { Search, Plus, Calendar, CheckCircle } from 'lucide-react';
import StatCard from '../components/ui/StatCard';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import Toast from '../components/ui/Toast';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import StatusBadge from '../components/ui/StatusBadge';
import WizardReservaSecretaria from '../components/ui/organisms/WizardReservaSecretaria';

export default function PortalSecretaria() {
  const vm = useSecretariaVM();
  const { data: usuarios = [] } = useGetUsuariosStaffQuery();

  const medicosDelCentro = useMemo<IUsuario[]>(() => {
    return usuarios.filter((usuario) => usuario.rol === 'MEDICO' && usuario.centroMedico?.id === vm.centroId);
  }, [usuarios, vm.centroId]);

  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [cancelarConfig, setCancelarConfig] = useState({ isOpen: false, id: 0 });
  const [inasistenciaConfig, setInasistenciaConfig] = useState({ isOpen: false, id: 0 });

  const showMsg = (text: string, type: 'success' | 'error') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 5000);
  };

  const formatHora = (fechaString: string) => {
    return new Date(fechaString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const onCheckIn = async () => {
    const res = await vm.handleCheckIn();
    if(res) showMsg(res.success ? res.message! : res.error!, res.success ? 'success' : 'error');
  };

  const minDate = useMemo(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }, []);

  const onBloqueo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vm.bloqueoData.medicoId) {
      showMsg('Por favor seleccione un médico.', 'error');
      return;
    }
    if (!vm.bloqueoData.fecha) {
      showMsg('Por favor seleccione la fecha de la ausencia.', 'error');
      return;
    }
    
    const selectedDate = new Date(vm.bloqueoData.fecha + 'T00:00:00');
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selectedDate < today) {
      showMsg('La fecha de la ausencia no puede estar en el pasado.', 'error');
      return;
    }

    const res = await vm.handleBloqueoSubmit(e);
    if(res) showMsg(res.success ? res.message! : res.error!, res.success ? 'success' : 'error');
  };

  const confirmarCancelacion = async () => {
    const res = await vm.handleCancelarCita(cancelarConfig.id);
    if(res) showMsg(res.success ? res.message! : res.error!, res.success ? 'success' : 'error');
    setCancelarConfig({ isOpen: false, id: 0 });
  };

  const confirmarInasistencia = async () => {
    const res = await vm.handleMarcarInasistencia(inasistenciaConfig.id);
    if(res) showMsg(res.success ? res.message! : res.error!, res.success ? 'success' : 'error');
    setInasistenciaConfig({ isOpen: false, id: 0 });
  };

  if (vm.isLoading) return <div className="p-10 text-center font-bold text-slate-500">Cargando base de datos...</div>;

  return (
    <div className="animate-in fade-in duration-700 space-y-8 pb-10 relative">
      
      {message && <Toast message={message.text} type={message.type} />}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-1">Agenda y Operaciones</h1>
          <p className="text-slate-500 font-medium">
            {new Date().toLocaleDateString('es-CL', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="danger" onClick={() => vm.setShowModalBloqueo(true)}>
            Bloquear Agenda Médico
          </Button>
          <Button variant="primary" onClick={vm.openModalNuevaCita} icon={<Plus size={18} />}>
            Nueva Cita
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {vm.stats.map((stat, i) => (
          <StatCard key={i} title={stat.label} value={stat.value} subtitle={stat.sub} icon={<Calendar size={20} />} colorClass="bg-slate-100 text-[#00507d]" />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 flex flex-col gap-6">
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2"><CheckCircle className="text-[#00507d]" size={20} /> Ingreso Express</h2>
            <Input iconLeft={<Search size={18} />} value={vm.rutBusqueda} onChange={(e) => vm.setRutBusqueda(e.target.value)} placeholder="Escanear o ingresar RUT..." className="mb-4" />
            <Button onClick={onCheckIn} isLoading={vm.isUpdating} className="w-full">Confirmar Llegada (Check-In)</Button>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex-1">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-slate-900">Pendientes por Llegar</h2>
              <span className="bg-orange-50 text-orange-600 text-[10px] font-black px-2 py-1 rounded-full uppercase">Hoy</span>
            </div>
            <div className="space-y-3">
              {vm.llegadasPendientes.length === 0 && <p className="text-sm text-slate-400">No hay pacientes pendientes.</p>}
              {vm.llegadasPendientes.map(res => (
                <div key={res.id} className="p-4 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer group">
                  <div className="flex justify-between items-start mb-2">
                    <div><h4 className="font-bold text-slate-800 group-hover:text-[#00507d]">{res.paciente.nombreCompleto}</h4><p className="text-xs text-slate-400">RUT: {res.paciente.rut}</p></div>
                    <span className="font-bold text-[#00507d]">{formatHora(res.fechaHora)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-500"><div className="w-2 h-2 rounded-full bg-sky-500"></div><span>Dr. {res.medico.nombreCompleto}</span></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-8 shadow-sm flex flex-col h-[600px]">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-slate-900 italic font-serif">Horario Diario</h2>
          </div>
          
          <div className="flex-1 overflow-y-auto pr-2 space-y-6">
            {vm.reservasHoy.length === 0 && <p className="text-center text-slate-500 pt-10">Agenda libre el día de hoy.</p>}
            
            {vm.reservasHoy.map((reserva) => {
              const isConfirmada = reserva.estado === 'CONFIRMADA';
              const isCancelada = reserva.estado.includes('CANCELADA') || reserva.estado === 'NO_ASISTE';
              
              return (
                <div key={reserva.id} className="flex gap-6 min-h-[80px]">
                  <div className="w-16 text-right pt-2 text-xs font-bold text-slate-400">{formatHora(reserva.fechaHora)}</div>
                  <div className={`flex-1 border-l-2 pl-6 ${isConfirmada ? 'border-green-500' : isCancelada ? 'border-red-200' : 'border-sky-600'}`}>
                    
                    <div className={`rounded-xl p-4 shadow-sm relative group border ${isCancelada ? 'bg-red-50/50 opacity-60 border-red-100' : 'bg-sky-50 border-sky-100'}`}>
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className={`font-bold ${isCancelada ? 'text-red-700 line-through' : 'text-[#00507d]'}`}>{reserva.paciente.nombreCompleto}</h4>
                          <p className="text-xs text-slate-500 font-medium">Médico: {reserva.medico.nombreCompleto}</p>
                        </div>
                        <StatusBadge estado={reserva.estado} className="!text-[9px] !px-2 !py-0.5" />
                      </div>
                      
                      {!isCancelada && reserva.estado !== 'FINALIZADA' && (
                        <div className="flex gap-2 mt-3 pt-3 border-t border-sky-200/50">
                          <button onClick={() => setInasistenciaConfig({ isOpen: true, id: reserva.id })} className="text-[10px] font-bold text-slate-500 hover:text-red-600">Marcar Inasistencia</button>
                          <button onClick={() => setCancelarConfig({ isOpen: true, id: reserva.id })} className="text-[10px] font-bold text-red-500 hover:text-red-700 ml-auto">Cancelar / Escalar</button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={cancelarConfig.isOpen}
        title="Cancelar Cita Médica"
        message="¿Estás seguro de cancelar esta reserva? El sistema validará la regla de penalización de 24 horas automáticamente."
        isDestructive={true}
        confirmText="Cancelar Reserva"
        isLoading={vm.isCanceling}
        onConfirm={confirmarCancelacion}
        onCancel={() => setCancelarConfig({ isOpen: false, id: 0 })}
      />

      <ConfirmDialog
        isOpen={inasistenciaConfig.isOpen}
        title="Marcar Inasistencia"
        message="¿Confirmas que el paciente no se presentó a su cita médica programada?"
        confirmText="Marcar como Inasistente"
        isLoading={vm.isUpdating}
        onConfirm={confirmarInasistencia}
        onCancel={() => setInasistenciaConfig({ isOpen: false, id: 0 })}
      />

      <WizardReservaSecretaria
        isOpen={vm.showModalNuevaCita}
        centroId={vm.centroId}
        onClose={() => vm.setShowModalNuevaCita(false)}
        onSuccess={(msg) => showMsg(msg, 'success')}
      />

      <Modal
        isOpen={vm.showModalBloqueo}
        onClose={() => vm.setShowModalBloqueo(false)}
        title="Bloquear Agenda Médica"
        maxWidth="sm"
        footer={<div className="flex gap-3"><Button variant="outline" type="button" onClick={() => vm.setShowModalBloqueo(false)} className="flex-1">Cancelar</Button><Button variant="danger" type="submit" form="form-bloqueo-agenda" isLoading={vm.isBloqueando} className="flex-1">Ejecutar Bloqueo</Button></div>}
      >
        <form id="form-bloqueo-agenda" onSubmit={onBloqueo} className="space-y-4">
          <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-xs text-red-800 font-medium">Esta acción cancelará todas las citas del médico en la fecha indicada y encenderá de forma autónoma el motor reactivo de reasignación.</div>
          <div>
            <label className="block text-sm font-medium text-on-surface ml-1 mb-1">Médico ausente *</label>
            <select
              value={vm.bloqueoData.medicoId}
              onChange={(e) => vm.setBloqueoData({ ...vm.bloqueoData, medicoId: e.target.value })}
              className="w-full rounded-2xl bg-surface-container-high px-4 py-3.5 text-sm outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Seleccione un médico disponible</option>
              {medicosDelCentro.map((medico) => (
                <option key={medico.id} value={medico.id}>
                  {medico.nombreCompleto}{medico.especialidades?.[0]?.nombre ? ` — ${medico.especialidades[0].nombre}` : ''}
                </option>
              ))}
            </select>
          </div>
          <Input label="Fecha de la Ausencia *" type="date" min={minDate} value={vm.bloqueoData.fecha} onChange={e => vm.setBloqueoData({...vm.bloqueoData, fecha: e.target.value})} />
        </form>
      </Modal>
    </div>
  );
}