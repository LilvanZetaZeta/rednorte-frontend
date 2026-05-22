import { Stethoscope, Save } from 'lucide-react';
import type { IUsuario, IEspecialidad } from '../../models/types';
import Modal from '../ui/Modal';
import Button from '../ui/Button';

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
  
  return (
    <Modal
      isOpen={!!doctor}
      onClose={onClose}
      title="Especialidades"
      subtitle={doctor?.nombreCompleto}
      maxWidth="md"
      footer={
        <div className="flex gap-3 mt-4">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancelar
          </Button>
          <Button 
            variant="primary" 
            onClick={onSave} 
            isLoading={isUpdating} 
            icon={<Save className="w-5 h-5" />}
            className="flex-1"
          >
            Guardar
          </Button>
        </div>
      }
    >
      <div className="space-y-3">
        {especialidades?.map(esp => {
          const isSelected = selectedEspIds.includes(esp.id);
          return (
            <label 
              key={esp.id} 
              className={`flex items-center justify-between p-4 rounded-2xl cursor-pointer transition-all border-2 ${
                isSelected 
                  ? 'bg-primary-container/20 border-primary shadow-sm' 
                  : 'bg-surface-container-low border-transparent hover:border-outline-variant'
              }`}
            >
              <div className="flex items-center gap-3">
                <Stethoscope className={`w-5 h-5 ${isSelected ? 'text-primary' : 'text-on-surface-variant'}`} />
                <span className={`font-medium ${isSelected ? 'text-on-primary-container' : 'text-on-surface'}`}>
                  {esp.nombre}
                </span>
              </div>
              <input 
                type="checkbox" 
                className="w-5 h-5 rounded-md border-outline text-primary focus:ring-primary"
                checked={isSelected}
                onChange={() => onToggleEspSelection(esp.id)}
              />
            </label>
          );
        })}
      </div>
    </Modal>
  );
}