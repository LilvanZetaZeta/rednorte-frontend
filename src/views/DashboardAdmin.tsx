import { useDashboardAdminVM } from '../viewmodels/useDashboardAdminVM';
import { ShieldCheck, Loader2, AlertCircle} from 'lucide-react';
import { useState } from 'react';
import StaffTable from '../components/dashboard/StaffTable';
import SpecialtiesModal from '../components/dashboard/SpecialtiesModal';
import Toast from '../components/ui/Toast';
import type { IUsuario } from '../models/types';

export default function DashboardAdmin() {
  const {
    staff, centros, especialidades, isLoading, isError, isDirector,
    handleUpdateCentro, handleUpdateEspecialidades, isUpdating
  } = useDashboardAdminVM();

  const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);
  const [editingDoctor, setEditingDoctor] = useState<IUsuario | null>(null);
  const [selectedEspIds, setSelectedEspIds] = useState<number[]>([]);

  const onCentroChange = async (usuarioId: number, centroIdStr: string) => {
    const centroId = centroIdStr === "" ? null : parseInt(centroIdStr);
    const result = await handleUpdateCentro(usuarioId, centroId);
    setMessage({ 
      text: result.success ? 'Centro asignado correctamente' : (result.error || 'Error'), 
      type: result.success ? 'success' : 'error' 
    });
    setTimeout(() => setMessage(null), 3000);
  };

  const openEspModal = (u: IUsuario) => {
    setEditingDoctor(u);
    setSelectedEspIds(u.especialidades?.map(e => e.id) || []);
  };

  const handleSaveEspecialidades = async () => {
    if (!editingDoctor) return;
    const result = await handleUpdateEspecialidades(editingDoctor.id, selectedEspIds);
    if (result.success) {
      setMessage({ text: 'Especialidades actualizadas', type: 'success' });
      setEditingDoctor(null);
    } else {
      setMessage({ text: result.error || 'Error al actualizar', type: 'error' });
    }
    setTimeout(() => setMessage(null), 3000);
  };

  if (isLoading) return <div className="p-12 text-center text-primary flex flex-col items-center gap-4"><Loader2 className="w-8 h-8 animate-spin" /> Cargando...</div>;
  if (isError) return <div className="p-12 text-center text-error flex flex-col items-center gap-4"><AlertCircle className="w-8 h-8" /> Error al cargar el listado.</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-700 max-w-[1400px] mx-auto">
      {message && <Toast message={message.text} type={message.type} />}

      <section className="flex justify-between items-center">
        <div>
          <h1 className="font-h1 text-h1 text-on-background mb-1">Panel de Administración</h1>
          <p className="text-on-surface-variant">Gestión de personal y especialidades</p>
        </div>
        <div className="p-3 bg-primary-container text-on-primary-container rounded-2xl"><ShieldCheck className="w-6 h-6" /></div>
      </section>

      <StaffTable
        staff={staff}
        centros={centros}
        isDirector={isDirector}
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
        onToggleEspSelection={(id) => setSelectedEspIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id])}
      />
    </div>
  );
}