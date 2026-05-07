import { useDashboardAdminVM } from '../viewmodels/useDashboardAdminVM';
import { ShieldCheck, UserCog, Mail, Tag, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';

const ROLES_DISPONIBLES = ['MEDICO', 'ADMINISTRATIVO', 'DIRECTOR', 'SECRETARIA'];

export default function DashboardAdmin() {
  const { staff, isLoading, isError, isDirector, handleUpdateRol, isUpdating } = useDashboardAdminVM();
  const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);

  const onRolChange = async (id: number, nuevoRol: string) => {
    const result = await handleUpdateRol(id, nuevoRol);
    if (result.success) {
      setMessage({ text: 'Rol actualizado exitosamente', type: 'success' });
    } else {
      setMessage({ text: result.error || 'Error al actualizar rol', type: 'error' });
    }
    setTimeout(() => setMessage(null), 3000);
  };

  if (isLoading) return <div className="p-12 text-center text-primary flex flex-col items-center gap-4"><Loader2 className="w-8 h-8 animate-spin" /> Cargando personal...</div>;
  if (isError) return <div className="p-12 text-center text-error flex flex-col items-center gap-4"><AlertCircle className="w-8 h-8" /> Error al cargar el listado de personal.</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-700 max-w-6xl mx-auto">
      <section className="flex justify-between items-center">
        <div>
          <h1 className="font-h1 text-h1 text-on-background mb-1">Panel de Administración</h1>
          <p className="text-on-surface-variant">Gestión de personal y roles del sistema</p>
        </div>
        <div className="p-3 bg-primary-container text-primary rounded-2xl shadow-sm shadow-primary/10">
          <ShieldCheck className="w-6 h-6" />
        </div>
      </section>

      {message && (
        <div className={`flex items-center gap-3 p-4 rounded-2xl animate-in slide-in-from-top-2 duration-300 shadow-lg ${
          message.type === 'success' ? 'bg-success-container text-success border border-success/20' : 'bg-error-container text-error border border-error/20'
        }`}>
          {message.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          <p className="text-sm font-bold">{message.text}</p>
        </div>
      )}

      <div className="bg-surface-container-lowest rounded-3xl border border-outline-variant shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-high/50 border-b border-outline-variant">
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-on-surface-variant">Usuario</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-on-surface-variant">Contacto</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-on-surface-variant">Rol Actual</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-on-surface-variant text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {staff?.map((u: any) => (
                <tr key={u.id} className="hover:bg-surface-container-lowest/50 transition-colors">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-secondary-container text-secondary flex items-center justify-center font-bold">
                        {u.nombreCompleto.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-on-surface">{u.nombreCompleto}</p>
                        <p className="text-xs text-on-surface-variant">{u.rut}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2 text-sm text-on-surface-variant">
                      <Mail className="w-4 h-4" />
                      {u.correo}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      u.rol === 'DIRECTOR' ? 'bg-primary-container text-primary' :
                      u.rol === 'MEDICO' ? 'bg-secondary-container text-secondary' :
                      u.rol === 'SECRETARIA' ? 'bg-error-container text-error' :
                      'bg-tertiary-container text-tertiary'
                    }`}>
                      {u.rol}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right">
                    {isDirector ? (
                      <div className="flex items-center justify-end gap-3">
                        <UserCog className="w-4 h-4 text-on-surface-variant" />
                        <select
                          defaultValue={u.rol}
                          disabled={isUpdating}
                          onChange={(e) => onRolChange(u.id, e.target.value)}
                          className="bg-surface-container-high border-none text-sm font-medium rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-primary transition-all cursor-pointer disabled:opacity-50"
                        >
                          {ROLES_DISPONIBLES.map(r => (
                            <option key={r} value={r}>{r}</option>
                          ))}
                        </select>
                      </div>
                    ) : (
                      <Tag className="w-4 h-4 text-on-surface-variant inline-block opacity-50" />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}