import { useState } from 'react';
import { useDashboardCentroVM } from '../viewmodels/useDashboardCentroVM';
import {
  Building2, Users, Loader2, Pencil, Trash2, Search,
  Stethoscope, ClipboardList, CalendarCheck2, UserCheck, CheckCircle2
} from 'lucide-react';
import StatCard from '../components/ui/StatCard';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import Toast from '../components/ui/Toast';
import ConfirmDialog from '../components/ui/ConfirmDialog'; // <-- IMPORTAMOS EL NUEVO COMPONENTE

export default function DashboardCentro() {
  const vm = useDashboardCentroVM();
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  
  // NUEVO ESTADO PARA EL DIÁLOGO DE CONFIRMACIÓN
  const [eliminarConfig, setEliminarConfig] = useState<{ isOpen: boolean; id: number; nombre: string }>({
    isOpen: false,
    id: 0,
    nombre: ''
  });

  const showMsg = (msg: { text: string; type: 'success' | 'error' }) => {
    setMessage(msg);
    setTimeout(() => setMessage(null), 6000);
  };

  const handleSubmitAsignar = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await vm.handleAsignar();
    if (result.success) showMsg({ text: 'Usuario asignado al equipo correctamente.', type: 'success' });
    else showMsg({ text: result.error || 'Error al asignar', type: 'error' });
  };

  const handleSubmitEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await vm.handleGuardarEdit();
    if (result.success) showMsg({ text: 'Datos actualizados correctamente.', type: 'success' });
    else showMsg({ text: result.error || 'Error al actualizar', type: 'error' });
  };

  // 1. Al apretar el botón del basurero, solo abrimos el modal, NO eliminamos aún.
  const intentarEliminar = (id: number, nombre: string) => {
    setEliminarConfig({ isOpen: true, id, nombre });
  };

  // 2. Esta función se ejecuta solo si el usuario aprieta "Eliminar" en el modal.
  const confirmarEliminacion = async () => {
    const result = await vm.handleEliminar(eliminarConfig.id);
    if (result.success) {
      showMsg({ text: `${eliminarConfig.nombre} fue removido del equipo.`, type: 'success' });
    } else {
      showMsg({ text: result.error || 'Error al eliminar', type: 'error' });
    }
    setEliminarConfig({ isOpen: false, id: 0, nombre: '' }); // Cerramos el modal
  };

  const getInitials = (nombre: string) =>
    nombre.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  if (vm.isLoading) {
    return (
      <div className="p-12 text-center text-primary flex flex-col items-center gap-4">
        <Loader2 className="w-8 h-8 animate-spin" />
        Cargando panel de administración...
      </div>
    );
  }

  if (!vm.miCentroId) {
    return (
      <div className="p-16 text-center flex flex-col items-center gap-4">
        <h2 className="font-h2 text-h2 text-on-background">Sin centro médico asignado</h2>
        <p className="text-on-surface-variant max-w-sm">
          Tu cuenta de administrador aún no tiene una sucursal asignada. Contacta al Director.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700 max-w-7xl mx-auto pb-10">
      
      {message && <Toast message={message.text} type={message.type} />}

      {/* HEADER */}
      <section className="flex justify-between items-end">
        <div>
          <h1 className="font-h1 text-h1 text-on-background mb-1">Gerencia de Sucursal</h1>
          <p className="text-on-surface-variant">Administrador {vm.adminName}</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-surface-container-high rounded-full border border-outline-variant">
          <Building2 className="w-4 h-4 text-secondary" />
          <span className="text-sm font-bold text-on-surface-variant">{vm.nombreCentro || `Centro #${vm.miCentroId}`}</span>
        </div>
      </section>

      {/* KPI */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Reservas" value={vm.metricas.totalReservas} icon={<ClipboardList />} />
        <StatCard title="Citas Vigentes" value={vm.metricas.vigentes} icon={<CalendarCheck2 />} colorClass="bg-secondary-container text-secondary" />
        <StatCard title="Médicos" value={vm.metricas.medicos} icon={<Stethoscope />} colorClass="bg-tertiary-container text-tertiary" />
        <StatCard title="Secretarias" value={vm.metricas.secretarias} icon={<Users />} />
      </section>

      {/* GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* PANEL ASIGNAR */}
        <div className="lg:col-span-1">
          <form
            onSubmit={handleSubmitAsignar}
            className="bg-surface-container-lowest p-6 rounded-3xl border border-outline-variant shadow-sm flex flex-col gap-4 sticky top-24"
          >
            <h2 className="font-h3 text-h3 flex items-center gap-2 mb-1">
              <UserCheck className="text-primary w-5 h-5" /> Asignar al Equipo
            </h2>

            {/* Buscador */}
            <Input
              label="Buscar usuario *"
              type="text"
              placeholder="Nombre o correo..."
              iconLeft={<Search className="w-4 h-4" />}
              value={vm.busqueda}
              onChange={e => { vm.setBusqueda(e.target.value); vm.setFormAsignar({ ...vm.formAsignar, usuarioId: null }); }}
            />

            {/* Lista de candidatos */}
            {vm.busqueda.trim() && (
              <div className="rounded-2xl border border-outline-variant overflow-hidden max-h-52 overflow-y-auto">
                {vm.candidatosFiltrados.length === 0 ? (
                  <p className="p-4 text-sm text-on-surface-variant text-center">Sin resultados</p>
                ) : (
                  vm.candidatosFiltrados.map(u => (
                    <button
                      key={u.id}
                      type="button"
                      onClick={() => { vm.setFormAsignar({ ...vm.formAsignar, usuarioId: u.id }); vm.setBusqueda(u.nombreCompleto); }}
                      className={`w-full text-left px-4 py-3 flex flex-col gap-0.5 hover:bg-surface-container-low transition-colors border-b border-outline-variant/30 last:border-0 ${
                        vm.formAsignar.usuarioId === u.id ? 'bg-primary-container' : ''
                      }`}
                    >
                      <span className="text-sm font-medium text-on-surface">{u.nombreCompleto}</span>
                      <span className="text-xs text-on-surface-variant">{u.correo}</span>
                      <span className="text-xs text-on-surface-variant/60">{u.rol}</span>
                    </button>
                  ))
                )}
              </div>
            )}

            {vm.formAsignar.usuarioId && (
              <p className="text-xs text-primary font-medium flex items-center gap-1 ml-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Usuario seleccionado
              </p>
            )}

            {/* Rol */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-on-surface-variant ml-1">Asignar como *</label>
              <select
                value={vm.formAsignar.rol}
                onChange={e => vm.setFormAsignar({
                  ...vm.formAsignar,
                  rol: e.target.value as 'SECRETARIA' | 'MEDICO',
                  especialidadIds: [],
                })}
                className="w-full px-4 py-3.5 rounded-2xl bg-surface-container-high border-none outline-none text-sm font-bold cursor-pointer focus:ring-2 focus:ring-primary transition-all"
              >
                <option value="SECRETARIA">Secretaria</option>
                <option value="MEDICO">Médico</option>
              </select>
            </div>

            {/* Especialidades (solo MEDICO) */}
            {vm.formAsignar.rol === 'MEDICO' && (
              <div className="space-y-2 p-4 bg-surface-container-high rounded-2xl">
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wide">Especialidades *</label>
                {vm.especialidades.length === 0 ? (
                  <p className="text-xs italic text-on-surface-variant/60">No hay especialidades creadas.</p>
                ) : (
                  <div className="space-y-1 max-h-44 overflow-y-auto pr-1">
                    {vm.especialidades.map(esp => (
                      <label key={esp.id} className="flex items-center gap-3 p-2 cursor-pointer rounded-xl hover:bg-surface-container transition-colors">
                        <input
                          type="checkbox"
                          checked={vm.formAsignar.especialidadIds.includes(esp.id)}
                          onChange={() => vm.toggleEspecialidad(esp.id, 'asignar')}
                          className="w-4 h-4 accent-primary"
                        />
                        <span className="text-sm text-on-surface">{esp.nombre}</span>
                      </label>
                    ))}
                  </div>
                )}
                {vm.formAsignar.especialidadIds.length === 0 && (
                  <p className="text-xs text-error ml-1">Selecciona al menos una especialidad.</p>
                )}
              </div>
            )}

            <Button
              type="submit"
              disabled={!vm.formAsignar.usuarioId || (vm.formAsignar.rol === 'MEDICO' && vm.formAsignar.especialidadIds.length === 0)}
              isLoading={vm.isSubmitting}
              icon={<UserCheck className="w-5 h-5" />}
              className="mt-1"
            >
              Asignar al Equipo
            </Button>
          </form>
        </div>

        {/* LISTADO STAFF */}
        <div className="lg:col-span-2">
          <div className="bg-surface-container-lowest border border-outline-variant rounded-3xl shadow-sm overflow-hidden">
            <div className="p-5 border-b border-outline-variant flex items-center gap-3 bg-surface-container-low">
              <Users className="text-primary w-5 h-5" />
              <h2 className="font-bold text-on-surface">Mi Equipo de Trabajo</h2>
              <span className="ml-auto text-xs font-bold text-on-surface-variant bg-surface-container-high px-3 py-1 rounded-full">
                {vm.staffDelCentro.length} {vm.staffDelCentro.length === 1 ? 'persona' : 'personas'}
              </span>
            </div>

            {vm.staffDelCentro.length === 0 ? (
              <div className="p-14 text-center flex flex-col items-center gap-3 text-on-surface-variant">
                <Users className="w-12 h-12 opacity-20" />
                <p className="font-medium">No hay personal asignado a este centro.</p>
                <p className="text-sm opacity-70">Busca un usuario existente y asígnalo.</p>
              </div>
            ) : (
              <div className="divide-y divide-outline-variant/40">
                {vm.staffDelCentro.map(u => (
                  <div key={u.id} className="p-5 flex items-start justify-between gap-4 hover:bg-surface-container-low/60 transition-colors group">
                    <div className="flex items-start gap-4 min-w-0">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
                        u.rol === 'MEDICO' ? 'bg-primary-container text-primary' : 'bg-secondary-container text-secondary'
                      }`}>
                        {getInitials(u.nombreCompleto)}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-0.5">
                          <span className="font-medium text-on-surface text-sm">{u.nombreCompleto}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                            u.rol === 'MEDICO' ? 'bg-primary-container text-primary' : 'bg-secondary-container text-secondary'
                          }`}>
                            {u.rol === 'MEDICO' ? 'Médico' : 'Secretaria'}
                          </span>
                        </div>
                        <p className="text-xs text-on-surface-variant truncate">{u.correo}</p>
                        {u.especialidades && u.especialidades.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {u.especialidades.map(esp => (
                              <span key={esp.id} className="text-xs bg-tertiary-container text-tertiary px-2 py-0.5 rounded-full">
                                {esp.nombre}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                      <button onClick={() => vm.handleOpenEdit(u)} className="p-2 hover:bg-secondary-container text-secondary rounded-xl transition-colors" title="Editar">
                        <Pencil className="w-4 h-4" />
                      </button>
                      {/* AQUÍ LLAMAMOS A NUESTRA NUEVA FUNCIÓN */}
                      <button onClick={() => intentarEliminar(u.id, u.nombreCompleto)} className="p-2 hover:bg-error-container text-error rounded-xl transition-colors" title="Eliminar">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* DIÁLOGO DE CONFIRMACIÓN DE ELIMINACIÓN */}
      <ConfirmDialog
        isOpen={eliminarConfig.isOpen}
        title="Eliminar usuario del equipo"
        message={`¿Estás seguro de que deseas remover a ${eliminarConfig.nombre} de esta sucursal? El usuario perderá acceso al sistema como parte de este centro.`}
        confirmText="Sí, eliminar"
        cancelText="Cancelar"
        isDestructive={true}
        onConfirm={confirmarEliminacion}
        onCancel={() => setEliminarConfig({ isOpen: false, id: 0, nombre: '' })}
      />

      {/* MODAL EDITAR */}
      <Modal
        isOpen={vm.showModal && !!vm.editingUser}
        onClose={() => vm.setShowModal(false)}
        title="Editar Usuario"
        subtitle={vm.editingUser?.nombreCompleto}
        footer={
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => vm.setShowModal(false)} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" form="edit-user-form" isLoading={vm.isSubmitting} className="flex-1">
              Guardar
            </Button>
          </div>
        }
      >
        <form id="edit-user-form" onSubmit={handleSubmitEdit} className="space-y-4">
          <Input
            label="Nombre Completo *"
            required
            type="text"
            value={vm.formEdit.nombreCompleto}
            onChange={e => vm.setFormEdit({ ...vm.formEdit, nombreCompleto: e.target.value })}
          />
          <Input
            label="Correo Electrónico *"
            required
            type="email"
            value={vm.formEdit.correo}
            onChange={e => vm.setFormEdit({ ...vm.formEdit, correo: e.target.value })}
          />
          
          {vm.editingUser?.rol === 'MEDICO' && (
            <div className="space-y-2 p-4 bg-surface-container-high rounded-2xl">
              <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wide">Especialidades</label>
              <div className="space-y-1 max-h-44 overflow-y-auto pr-1">
                {vm.especialidades.map(esp => (
                  <label key={esp.id} className="flex items-center gap-3 p-2 cursor-pointer rounded-xl hover:bg-surface-container transition-colors">
                    <input 
                      type="checkbox" 
                      checked={vm.formEdit.especialidadIds.includes(esp.id)}
                      onChange={() => vm.toggleEspecialidad(esp.id, 'edit')}
                      className="w-4 h-4 accent-primary"
                    />
                    <span className="text-sm text-on-surface">{esp.nombre}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </form>
      </Modal>
    </div>
  );
}