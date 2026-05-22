import { useState } from 'react';
import { useDashboardCentroVM } from '../viewmodels/useDashboardCentroVM';
import {
  Building2, Users, Loader2, CheckCircle2, AlertCircle,
  Pencil, Trash2, X, Save, Search,
  Stethoscope, ClipboardList, CalendarCheck2, UserCheck,
} from 'lucide-react';
 
export default function DashboardCentro() {
  const vm = useDashboardCentroVM();
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
 
  const showMsg = (msg: { text: string; type: 'success' | 'error' }) => {
    setMessage(msg);
    setTimeout(() => setMessage(null), 6000);
  };
 
  const handleSubmitAsignar = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await vm.handleAsignar();
    if (result.success) showMsg({ text: 'Usuario asignado al equipo correctamente.', type: 'success' });
    else                showMsg({ text: result.error || 'Error al asignar', type: 'error' });
  };
 
  const handleSubmitEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await vm.handleGuardarEdit();
    if (result.success) showMsg({ text: 'Datos actualizados correctamente.', type: 'success' });
    else                showMsg({ text: result.error || 'Error al actualizar', type: 'error' });
  };
 
  const handleEliminar = async (id: number, nombre: string) => {
    if (!window.confirm(`¿Confirmas eliminar a ${nombre} del equipo?`)) return;
    const result = await vm.handleEliminar(id);
    if (result.success) showMsg({ text: `${nombre} fue removido del equipo.`, type: 'success' });
    else                showMsg({ text: result.error || 'Error al eliminar', type: 'error' });
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
        <AlertCircle className="w-14 h-14 text-error/60" />
        <h2 className="font-h2 text-h2 text-on-background">Sin centro médico asignado</h2>
        <p className="text-on-surface-variant max-w-sm">
          Tu cuenta de administrador aún no tiene una sucursal asignada. Contacta al Director.
        </p>
      </div>
    );
  }
 
  return (
    <div className="space-y-8 animate-in fade-in duration-700 max-w-7xl mx-auto pb-10">
 
      {/* TOAST */}
      {message && (
        <div className={`fixed top-20 right-8 z-[200] flex items-center gap-3 p-4 rounded-2xl shadow-xl border animate-in slide-in-from-right-4 duration-300 max-w-sm ${
          message.type === 'success'
            ? 'bg-success-container text-success border-success/20'
            : 'bg-error-container text-error border-error/20'
        }`}>
          {message.type === 'success'
            ? <CheckCircle2 className="w-5 h-5 shrink-0" />
            : <AlertCircle className="w-5 h-5 shrink-0" />}
          <p className="text-sm font-bold leading-snug">{message.text}</p>
        </div>
      )}
 
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
        {[
          { label: 'Total Reservas', value: vm.metricas.totalReservas, icon: <ClipboardList />,  color: 'bg-primary-container text-primary' },
          { label: 'Citas Vigentes', value: vm.metricas.vigentes,       icon: <CalendarCheck2 />, color: 'bg-secondary-container text-secondary' },
          { label: 'Médicos',        value: vm.metricas.medicos,         icon: <Stethoscope />,    color: 'bg-tertiary-container text-tertiary' },
          { label: 'Secretarias',    value: vm.metricas.secretarias,     icon: <Users />,          color: 'bg-primary-container text-primary' },
        ].map((kpi, i) => (
          <div key={i} className="bg-surface-container-lowest p-6 rounded-3xl border border-outline-variant shadow-sm">
            <div className={`w-10 h-10 ${kpi.color} rounded-2xl flex items-center justify-center mb-3`}>{kpi.icon}</div>
            <p className="text-on-surface-variant text-sm font-medium">{kpi.label}</p>
            <p className="text-3xl font-bold text-on-surface mt-1">{kpi.value}</p>
          </div>
        ))}
      </section>
 
      {/* GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
 
        {/*PANEL ASIGNAR */}
        <div className="lg:col-span-1">
          <form
            onSubmit={handleSubmitAsignar}
            className="bg-surface-container-lowest p-6 rounded-3xl border border-outline-variant shadow-sm flex flex-col gap-4 sticky top-24"
          >
            <h2 className="font-h3 text-h3 flex items-center gap-2 mb-1">
              <UserCheck className="text-primary w-5 h-5" /> Asignar al Equipo
            </h2>
 
            {/* Buscador */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-on-surface-variant ml-1">Buscar usuario *</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant/50" />
                <input
                  type="text"
                  placeholder="Nombre o correo..."
                  value={vm.busqueda}
                  onChange={e => { vm.setBusqueda(e.target.value); vm.setFormAsignar({ ...vm.formAsignar, usuarioId: null }); }}
                  className="w-full pl-9 pr-4 py-3 rounded-2xl bg-surface-container-high border-none outline-none text-sm focus:ring-2 focus:ring-primary transition-all"
                />
              </div>
            </div>
 
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
                className="w-full px-4 py-3 rounded-2xl bg-surface-container-high border-none outline-none text-sm font-bold cursor-pointer focus:ring-2 focus:ring-primary transition-all"
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
 
            <button
              type="submit"
              disabled={
                vm.isSubmitting ||
                !vm.formAsignar.usuarioId ||
                (vm.formAsignar.rol === 'MEDICO' && vm.formAsignar.especialidadIds.length === 0)
              }
              className="mt-1 bg-primary text-on-primary py-3.5 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-all shadow-md shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {vm.isSubmitting
                ? <><Loader2 className="w-5 h-5 animate-spin" /> Asignando...</>
                : <><UserCheck className="w-5 h-5" /> Asignar al Equipo</>}
            </button>
          </form>
        </div>
 
        {/* ── LISTADO STAFF ─────────────────────────────────── */}
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
                      <button onClick={() => handleEliminar(u.id, u.nombreCompleto)} className="p-2 hover:bg-error-container text-error rounded-xl transition-colors" title="Eliminar">
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
 
      {/* MODAL EDITAR */}
      {vm.showModal && vm.editingUser && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-surface-container-lowest w-full max-w-md rounded-[32px] shadow-2xl border border-outline-variant overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-6 border-b border-outline-variant flex justify-between items-center bg-surface-container-low">
              <div>
                <h2 className="font-h3 text-h3">Editar Usuario</h2>
                <p className="text-xs text-on-surface-variant mt-0.5">{vm.editingUser.nombreCompleto}</p>
              </div>
              <button onClick={() => vm.setShowModal(false)} className="p-2 hover:bg-surface-container-high rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmitEdit} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-on-surface-variant ml-1">Nombre Completo *</label>
                <input required type="text" value={vm.formEdit.nombreCompleto}
                  onChange={e => vm.setFormEdit({ ...vm.formEdit, nombreCompleto: e.target.value })}
                  className="w-full px-4 py-3 rounded-2xl bg-surface-container-high border-none outline-none text-sm focus:ring-2 focus:ring-primary transition-all"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-on-surface-variant ml-1">Correo Electrónico *</label>
                <input required type="email" value={vm.formEdit.correo}
                  onChange={e => vm.setFormEdit({ ...vm.formEdit, correo: e.target.value })}
                  className="w-full px-4 py-3 rounded-2xl bg-surface-container-high border-none outline-none text-sm focus:ring-2 focus:ring-primary transition-all"
                />
              </div>
              {vm.editingUser.rol === 'MEDICO' && (
                <div className="space-y-2 p-4 bg-surface-container-high rounded-2xl">
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wide">Especialidades</label>
                  <div className="space-y-1 max-h-44 overflow-y-auto pr-1">
                    {vm.especialidades.map(esp => (
                      <label key={esp.id} className="flex items-center gap-3 p-2 cursor-pointer rounded-xl hover:bg-surface-container transition-colors">
                        <input type="checkbox" checked={vm.formEdit.especialidadIds.includes(esp.id)}
                          onChange={() => vm.toggleEspecialidad(esp.id, 'edit')}
                          className="w-4 h-4 accent-primary"
                        />
                        <span className="text-sm text-on-surface">{esp.nombre}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => vm.setShowModal(false)}
                  className="flex-1 py-3 border border-outline font-bold rounded-2xl hover:bg-surface-container-high transition-colors">
                  Cancelar
                </button>
                <button type="submit" disabled={vm.isSubmitting}
                  className="flex-1 py-3 bg-primary text-on-primary font-bold rounded-2xl hover:bg-primary/90 transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20 disabled:opacity-50">
                  {vm.isSubmitting ? <><Loader2 className="w-5 h-5 animate-spin" /> Guardando...</> : <><Save className="w-5 h-5" /> Guardar</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}