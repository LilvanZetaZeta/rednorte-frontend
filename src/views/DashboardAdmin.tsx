import { useDashboardAdminVM } from '../viewmodels/useDashboardAdminVM';
import { ShieldCheck, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';
import StaffTable from '../components/dashboard/StaffTable';
import SpecialtiesModal from '../components/dashboard/SpecialtiesModal';
import type { IUsuario } from '../models/types';

export default function DashboardAdmin() {
  const {
    staff,
    centros,
    especialidades,
    isLoading,
    isError,
    isDirector,
    handleUpdateCentro,
    handleUpdateEspecialidades,
    isUpdating
  } = useDashboardAdminVM();

  const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);
  const [editingDoctor, setEditingDoctor] = useState<IUsuario | null>(null);
  const [selectedEspIds, setSelectedEspIds] = useState<number[]>([]);

  const onCentroChange = async (usuarioId: number, centroIdStr: string) => {
    const centroId = centroIdStr === "" ? null : parseInt(centroIdStr);
    const result = await handleUpdateCentro(usuarioId, centroId);
    if (result.success) {
      setMessage({ text: 'Centro médico asignado exitosamente', type: 'success' });
    } else {
      setMessage({ text: result.error || 'Error al asignar centro médico', type: 'error' });
    }
    setTimeout(() => setMessage(null), 3000);
  };

  const openEspModal = (u: IUsuario) => {
    setEditingDoctor(u);
    setSelectedEspIds(u.especialidades?.map((e: any) => e.id) || []);
  };

  const handleSaveEspecialidades = async () => {
    if (!editingDoctor) return;
    const result = await handleUpdateEspecialidades(editingDoctor.id, selectedEspIds);
    if (result.success) {
      setMessage({ text: 'Especialidades actualizadas', type: 'success' });
      setEditingDoctor(null);
    } else {
      setMessage({ text: result.error || 'Error al actualizar especialidades', type: 'error' });
    }
    setTimeout(() => setMessage(null), 3000);
  };

  const toggleEspSelection = (id: number) => {
    setSelectedEspIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  if (isLoading) return <div className="p-12 text-center text-primary flex flex-col items-center gap-4"><Loader2 className="w-8 h-8 animate-spin" /> Cargando personal...</div>;
  if (isError) return <div className="p-12 text-center text-error flex flex-col items-center gap-4"><AlertCircle className="w-8 h-8" /> Error al cargar el listado de personal.</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-700 max-w-[1400px] mx-auto">
      <section className="flex justify-between items-center">
        <div>
          <h1 className="font-h1 text-h1 text-on-background mb-1">Panel de Administración</h1>
          <p className="text-on-surface-variant">Gestión de personal, roles, centros y especialidades</p>
        </div>
        <div className="p-3 bg-primary-container text-primary rounded-2xl shadow-sm shadow-primary/10">
          <ShieldCheck className="w-6 h-6" />
        </div>
      </section>

      {message && (
        <div className={`fixed top-20 right-8 z-50 flex items-center gap-3 p-4 rounded-2xl animate-in slide-in-from-right-4 duration-300 shadow-xl border ${message.type === 'success' ? 'bg-success-container text-success border-success/20' : 'bg-error-container text-error border-error/20'
          }`}>
          {message.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          <p className="text-sm font-bold">{message.text}</p>
        </div>
      )}

      <StaffTable
        staff={staff}
        centros={centros}
        isDirector={!isDirector}
        isUpdating={isUpdating}
        onCentroChange={onCentroChange}
        onOpenEspModal={openEspModal}
      />

      <SpecialtiesModal
        doctor={editingDoctor}
        especialidades={especialidades}
        selectedEspIds={selectedEspIds}
        isUpdating={isUpdating}
        onClose={() => setEditingDoctor(null)}
        onSave={handleSaveEspecialidades}
        onToggleEspSelection={toggleEspSelection}
      />
    </div>
  );
}