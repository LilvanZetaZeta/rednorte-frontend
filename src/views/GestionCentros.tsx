import { useGestionCentrosVM } from '../viewmodels/useGestionCentrosVM';
import { Building2, MapPin, Plus, Pencil, Trash2, Loader2, AlertCircle, UserCog } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useGetUsuariosStaffQuery } from '../services/usuariosApi';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Toast from '../components/ui/Toast';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import { validations } from '../utils/validations';

export default function GestionCentros() {
  const {
    centros, adminsDisponibles, isLoading, isError, isModalOpen, setIsModalOpen,
    editingCentro, isSubmitting, handleOpenCreate, handleOpenEdit,
    handleSave, handleDelete
  } = useGestionCentrosVM();

  const { data: staff } = useGetUsuariosStaffQuery();

  const [formData, setFormData] = useState({ nombreSucursal: '', region: '', comuna: '', direccion: '' });
  const [errors, setErrors] = useState<Record<string, string | null>>({
    nombreSucursal: null,
    region: null,
    comuna: null,
    direccion: null
  });
  const [selectedAdminId, setSelectedAdminId] = useState<number | null>(null);
  const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);
  const [eliminarConfig, setEliminarConfig] = useState({ isOpen: false, id: 0, nombre: '' });

  const currentAdmin = editingCentro?.id
    ? staff?.find(u => u.rol === 'ADMINISTRATIVO' && u.centroMedico?.id === editingCentro.id)
    : null;

  const adminOptions = [...(currentAdmin ? [currentAdmin] : []), ...(adminsDisponibles || [])];

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
    setErrors({ nombreSucursal: null, region: null, comuna: null, direccion: null });
  }, [editingCentro, isModalOpen]);

  const handleFieldChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    let error: string | null = null;
    if (field === 'nombreSucursal') {
      error = validations.text(value, 3, 'nombre de la sucursal');
    } else if (field === 'region') {
      error = validations.text(value, 3, 'región');
    } else if (field === 'comuna') {
      error = validations.text(value, 3, 'comuna');
    } else if (field === 'direccion') {
      error = validations.text(value, 5, 'dirección');
    }
    
    setErrors(prev => ({ ...prev, [field]: error }));
  };

  const showMsg = (text: string, type: 'success' | 'error') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 5000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const nombreSucursalErr = validations.text(formData.nombreSucursal, 3, 'nombre de la sucursal');
    const regionErr = validations.text(formData.region, 3, 'región');
    const comunaErr = validations.text(formData.comuna, 3, 'comuna');
    const direccionErr = validations.text(formData.direccion, 5, 'dirección');
    
    const newErrors = {
      nombreSucursal: nombreSucursalErr,
      region: regionErr,
      comuna: comunaErr,
      direccion: direccionErr
    };
    
    setErrors(newErrors);
    
    if (Object.values(newErrors).some(err => err !== null)) {
      showMsg('Por favor, corrige los errores en el formulario.', 'error');
      return;
    }

    const previousAdminId = currentAdmin?.id || null;
    const adminChanged = selectedAdminId !== previousAdminId;
    const newAdminId = adminChanged ? selectedAdminId : undefined;
    
    const result = await handleSave(formData, newAdminId, previousAdminId);
    
    if (result.success) {
      const msg = adminChanged && selectedAdminId
        ? (editingCentro ? 'Centro y administrador actualizados' : 'Centro creado y administrador asignado')
        : (editingCentro ? 'Centro médico actualizado' : 'Centro médico creado');
      showMsg(msg, 'success');
    } else {
      showMsg(result.error || 'Error al guardar', 'error');
    }
  };

  const confirmarEliminacion = async () => {
    const result = await handleDelete(eliminarConfig.id);
    if (result.success) showMsg('Centro médico eliminado correctamente.', 'success');
    else showMsg(result.error || 'Error al eliminar', 'error');
    setEliminarConfig({ isOpen: false, id: 0, nombre: '' });
  };

  if (isLoading) return <div className="p-12 text-center text-primary flex flex-col items-center gap-4"><Loader2 className="w-8 h-8 animate-spin" /> Cargando centros...</div>;
  if (isError) return <div className="p-12 text-center text-error flex flex-col items-center gap-4"><AlertCircle className="w-8 h-8" /> Error al cargar los centros médicos.</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-700 max-w-6xl mx-auto">
      
      {message && <Toast message={message.text} type={message.type} />}

      <section className="flex justify-between items-center">
        <div>
          <h1 className="font-h1 text-h1 text-on-background mb-1">Gestión de Centros Médicos</h1>
          <p className="text-on-surface-variant">Administra las sucursales y ubicaciones de la red</p>
        </div>
        <Button onClick={handleOpenCreate} icon={<Plus className="w-5 h-5" />}>
          Nueva Sucursal
        </Button>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {centros?.map((c) => {
          const admin = getAdminForCentro(c.id);
          return (
            <div key={c.id} className="bg-surface-container-lowest p-6 rounded-3xl border border-outline-variant shadow-sm hover:shadow-md transition-all group">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-primary-container text-on-primary-container rounded-2xl">
                  <Building2 className="w-6 h-6" />
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => handleOpenEdit(c)} className="p-2 hover:bg-secondary-container text-secondary rounded-xl transition-colors">
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button onClick={() => setEliminarConfig({ isOpen: true, id: c.id, nombre: c.nombreSucursal })} className="p-2 hover:bg-error-container text-error rounded-xl transition-colors">
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
                  {admin ? <span className="text-xs font-medium text-on-surface">{admin.nombreCompleto}</span> : <span className="text-xs italic text-on-surface-variant/50">Sin administrador asignado</span>}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <ConfirmDialog
        isOpen={eliminarConfig.isOpen}
        title="Eliminar Sucursal"
        message={`¿Estás seguro de eliminar el centro "${eliminarConfig.nombre}"? Esta acción no se puede deshacer y puede afectar las reservas asociadas.`}
        isDestructive={true}
        confirmText="Sí, eliminar"
        isLoading={isSubmitting}
        onConfirm={confirmarEliminacion}
        onCancel={() => setEliminarConfig({ isOpen: false, id: 0, nombre: '' })}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCentro ? 'Editar Sucursal' : 'Nueva Sucursal'}
        maxWidth="lg"
        footer={
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setIsModalOpen(false)} className="flex-1">Cancelar</Button>
            <Button type="submit" form="form-centro" isLoading={isSubmitting} className="flex-1">
              {editingCentro ? 'Guardar Cambios' : 'Crear Sucursal'}
            </Button>
          </div>
        }
      >
        <form id="form-centro" onSubmit={handleSubmit} className="space-y-6">
          <Input 
            label="Nombre de la Sucursal *" 
            value={formData.nombreSucursal} 
            onChange={e => handleFieldChange('nombreSucursal', e.target.value)} 
            error={errors.nombreSucursal}
            placeholder="Ej: Clínica Norte Central" 
          />
          <div className="grid grid-cols-2 gap-4">
            <Input 
              label="Región *" 
              value={formData.region} 
              onChange={e => handleFieldChange('region', e.target.value)} 
              error={errors.region}
              placeholder="Ej: Metropolitana" 
            />
            <Input 
              label="Comuna *" 
              value={formData.comuna} 
              onChange={e => handleFieldChange('comuna', e.target.value)} 
              error={errors.comuna}
              placeholder="Ej: Santiago" 
            />
          </div>
          <Input 
            label="Dirección Completa *" 
            value={formData.direccion} 
            onChange={e => handleFieldChange('direccion', e.target.value)} 
            error={errors.direccion}
            placeholder="Calle #123" 
          />
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-on-surface ml-1">Administrador a Cargo</label>
            <select
              value={selectedAdminId || ""}
              onChange={e => setSelectedAdminId(e.target.value ? parseInt(e.target.value) : null)}
              className="w-full px-5 py-3.5 rounded-2xl bg-surface-container-high border-none focus:ring-2 focus:ring-primary outline-none transition-all cursor-pointer text-sm"
            >
              <option value="">Sin administrador</option>
              {adminOptions.map(admin => (
                <option key={admin.id} value={admin.id}>{admin.nombreCompleto} ({admin.correo})</option>
              ))}
            </select>
            {adminOptions.length === 0 && !currentAdmin && <p className="text-xs text-on-surface-variant/60 ml-1 italic">No hay administradores disponibles. Primero designa uno desde el Panel Ejecutivo.</p>}
          </div>
        </form>
      </Modal>
    </div>
  );
}