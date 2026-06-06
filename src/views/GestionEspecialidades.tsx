import { useGestionEspecialidadesVM } from '../viewmodels/useGestionEspecialidadesVM';
import { Activity, Plus, Pencil, Trash2, Loader2, AlertCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Toast from '../components/ui/Toast';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import { validations } from '../utils/validations';

export default function GestionEspecialidades() {
  const { 
    especialidades, isLoading, isError, isModalOpen, setIsModalOpen, 
    editingEspecialidad, isSubmitting, handleOpenCreate, handleOpenEdit, 
    handleSave, handleDelete 
  } = useGestionEspecialidadesVM();

  const [nombre, setNombre] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);
  const [eliminarConfig, setEliminarConfig] = useState({ isOpen: false, id: 0, nombre: '' });

  useEffect(() => {
    if (editingEspecialidad) setNombre(editingEspecialidad.nombre);
    else setNombre('');
    setError(null);
  }, [editingEspecialidad, isModalOpen]);

  const handleNombreChange = (val: string) => {
    setNombre(val);
    setError(validations.specialtyName(val));
  };

  const showMsg = (text: string, type: 'success' | 'error') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 5000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const err = validations.specialtyName(nombre);
    setError(err);
    if (err) {
      showMsg('Por favor, corrige los errores en el formulario.', 'error');
      return;
    }
    const result = await handleSave(nombre);
    if (result && result.success === false) {
      showMsg(result.error || 'Error al guardar', 'error');
    } else {
      showMsg('Especialidad guardada exitosamente', 'success');
    }
  };

  const confirmarEliminacion = async () => {
    const result = await handleDelete(eliminarConfig.id);
    if (result && result.success === false) showMsg(result.error || 'Error al eliminar', 'error');
    else showMsg('Especialidad eliminada correctamente', 'success');
    setEliminarConfig({ isOpen: false, id: 0, nombre: '' });
  };

  if (isLoading) return <div className="p-12 text-center text-primary flex flex-col items-center gap-4"><Loader2 className="w-8 h-8 animate-spin" /> Cargando especialidades...</div>;
  if (isError) return <div className="p-12 text-center text-error flex flex-col items-center gap-4"><AlertCircle className="w-8 h-8" /> Error al cargar las especialidades.</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-700 max-w-6xl mx-auto">
      
      {message && <Toast message={message.text} type={message.type} />}

      <section className="flex justify-between items-center">
        <div>
          <h1 className="font-h1 text-h1 text-on-background mb-1">Gestión de Especialidades</h1>
          <p className="text-on-surface-variant">Administra el catálogo de especialidades médicas de la red</p>
        </div>
        <Button onClick={handleOpenCreate} icon={<Plus className="w-5 h-5" />}>
          Nueva Especialidad
        </Button>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {especialidades?.map((e) => (
          <div key={e.id} className="bg-surface-container-lowest p-6 rounded-3xl border border-outline-variant shadow-sm hover:shadow-md transition-all group">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-secondary-container text-secondary rounded-2xl">
                <Activity className="w-6 h-6" />
              </div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => handleOpenEdit(e)} className="p-2 hover:bg-secondary-container text-secondary rounded-xl transition-colors">
                  <Pencil className="w-4 h-4" />
                </button>
                <button onClick={() => setEliminarConfig({ isOpen: true, id: e.id, nombre: e.nombre })} className="p-2 hover:bg-error-container text-error rounded-xl transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <h3 className="font-bold text-lg mb-2 text-on-surface">{e.nombre}</h3>
            <p className="text-sm text-on-surface-variant">ID: {e.id}</p>
          </div>
        ))}
      </div>

      <ConfirmDialog
        isOpen={eliminarConfig.isOpen}
        title="Eliminar Especialidad"
        message={`¿Estás seguro de eliminar la especialidad "${eliminarConfig.nombre}"? Esta acción removerá la etiqueta de los médicos asociados.`}
        isDestructive={true}
        confirmText="Sí, eliminar"
        onConfirm={confirmarEliminacion}
        onCancel={() => setEliminarConfig({ isOpen: false, id: 0, nombre: '' })}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingEspecialidad ? 'Editar Especialidad' : 'Nueva Especialidad'}
        maxWidth="md"
        footer={
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setIsModalOpen(false)} className="flex-1">Cancelar</Button>
            <Button type="submit" form="form-especialidad" isLoading={isSubmitting} className="flex-1">
              {editingEspecialidad ? 'Guardar Cambios' : 'Crear Especialidad'}
            </Button>
          </div>
        }
      >
        <form id="form-especialidad" onSubmit={handleSubmit} className="space-y-6">
          <Input 
            label="Nombre de la Especialidad *" 
            value={nombre} 
            onChange={e => handleNombreChange(e.target.value)} 
            error={error}
            placeholder="Ej: Cardiología" 
          />
        </form>
      </Modal>
    </div>
  );
}