import { useGestionCentrosVM } from '../viewmodels/useGestionCentrosVM';
import { Building2, MapPin, Plus, Pencil, Trash2, X, Save, Loader2, AlertCircle, UserCog, CheckCircle2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useGetUsuariosStaffQuery } from '../services/usuariosApi';

export default function GestionCentros() {
  const {
    centros, adminsDisponibles, isLoading, isError, isModalOpen, setIsModalOpen,
    editingCentro, isSubmitting, handleOpenCreate, handleOpenEdit,
    handleSave, handleDelete
  } = useGestionCentrosVM();

  const { data: staff } = useGetUsuariosStaffQuery();

  const [formData, setFormData] = useState({
    nombreSucursal: '',
    region: '',
    comuna: '',
    direccion: ''
  });
  const [selectedAdminId, setSelectedAdminId] = useState<number | null>(null);
  const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);

  const currentAdmin = editingCentro?.id
    ? staff?.find(u => u.rol === 'ADMINISTRATIVO' && u.centroMedico?.id === editingCentro.id)
    : null;

  const adminOptions = [
    ...(currentAdmin ? [currentAdmin] : []),
    ...(adminsDisponibles || [])
  ];

  const getAdminForCentro = (centroId?: number) => {
    if (!centroId || !staff) return null;
    return staff.find(u => u.rol === 'ADMINISTRATIVO' && u.centroMedico?.id === centroId);
  };

  useEffect(() => {
    if (editingCentro) {
      setFormData({
        nombreSucursal: editingCentro.nombreSucursal,
        region: editingCentro.region,
        comuna: editingCentro.comuna,
        direccion: editingCentro.direccion
      });
      setSelectedAdminId(currentAdmin?.id || null);
    } else {
      setFormData({ nombreSucursal: '', region: '', comuna: '', direccion: '' });
      setSelectedAdminId(null);
    }
  }, [editingCentro, isModalOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const previousAdminId = currentAdmin?.id || null;
    const adminChanged = selectedAdminId !== previousAdminId;
    const newAdminId = adminChanged ? selectedAdminId : undefined;
    const result = await handleSave(formData, newAdminId, previousAdminId);
    if (result.success) {
      const msg = adminChanged && selectedAdminId
        ? (editingCentro ? 'Centro y administrador actualizados exitosamente' : 'Centro creado y administrador asignado exitosamente')
        : (editingCentro ? 'Centro médico actualizado exitosamente' : 'Centro médico creado exitosamente');
      setMessage({ text: msg, type: 'success' });
    } else {
      setMessage({ text: result.error || 'Error al guardar el centro médico', type: 'error' });
    }
    setTimeout(() => setMessage(null), 5000);
  };

  if (isLoading) return <div className="p-12 text-center text-primary flex flex-col items-center gap-4"><Loader2 className="w-8 h-8 animate-spin" /> Cargando centros...</div>;
  if (isError) return <div className="p-12 text-center text-error flex flex-col items-center gap-4"><AlertCircle className="w-8 h-8" /> Error al cargar los centros médicos.</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-700 max-w-6xl mx-auto">
      <section className="flex justify-between items-center">
        <div>
          <h1 className="font-h1 text-h1 text-on-background mb-1">Gestión de Centros Médicos</h1>
          <p className="text-on-surface-variant">Administra las sucursales y ubicaciones de la red</p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 px-6 py-3 bg-primary text-on-primary rounded-2xl font-bold hover:bg-primary/90 transition-all shadow-md shadow-primary/20"
        >
          <Plus className="w-5 h-5" /> Nueva Sucursal
        </button>
      </section>

      {message && (
        <div className={`fixed top-20 right-8 z-[200] flex items-center gap-3 p-4 rounded-2xl animate-in slide-in-from-right-4 duration-300 shadow-xl border ${
          message.type === 'success' ? 'bg-success-container text-success border-success/20' : 'bg-error-container text-error border-error/20'
        }`}>
          {message.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          <p className="text-sm font-bold">{message.text}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {centros?.map((c) => {
          const admin = getAdminForCentro(c.id);
          return (
            <div key={c.id} className="bg-surface-container-lowest p-6 rounded-3xl border border-outline-variant shadow-sm hover:shadow-md transition-all group">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-primary-container text-primary rounded-2xl">
                  <Building2 className="w-6 h-6" />
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => handleOpenEdit(c)} className="p-2 hover:bg-secondary-container text-secondary rounded-xl transition-colors">
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button onClick={() => c.id && handleDelete(c.id)} className="p-2 hover:bg-error-container text-error rounded-xl transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <h3 className="font-bold text-lg mb-2 text-on-surface">{c.nombreSucursal}</h3>
              <div className="space-y-2 text-sm text-on-surface-variant">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span>{c.region}, {c.comuna}</span>
                </div>
                <p className="ml-6">{c.direccion}</p>
                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-outline-variant/50">
                  <UserCog className="w-4 h-4 text-tertiary" />
                  {admin ? (
                    <span className="text-xs font-medium text-on-surface">{admin.nombreCompleto}</span>
                  ) : (
                    <span className="text-xs italic text-on-surface-variant/50">Sin administrador asignado</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-surface-container-lowest w-full max-w-lg rounded-[32px] shadow-2xl border border-outline-variant overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-8 border-b border-outline-variant flex justify-between items-center bg-surface-container-low">
              <h2 className="font-h3 text-h3">{editingCentro ? 'Editar Sucursal' : 'Nueva Sucursal'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-surface-container-high rounded-full transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium ml-1">Nombre de la Sucursal</label>
                <input
                  type="text"
                  value={formData.nombreSucursal}
                  onChange={e => setFormData({ ...formData, nombreSucursal: e.target.value })}
                  className="w-full px-5 py-3 rounded-2xl bg-surface-container-high border-none focus:ring-2 focus:ring-primary outline-none transition-all"
                  placeholder="Ej: Clínica Norte Central"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium ml-1">Región</label>
                  <input
                    type="text"
                    value={formData.region}
                    onChange={e => setFormData({ ...formData, region: e.target.value })}
                    className="w-full px-5 py-3 rounded-2xl bg-surface-container-high border-none focus:ring-2 focus:ring-primary outline-none transition-all"
                    placeholder="Ej: Metropolitana"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium ml-1">Comuna</label>
                  <input
                    type="text"
                    value={formData.comuna}
                    onChange={e => setFormData({ ...formData, comuna: e.target.value })}
                    className="w-full px-5 py-3 rounded-2xl bg-surface-container-high border-none focus:ring-2 focus:ring-primary outline-none transition-all"
                    placeholder="Ej: Santiago"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium ml-1">Dirección Completa</label>
                <input
                  type="text"
                  value={formData.direccion}
                  onChange={e => setFormData({ ...formData, direccion: e.target.value })}
                  className="w-full px-5 py-3 rounded-2xl bg-surface-container-high border-none focus:ring-2 focus:ring-primary outline-none transition-all"
                  placeholder="Calle #123"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium ml-1">Administrador a Cargo</label>
                <select
                  value={selectedAdminId || ""}
                  onChange={e => setSelectedAdminId(e.target.value ? parseInt(e.target.value) : null)}
                  className="w-full px-5 py-3 rounded-2xl bg-surface-container-high border-none focus:ring-2 focus:ring-primary outline-none transition-all cursor-pointer"
                >
                  <option value="">Sin administrador</option>
                  {adminOptions.map(admin => (
                    <option key={admin.id} value={admin.id}>
                      {admin.nombreCompleto} ({admin.correo})
                    </option>
                  ))}
                </select>
                {adminOptions.length === 0 && !currentAdmin && (
                  <p className="text-xs text-on-surface-variant/60 ml-1 italic">No hay administradores disponibles. Primero designa uno desde el Panel Ejecutivo.</p>
                )}
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-4 border border-outline font-bold rounded-2xl hover:bg-surface-container-high transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-4 bg-primary text-on-primary font-bold rounded-2xl hover:bg-primary/90 transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20 disabled:opacity-50"
                >
                  {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                  {editingCentro ? 'Guardar Cambios' : 'Crear Sucursal'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
