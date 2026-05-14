import { useDashboardAdminVM } from '../viewmodels/useDashboardAdminVM';
import { ShieldCheck, UserCog, Tag, Loader2, AlertCircle, CheckCircle2, Stethoscope, X, Plus, Save } from 'lucide-react';
import { useState } from 'react';

const ROLES_DISPONIBLES = ['MEDICO', 'ADMINISTRATIVO', 'DIRECTOR', 'SECRETARIA'];

export default function DashboardAdmin() {
  const { 
    staff, 
    centros, 
    especialidades, 
    isLoading, 
    isError, 
    isDirector, 
    handleUpdateRol, 
    handleUpdateCentro, 
    handleUpdateEspecialidades,
    isUpdating 
  } = useDashboardAdminVM();
  
  const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);
  const [editingDoctor, setEditingDoctor] = useState<any | null>(null);
  const [selectedEspIds, setSelectedEspIds] = useState<number[]>([]);

  const onRolChange = async (id: number, nuevoRol: string) => {
    const result = await handleUpdateRol(id, nuevoRol);
    if (result.success) {
      setMessage({ text: 'Rol actualizado exitosamente', type: 'success' });
    } else {
      setMessage({ text: result.error || 'Error al actualizar rol', type: 'error' });
    }
    setTimeout(() => setMessage(null), 3000);
  };

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

  const openEspModal = (u: any) => {
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
        <div className={`fixed top-20 right-8 z-50 flex items-center gap-3 p-4 rounded-2xl animate-in slide-in-from-right-4 duration-300 shadow-xl border ${
          message.type === 'success' ? 'bg-success-container text-success border-success/20' : 'bg-error-container text-error border-error/20'
        }`}>
          {message.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          <p className="text-sm font-bold">{message.text}</p>
        </div>
      )}

      <div className="bg-surface-container-lowest rounded-[32px] border border-outline-variant shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-high/50 border-b border-outline-variant">
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-on-surface-variant">Usuario</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-on-surface-variant">Rol</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-on-surface-variant">Centro Médico</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-on-surface-variant">Especialidades</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-on-surface-variant text-right">Ajustes Rol</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {staff?.map((u: any) => (
                <tr key={u.id} className="hover:bg-surface-container-lowest/50 transition-colors">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-secondary-container text-secondary flex items-center justify-center font-bold shrink-0">
                        {u.nombreCompleto.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-on-surface truncate">{u.nombreCompleto}</p>
                        <p className="text-xs text-on-surface-variant truncate">{u.correo}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black tracking-tighter ${
                      u.rol === 'DIRECTOR' ? 'bg-primary-container text-primary' :
                      u.rol === 'MEDICO' ? 'bg-secondary-container text-secondary' :
                      u.rol === 'SECRETARIA' ? 'bg-error-container text-error' :
                      'bg-tertiary-container text-tertiary'
                    }`}>
                      {u.rol}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    {isDirector ? (
                      <select
                        defaultValue={u.centroMedico?.id || ""}
                        disabled={isUpdating}
                        onChange={(e) => onCentroChange(u.id, e.target.value)}
                        className="bg-surface-container-high border-none text-xs font-medium rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-primary transition-all cursor-pointer disabled:opacity-50 w-full max-w-[160px]"
                      >
                        <option value="">Sin Centro</option>
                        {centros?.map(c => (
                          <option key={c.id} value={c.id}>{c.nombreSucursal}</option>
                        ))}
                      </select>
                    ) : (
                      <span className="text-sm text-on-surface-variant">
                        {u.centroMedico?.nombreSucursal || 'Sin Centro'}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-5">
                    {u.rol === 'MEDICO' ? (
                      <div className="flex flex-wrap gap-2 items-center">
                        {u.especialidades?.length > 0 ? (
                          u.especialidades.map((esp: any) => (
                            <span key={esp.id} className="px-2 py-0.5 bg-primary/10 text-primary rounded-md text-[10px] font-bold border border-primary/20">
                              {esp.nombre}
                            </span>
                          ))
                        ) : (
                          <span className="text-[10px] text-on-surface-variant/50 italic">Sin especialidad</span>
                        )}
                        {isDirector && (
                          <button 
                            onClick={() => openEspModal(u)}
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

      {/* MODAL DE ESPECIALIDADES */}
      {editingDoctor && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-surface-container-lowest rounded-[32px] w-full max-w-md p-8 shadow-2xl border border-outline-variant animate-in zoom-in-95 duration-300">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-xl font-bold text-on-surface">Especialidades</h2>
                <p className="text-sm text-on-surface-variant">{editingDoctor.nombreCompleto}</p>
              </div>
              <button 
                onClick={() => setEditingDoctor(null)}
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
                    onChange={() => toggleEspSelection(esp.id)}
                  />
                </label>
              ))}
            </div>

            <div className="mt-8 flex gap-3">
              <button 
                onClick={() => setEditingDoctor(null)}
                className="flex-1 py-4 rounded-2xl font-bold text-on-surface-variant hover:bg-surface-container-high transition-colors"
              >
                Cancelar
              </button>
              <button 
                onClick={handleSaveEspecialidades}
                disabled={isUpdating}
                className="flex-1 py-4 bg-primary text-on-primary rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all disabled:opacity-50"
              >
                {isUpdating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}