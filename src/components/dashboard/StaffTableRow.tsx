import { Plus } from 'lucide-react';
import type { IUsuario } from '../../models/types';
import type { ICentroMedico } from '../../models/types';

interface StaffTableRowProps {
  usuario: IUsuario;
  centros?: ICentroMedico[];
  isDirector: boolean;
  isUpdating: boolean;
  onCentroChange: (usuarioId: number, centroIdStr: string) => Promise<void>;
  onOpenEspModal: (usuario: IUsuario) => void;
}

export default function StaffTableRow({
  usuario,
  centros,
  isDirector,
  isUpdating,
  onCentroChange,
  onOpenEspModal
}: StaffTableRowProps) {
  return (
    <tr className="hover:bg-surface-container-lowest/50 transition-colors">
      <td className="px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-secondary-container text-secondary flex items-center justify-center font-bold shrink-0">
            {usuario.nombreCompleto.charAt(0)}
          </div>
          <div className="min-w-0">
            <p className="font-bold text-on-surface truncate">{usuario.nombreCompleto}</p>
            <p className="text-xs text-on-surface-variant truncate">{usuario.correo}</p>
          </div>
        </div>
      </td>
      <td className="px-6 py-5">
        <span className={`px-3 py-1 rounded-full text-[10px] font-black tracking-tighter ${
          usuario.rol === 'DIRECTOR' ? 'bg-primary-container text-primary' :
          usuario.rol === 'MEDICO' ? 'bg-secondary-container text-secondary' :
          usuario.rol === 'SECRETARIA' ? 'bg-error-container text-error' :
          'bg-tertiary-container text-tertiary'
        }`}>
          {usuario.rol}
        </span>
      </td>
      <td className="px-6 py-5">
        {isDirector ? (
          <select
            defaultValue={usuario.centroMedico?.id || ""}
            disabled={isUpdating}
            onChange={(e) => onCentroChange(usuario.id, e.target.value)}
            className="bg-surface-container-high border-none text-xs font-medium rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-primary transition-all cursor-pointer disabled:opacity-50 w-full max-w-[160px]"
          >
            <option value="">Sin Centro</option>
            {centros?.map(c => (
              <option key={c.id} value={c.id}>{c.nombreSucursal}</option>
            ))}
          </select>
        ) : (
          <span className="text-sm text-on-surface-variant">
            {usuario.centroMedico?.nombreSucursal || 'Sin Centro'}
          </span>
        )}
      </td>
      <td className="px-6 py-5">
        {usuario.rol === 'MEDICO' ? (
          <div className="flex flex-wrap gap-2 items-center">
            {usuario.especialidades && usuario.especialidades.length > 0 ? (
              usuario.especialidades.map((esp) => (
                <span key={esp.id} className="px-2 py-0.5 bg-primary/10 text-primary rounded-md text-[10px] font-bold border border-primary/20">
                  {esp.nombre}
                </span>
              ))
            ) : (
              <span className="text-[10px] text-on-surface-variant/50 italic">Sin especialidad</span>
            )}
            {isDirector && (
              <button 
                onClick={() => onOpenEspModal(usuario)}
                className="p-1 hover:bg-primary/10 rounded-full text-primary transition-colors"
                title="Gestionar especialidades"
              >
                <Plus className="w-4 h-4" />
              </button>
            )}
          </div>
        ) : (
          <span className="text-xs text-on-surface-variant/30 italic">No aplica</span>
        )}
      </td>
    </tr>
  );
}
