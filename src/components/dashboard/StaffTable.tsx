import type { IUsuario } from '../../models/types';
import type { ICentroMedico } from '../../models/types';
import StaffTableRow from './StaffTableRow';

interface StaffTableProps {
  staff?: IUsuario[];
  centros?: ICentroMedico[];
  isDirector: boolean;
  isUpdating: boolean;
  onCentroChange: (usuarioId: number, centroIdStr: string) => Promise<void>;
  onOpenEspModal: (usuario: IUsuario) => void;
}

export default function StaffTable({
  staff,
  centros,
  isDirector,
  isUpdating,
  onCentroChange,
  onOpenEspModal
}: StaffTableProps) {
  return (
    <div className="bg-surface-container-lowest rounded-[32px] border border-outline-variant shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-container-high/50 border-b border-outline-variant">
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-on-surface-variant">Usuario</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-on-surface-variant">Rol</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-on-surface-variant">Centro Médico</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-on-surface-variant">Especialidades</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant">
            {staff?.map((u) => (
              <StaffTableRow
                key={u.id}
                usuario={u}
                centros={centros}
                isDirector={isDirector}
                isUpdating={isUpdating}
                onCentroChange={onCentroChange}
                onOpenEspModal={onOpenEspModal}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
