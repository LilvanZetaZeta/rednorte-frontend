import { X, Stethoscope, Loader2, Save } from 'lucide-react';
import type { IUsuario, IEspecialidad } from '../../models/types';

interface SpecialtiesModalProps {
  doctor: IUsuario | null;
  especialidades?: IEspecialidad[];
  selectedEspIds: number[];
  isUpdating: boolean;
  onClose: () => void;
  onSave: () => Promise<void>;
  onToggleEspSelection: (id: number) => void;
}

export default function SpecialtiesModal({
  doctor,
  especialidades,
  selectedEspIds,
  isUpdating,
  onClose,
  onSave,
  onToggleEspSelection
}: SpecialtiesModalProps) {
  if (!doctor) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-surface-container-lowest rounded-[32px] w-full max-w-md p-8 shadow-2xl border border-outline-variant animate-in zoom-in-95 duration-300">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-xl font-bold text-on-surface">Especialidades</h2>
            <p className="text-sm text-on-surface-variant">{doctor.nombreCompleto}</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-surface-container-high rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-on-surface-variant" />
          </button>
        </div>

        <div className="space-y-3 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
          {especialidades?.map(esp => (
            <label 
              key={esp.id} 
              className={`flex items-center justify-between p-4 rounded-2xl cursor-pointer transition-all border-2 ${
                selectedEspIds.includes(esp.id) 
                  ? 'bg-primary-container/20 border-primary shadow-sm' 
                  : 'bg-surface-container-low border-transparent hover:border-outline-variant'
              }`}
            >
              <div className="flex items-center gap-3">
                <Stethoscope className={`w-5 h-5 ${selectedEspIds.includes(esp.id) ? 'text-primary' : 'text-on-surface-variant'}`} />
                <span className={`font-medium ${selectedEspIds.includes(esp.id) ? 'text-on-primary-container' : 'text-on-surface'}`}>
                  {esp.nombre}
                </span>
              </div>
              <input 
                type="checkbox" 
                className="w-5 h-5 rounded-md border-outline text-primary focus:ring-primary"
                checked={selectedEspIds.includes(esp.id)}
                onChange={() => onToggleEspSelection(esp.id)}
              />
            </label>
          ))}
        </div>

        <div className="mt-8 flex gap-3">
          <button 
            onClick={onClose}
            className="flex-1 py-4 rounded-2xl font-bold text-on-surface-variant hover:bg-surface-container-high transition-colors"
          >
            Cancelar
          </button>
          <button 
            onClick={onSave}
            disabled={isUpdating}
            className="flex-1 py-4 bg-primary text-on-primary rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all disabled:opacity-50"
          >
            {isUpdating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}
