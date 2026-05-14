import { useGestionEspecialidadesVM } from '../viewmodels/useGestionEspecialidadesVM';
import { Activity, Plus, Pencil, Trash2, X, Save, Loader2, AlertCircle } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function GestionEspecialidades() {
  const { 
    especialidades, isLoading, isError, isModalOpen, setIsModalOpen, 
    editingEspecialidad, isSubmitting, handleOpenCreate, handleOpenEdit, 
    handleSave, handleDelete 
  } = useGestionEspecialidadesVM();

  const [nombre, setNombre] = useState('');

  useEffect(() => {
    if (editingEspecialidad) {
      setNombre(editingEspecialidad.nombre);
    } else {
      setNombre('');
    }
  }, [editingEspecialidad, isModalOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleSave(nombre);
  };

  if (isLoading) return <div className="p-12 text-center text-primary flex flex-col items-center gap-4"><Loader2 className="w-8 h-8 animate-spin" /> Cargando especialidades...</div>;
  if (isError) return <div className="p-12 text-center text-error flex flex-col items-center gap-4"><AlertCircle className="w-8 h-8" /> Error al cargar las especialidades.</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-700 max-w-6xl mx-auto">
      <section className="flex justify-between items-center">
        <div>
          <h1 className="font-h1 text-h1 text-on-background mb-1">Gestión de Especialidades</h1>
          <p className="text-on-surface-variant">Administra el catálogo de especialidades médicas de la red</p>
        </div>
        <button 
          onClick={handleOpenCreate}
          className="flex items-center gap-2 px-6 py-3 bg-primary text-on-primary rounded-2xl font-bold hover:bg-primary/90 transition-all shadow-md shadow-primary/20"
        >
          <Plus className="w-5 h-5" /> Nueva Especialidad
        </button>
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
                <button onClick={() => e.id && handleDelete(e.id)} className="p-2 hover:bg-error-container text-error rounded-xl transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <h3 className="font-bold text-lg mb-2 text-on-surface">{e.nombre}</h3>
            <p className="text-sm text-on-surface-variant">ID: {e.id}</p>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-surface-container-lowest w-full max-w-lg rounded-[32px] shadow-2xl border border-outline-variant overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-8 border-b border-outline-variant flex justify-between items-center bg-surface-container-low">
              <h2 className="font-h3 text-h3">{editingEspecialidad ? 'Editar Especialidad' : 'Nueva Especialidad'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-surface-container-high rounded-full transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium ml-1">Nombre de la Especialidad</label>
                <input 
                  type="text"
                  value={nombre}
                  onChange={e => setNombre(e.target.value)}
                  className="w-full px-5 py-3 rounded-2xl bg-surface-container-high border-none focus:ring-2 focus:ring-primary outline-none transition-all"
                  placeholder="Ej: Cardiología"
                  required
                />
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
                  {editingEspecialidad ? 'Guardar Cambios' : 'Crear Especialidad'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
