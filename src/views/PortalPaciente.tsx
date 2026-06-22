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
import StatusBadge from '../components/ui/StatusBadge';
import HistorialDetalleModal from '../components/dashboard/HistorialDetalleModal';

export default function PortalPaciente() {
  
  const { 
    userName, userRut, userEmail, reservas, perfil, isLoading, handleCancelar, handleGuardarPerfil,
    ofertaPendiente, handleResponderOferta, isProcesandoOferta 
  } = usePortalPacienteVM();
  
  const [editandoPerfil, setEditandoPerfil] = useState(false);
  const [prevision, setPrevision] = useState('');
  const [telefono, setTelefono] = useState('');
  
  const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);
  const [cancelarConfig, setCancelarConfig] = useState({ isOpen: false, id: 0 });
  const [selectedTab, setSelectedTab] = useState<'proximas' | 'historial'>('proximas');
  const [selectedReservaId, setSelectedReservaId] = useState<number | null>(null);

  const proximasCitas = reservas.filter(r => r.estado === 'VIGENTE' || r.estado === 'CONFIRMADA');
  const historialCitas = reservas.filter(r => r.estado !== 'VIGENTE' && r.estado !== 'CONFIRMADA');


  const showMsg = (text: string, type: 'success' | 'error') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 5000);
  };

  const abrirEdicion = () => {
    setPrevision(perfil?.prevision || '');
    const telefonoGuardado = perfil?.telefonoContacto || '';
    const telefonoLimpio = telefonoGuardado.replace(/^(\+569|569)/, ''); 
    setTelefono(telefonoLimpio);
    setEditandoPerfil(true);
  };

  const OPCIONES_PREVISION = [
    "FONASA A",
    "FONASA B",
    "FONASA C",
    "FONASA D",
    "Isapre Banmédica",
    "Isapre Colmena",
    "Isapre Consalud",
    "Isapre Cruz Blanca",
    "Isapre Vida Tres",
    "Isapre Nueva Masvida",
    "Isapre Esencial",
  ];

  const guardar = async () => {
  
  const digitosLimpios = telefono.trim();

  // Si el usuario ingresó los 8 dígitos, armamos el formato internacional completo (+569XXXXXXXX)
  // Si lo dejó vacío, enviamos un string vacío o mantén la lógica que espere tu backend
  const telefonoCompleto = digitosLimpios.length === 8 ? `+569${digitosLimpios}` : '';

  // Enviamos los datos procesados al ViewModel
  const result = await handleGuardarPerfil({ 
    prevision, 
    telefonoContacto: telefonoCompleto 
  });
  
  if(result.success) {
    showMsg('Perfil actualizado', 'success');
  } else {
    showMsg('Error al guardar el perfil', 'error');
  }
  
  setEditandoPerfil(false);
};

  const confirmarCancelacion = async () => {
    const result = await handleCancelar(cancelarConfig.id);
    if(result.success) showMsg('La cita ha sido cancelada.', 'success');
    else showMsg(result.error || 'Error', 'error');
    setCancelarConfig({ isOpen: false, id: 0 });
  };

  //Función para manejar la respuesta a la oferta usando Toast
  const responderAlerta = async (estado: 'ACEPTADA' | 'RECHAZADA') => {
    const result = await handleResponderOferta(estado);
    if (result.success) {
      showMsg(`Cita ${estado.toLowerCase()} exitosamente.`, 'success');
    } else {
      showMsg(result.error || 'Error al procesar la oferta.', 'error');
    }
  };

  if (isLoading) return <div className="p-12 text-center text-primary">Cargando tu portal...</div>;

  return (
    <div className="animate-fade-in space-y-8">
      
      {message && <Toast message={message.text} type={message.type} />}

      <section>
        <h1 className="font-h1 text-h1 mb-1">Buenos días, {userName}.</h1>
        <p className="text-on-surface-variant">Este es tu resumen de salud.</p>
      </section>

      {/* 3. INYECCIÓN: Componente visual de la Alerta de Reasignación */}
      {ofertaPendiente && (
        <section className="bg-primary-container border border-primary text-on-primary-container rounded-3xl p-8 shadow-sm animate-fade-in">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center text-white shrink-0 shadow-sm">
              <CalendarDays className="w-7 h-7" />
            </div>
            <div className="flex-1">
              <h2 className="font-h3 text-h3 mb-2">¡Tenemos un turno más temprano para ti!</h2>
              <p className="mb-5 text-sm font-medium opacity-90">
                Se ha liberado un cupo que coincide con tu lista de espera. Tienes hasta las <strong>{new Date(ofertaPendiente.tiempo_limite).toLocaleTimeString('es-CL')}</strong> para confirmar tu asistencia.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button 
                  onClick={() => responderAlerta('ACEPTADA')}
                  disabled={isProcesandoOferta}
                >
                  {isProcesandoOferta ? 'Procesando...' : 'Aceptar Nueva Cita'}
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => responderAlerta('RECHAZADA')}
                  disabled={isProcesandoOferta}
                  className="bg-surface-container-lowest"
                >
                  Mantener mi cita original
                </Button>
              </div>
            </div>
          </div>
        </section>
      )}
      {/* FIN INYECCIÓN */}

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
        footer={
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setEditandoPerfil(false)} className="flex-1">Cancelar</Button>
            <Button onClick={guardar} className="flex-1">Guardar</Button>
          </div>
        }
      >
        <div className="space-y-4">
          {/* CAMPO DE SELECCIÓN DE PREVISIÓN (CON TUS ESTILOS NATIVOS) */}
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-on-surface ml-1">
              Previsión
            </label>
            <div className="relative">
              <select
                value={prevision}
                onChange={e => setPrevision(e.target.value)}
                className="w-full py-3.5 px-5 rounded-2xl bg-surface-container-high border border-transparent text-sm text-on-surface outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all cursor-pointer appearance-none"
              >
                <option value="" disabled>Selecciona tu previsión</option>
                {OPCIONES_PREVISION.map((opcion) => (
                  <option key={opcion} value={opcion} className="bg-surface-container-high text-on-surface">
                    {opcion}
                  </option>
                ))}
              </select>
              {/* Flecha decorativa del dropdown */}
              <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-on-surface-variant/70">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* EL TELÉFONO SE MANTIENE USANDO TU COMPONENTE INPUT ORIGINAL */}
          <Input 
            label="Teléfono de contacto" 
            value={telefono} 
            maxLength={8} 
            onChange={e => {
              const soloNumeros = e.target.value.replace(/\D/g, '');
              setTelefono(soloNumeros);
            }} 
            // CORRECCIÓN 1: Cambiamos el placeholder a 8 dígitos seguidos, calzará perfecto con el espacio
            placeholder="12345678"
            // CORRECCIÓN 2: Le inyectamos un padding izquierdo extra directo al input usando className para empujar el texto y el placeholder hacia la derecha
            className="[&_input]:pl-16" 
            iconLeft={
              // CORRECCIÓN 3: Aseguramos que el prefijo no se mueva usando clases de alineación exacta
              <span className="text-sm font-bold text-on-surface-variant/80 select-none whitespace-nowrap block mt-[1px]">
                +56 9
              </span>
            }
            />
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
                    <StatusBadge estado={res.estado} />
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
                      <StatusBadge estado={res.estado} />
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