import { Link } from 'react-router-dom';
import { usePortalPacienteVM } from '../viewmodels/usePortalPacienteVM';
import { Stethoscope, CalendarDays, User, Phone, Shield, Pencil } from 'lucide-react';
import { useState } from 'react';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Toast from '../components/ui/Toast';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import type { IReserva } from '../models/types';
import { useObtenerHistorialPorReservaQuery } from '../services/reservasApi';

export default function PortalPaciente() {
  const { userName, userRut, userEmail, reservas, perfil, isLoading, handleCancelar, handleGuardarPerfil } = usePortalPacienteVM();
  const [editandoPerfil, setEditandoPerfil] = useState(false);
  const [prevision, setPrevision] = useState('');
  const [telefono, setTelefono] = useState('');
  
  const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);
  const [cancelarConfig, setCancelarConfig] = useState({ isOpen: false, id: 0 });
  const [selectedTab, setSelectedTab] = useState<'proximas' | 'historial'>('proximas');
  const [selectedReservaId, setSelectedReservaId] = useState<number | null>(null);

  const proximasCitas = reservas.filter(r => r.estado === 'VIGENTE' || r.estado === 'CONFIRMADA');
  const historialCitas = reservas.filter(r => r.estado !== 'VIGENTE' && r.estado !== 'CONFIRMADA');

  const getEstadoBadgeClass = (estado: string) => {
    switch (estado) {
      case 'VIGENTE':
        return 'bg-blue-50 text-blue-700 border-blue-100';
      case 'CONFIRMADA':
        return 'bg-green-50 text-green-700 border-green-100';
      case 'ATENDIDO':
        return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'CANCELADA':
        return 'bg-red-50 text-red-700 border-red-100';
      case 'NO_ASISTE':
        return 'bg-amber-50 text-amber-700 border-amber-100';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-100';
    }
  };

  const showMsg = (text: string, type: 'success' | 'error') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 5000);
  };

  const abrirEdicion = () => {
    setPrevision(perfil?.prevision || '');
    setTelefono(perfil?.telefonoContacto || '');
    setEditandoPerfil(true);
  };

  const guardar = async () => {
    const result = await handleGuardarPerfil({ prevision, telefonoContacto: telefono });
    if(result.success) showMsg('Perfil actualizado', 'success');
    else showMsg('Error al guardar el perfil', 'error');
    setEditandoPerfil(false);
  };

  const confirmarCancelacion = async () => {
    const result = await handleCancelar(cancelarConfig.id);
    if(result.success) showMsg('La cita ha sido cancelada.', 'success');
    else showMsg(result.error || 'Error', 'error');
    setCancelarConfig({ isOpen: false, id: 0 });
  };

  if (isLoading) return <div className="p-12 text-center text-primary">Cargando tu portal...</div>;

  return (
    <div className="animate-fade-in space-y-8">
      
      {message && <Toast message={message.text} type={message.type} />}

      <section>
        <h1 className="font-h1 text-h1 mb-1">Buenos días, {userName}.</h1>
        <p className="text-on-surface-variant">Este es tu resumen de salud.</p>
      </section>

      <section className="bg-surface-container-lowest border border-outline-variant rounded-3xl p-8 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-h3 text-h3 flex items-center gap-2"><User className="text-primary w-5 h-5" /> Mi Perfil</h2>
          <Button variant="outline" onClick={abrirEdicion} icon={<Pencil className="w-4 h-4" />} className="!py-2 !px-4 text-sm">Editar</Button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div><p className="text-xs text-on-surface-variant uppercase tracking-wider mb-1">RUT</p><p className="font-medium text-lg">{userRut || '—'}</p></div>
          <div><p className="text-xs text-on-surface-variant uppercase tracking-wider mb-1">Correo</p><p className="font-medium text-sm truncate pt-1">{userEmail || '—'}</p></div>
          <div><p className="text-xs text-on-surface-variant uppercase tracking-wider mb-1 flex items-center gap-1"><Shield className="w-4 h-4" /> Previsión</p><p className="font-medium text-lg">{perfil?.prevision || <span className="text-on-surface-variant italic text-sm">No registrada</span>}</p></div>
          <div><p className="text-xs text-on-surface-variant uppercase tracking-wider mb-1 flex items-center gap-1"><Phone className="w-4 h-4" /> Teléfono</p><p className="font-medium text-lg">{perfil?.telefonoContacto || <span className="text-on-surface-variant italic text-sm">No registrado</span>}</p></div>
        </div>
      </section>

      <Modal
        isOpen={editandoPerfil}
        onClose={() => setEditandoPerfil(false)}
        title="Actualizar mi Perfil"
        maxWidth="sm"
        footer={<div className="flex gap-3"><Button variant="outline" onClick={() => setEditandoPerfil(false)} className="flex-1">Cancelar</Button><Button onClick={guardar} className="flex-1">Guardar</Button></div>}
      >
        <div className="space-y-4">
          <Input label="Previsión" value={prevision} onChange={e => setPrevision(e.target.value)} placeholder="Ej: Fonasa A, Isapre Cruz Blanca..." />
          <Input label="Teléfono de contacto" value={telefono} onChange={e => setTelefono(e.target.value)} placeholder="+56 9 1234 5678" />
        </div>
      </Modal>

      <ConfirmDialog
        isOpen={cancelarConfig.isOpen}
        title="Cancelar Cita"
        message="¿Estás seguro de que deseas cancelar esta reserva? Esta acción no se puede deshacer."
        isDestructive={true}
        confirmText="Sí, cancelar cita"
        onConfirm={confirmarCancelacion}
        onCancel={() => setCancelarConfig({ isOpen: false, id: 0 })}
      />

      <section>
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-1 border-b border-outline-variant flex-1 mr-4">
            <button
              onClick={() => setSelectedTab('proximas')}
              className={`py-3 px-6 font-bold text-sm border-b-2 transition-all ${
                selectedTab === 'proximas'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Próximas Citas ({proximasCitas.length})
            </button>
            <button
              onClick={() => setSelectedTab('historial')}
              className={`py-3 px-6 font-bold text-sm border-b-2 transition-all ${
                selectedTab === 'historial'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Historial de Citas ({historialCitas.length})
            </button>
          </div>
          <Link to="/agendar" className="shrink-0"><Button>Nueva Reserva</Button></Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {selectedTab === 'proximas' ? (
            proximasCitas.length === 0 ? (
              <div className="col-span-full p-12 text-center bg-surface-container-lowest border border-dashed border-outline-variant rounded-3xl">
                <p className="text-on-surface-variant font-medium">No tienes citas próximas agendadas.</p>
              </div>
            ) : (
              proximasCitas.map((res: IReserva) => (
                <div key={res.id} className="bg-surface-container-lowest border border-outline-variant rounded-3xl p-6 shadow-sm">
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-secondary-container flex items-center justify-center text-secondary"><Stethoscope /></div>
                      <div>
                        <h3 className="font-bold text-lg text-on-surface">Dr. {res.medico.nombreCompleto}</h3>
                        <p className="text-sm text-on-surface-variant">{res.centro.nombreSucursal}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1.5 border rounded-full text-xs font-bold uppercase tracking-wide ${getEstadoBadgeClass(res.estado)}`}>
                      {res.estado.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-on-surface-variant mb-6 bg-surface-container-high p-3 rounded-xl border border-surface-variant">
                    <CalendarDays className="w-5 h-5 text-primary" />
                    <span className="text-sm font-bold text-on-surface">{new Date(res.fechaHora).toLocaleString('es-CL')}</span>
                  </div>
                  {(res.estado === 'VIGENTE' || res.estado === 'CONFIRMADA') && (
                    <Button variant="danger" onClick={() => setCancelarConfig({ isOpen: true, id: res.id })} className="w-full">Cancelar Cita</Button>
                  )}
                </div>
              ))
            )
          ) : (
            historialCitas.length === 0 ? (
              <div className="col-span-full p-12 text-center bg-surface-container-lowest border border-dashed border-outline-variant rounded-3xl">
                <p className="text-on-surface-variant font-medium">No tienes historial de citas pasadas o canceladas.</p>
              </div>
            ) : (
              historialCitas.map((res: IReserva) => {
                const isAtendido = res.estado === 'ATENDIDO';
                return (
                  <div
                    key={res.id}
                    onClick={isAtendido ? () => setSelectedReservaId(res.id) : undefined}
                    className={`bg-surface-container-lowest border border-outline-variant rounded-3xl p-6 shadow-sm transition-all ${
                      isAtendido 
                        ? 'cursor-pointer hover:shadow-md hover:border-primary/30 hover:bg-surface-container-low/30 opacity-100' 
                        : 'opacity-80'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-500"><Stethoscope /></div>
                        <div>
                          <h3 className="font-bold text-lg text-on-surface-variant">Dr. {res.medico.nombreCompleto}</h3>
                          <p className="text-sm text-on-surface-variant/70">{res.centro.nombreSucursal}</p>
                        </div>
                      </div>
                      <span className={`px-3 py-1.5 border rounded-full text-xs font-bold uppercase tracking-wide ${getEstadoBadgeClass(res.estado)}`}>
                        {res.estado.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-on-surface-variant bg-surface-container-high p-3 rounded-xl border border-surface-variant">
                      <CalendarDays className="w-5 h-5 text-slate-400" />
                      <span className="text-sm font-medium text-on-surface-variant">{new Date(res.fechaHora).toLocaleString('es-CL')}</span>
                    </div>
                    {isAtendido && (
                      <div className="mt-4 pt-3 border-t border-outline-variant/60 flex items-center justify-between text-xs text-primary font-bold">
                        <span>Ver comentario del doctor</span>
                        <span className="text-sm">→</span>
                      </div>
                    )}
                  </div>
                );
              })
            )
          )}
        </div>
      </section>

      {selectedReservaId !== null && (
        <HistorialDetalleModal
          reservaId={selectedReservaId}
          onClose={() => setSelectedReservaId(null)}
        />
      )}
    </div>
  );
}

interface HistorialDetalleModalProps {
  reservaId: number;
  onClose: () => void;
}

function HistorialDetalleModal({ reservaId, onClose }: HistorialDetalleModalProps) {
  const { data: historial, isLoading, error } = useObtenerHistorialPorReservaQuery(reservaId);

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title="Detalle de Atención Médica"
      maxWidth="md"
      footer={<Button onClick={onClose} className="w-full">Cerrar</Button>}
    >
      {isLoading ? (
        <div className="py-8 text-center text-primary font-medium animate-pulse">
          Cargando observaciones médicas...
        </div>
      ) : error ? (
        <div className="p-4 text-center text-red-600 bg-red-50 border border-red-100 rounded-2xl font-medium">
          No se encontraron comentarios para esta cita o hubo un error al cargarlos.
        </div>
      ) : historial ? (
        <div className="space-y-6">
          <div className="flex items-center gap-4 bg-surface-container-low p-4 rounded-2xl border border-outline-variant animate-fade-in">
            <div className="w-12 h-12 rounded-2xl bg-secondary-container flex items-center justify-center text-secondary">
              <Stethoscope className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-on-surface">Dr. {historial.medico.nombreCompleto}</h4>
              <p className="text-sm text-on-surface-variant font-medium">
                {historial.medico.especialidades?.[0]?.nombre || 'Médico General'}
              </p>
              <p className="text-xs text-on-surface-variant/70 mt-0.5 font-medium">
                {historial.medico.centroMedico?.nombreSucursal || 'Centro Médico RedNorte'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm animate-fade-in">
            <div className="bg-surface-container-high p-3 rounded-xl border border-surface-variant">
              <span className="text-xs text-on-surface-variant block uppercase tracking-wider mb-1 font-semibold">Fecha de Atención</span>
              <span className="font-medium text-on-surface">
                {new Date(historial.fechaAtencion).toLocaleString('es-CL')}
              </span>
            </div>
            {historial.procedimientoRealizado && (
              <div className="bg-surface-container-high p-3 rounded-xl border border-surface-variant">
                <span className="text-xs text-on-surface-variant block uppercase tracking-wider mb-1 font-semibold">Procedimiento</span>
                <span className="font-medium text-on-surface">
                  {historial.procedimientoRealizado.replace(/_/g, ' ')}
                </span>
              </div>
            )}
          </div>

          <div className="bg-primary-container/20 border border-primary/10 rounded-2xl p-5 space-y-2 animate-fade-in">
            <h5 className="font-bold text-primary text-sm uppercase tracking-wide">Observaciones Clínicas</h5>
            <p className="text-on-surface leading-relaxed text-sm whitespace-pre-line font-medium">
              {historial.observaciones}
            </p>
          </div>
        </div>
      ) : null}
    </Modal>
  );
}