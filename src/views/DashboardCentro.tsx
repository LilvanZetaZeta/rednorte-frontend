import { useState } from 'react';
import { Building2, Activity, UserPlus, Users, Loader2 } from 'lucide-react';

export default function DashboardCentro() {
  // Aquí debes traer los centros que tiene asignados este administrativo desde tu ViewModel
  const misCentros = [{ id: 1, nombre: "Sucursal Central" }]; 
  
  const [nuevoStaff, setNuevoStaff] = useState({ nombre: '', correo: '', rol: 'SECRETARIA', centroId: misCentros[0].id });
  const [isCreating, setIsCreating] = useState(false);

  const handleCrearStaffLocal = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    // Aquí llamas a tu mutación: POST /api/usuarios enviando el objeto nuevoStaff
    setTimeout(() => {
      alert(`Usuario ${nuevoStaff.nombre} creado y asignado al centro exitosamente.`);
      setNuevoStaff({ nombre: '', correo: '', rol: 'SECRETARIA', centroId: misCentros[0].id });
      setIsCreating(false);
    }, 1000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700 max-w-7xl mx-auto pb-10">
      <section className="flex justify-between items-center bg-white p-8 rounded-3xl border border-outline-variant shadow-sm">
        <div>
          <h1 className="font-h1 text-h1 text-on-background mb-1">Gerencia de Sucursal</h1>
          <p className="text-on-surface-variant">Administración local y contratación de personal.</p>
        </div>
        <div className="w-16 h-16 bg-secondary-container text-secondary rounded-2xl flex items-center justify-center">
          <Building2 size={32} />
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* FORMULARIO DE CONTRATACIÓN LOCAL */}
        <div className="lg:col-span-1">
          <form onSubmit={handleCrearStaffLocal} className="bg-surface-container-lowest p-6 rounded-3xl border border-outline-variant shadow-sm flex flex-col gap-4 sticky top-24">
            <h2 className="font-h3 text-h3 flex items-center gap-2 mb-4"><UserPlus className="text-primary"/> Ingresar Personal</h2>
            
            <input required type="text" placeholder="Nombre Completo" value={nuevoStaff.nombre} onChange={e => setNuevoStaff({...nuevoStaff, nombre: e.target.value})} className="px-4 py-3 rounded-xl bg-surface-container-high border-none outline-none text-sm" />
            <input required type="email" placeholder="Correo electrónico" value={nuevoStaff.correo} onChange={e => setNuevoStaff({...nuevoStaff, correo: e.target.value})} className="px-4 py-3 rounded-xl bg-surface-container-high border-none outline-none text-sm" />
            
            <select value={nuevoStaff.rol} onChange={e => setNuevoStaff({...nuevoStaff, rol: e.target.value})} className="px-4 py-3 rounded-xl bg-surface-container-high border-none outline-none text-sm font-bold">
              <option value="SECRETARIA">Secretaria (Operaciones)</option>
              <option value="MEDICO">Médico (Clínico)</option>
            </select>

            <select value={nuevoStaff.centroId} onChange={e => setNuevoStaff({...nuevoStaff, centroId: Number(e.target.value)})} className="px-4 py-3 rounded-xl bg-surface-container-high border-none outline-none text-sm">
              {misCentros.map(c => <option key={c.id} value={c.id}>Destino: {c.nombre}</option>)}
            </select>

            <button disabled={isCreating} type="submit" className="mt-4 bg-primary text-on-primary py-3.5 rounded-xl font-bold flex items-center justify-center gap-2">
              {isCreating ? <Loader2 className="animate-spin w-5 h-5"/> : 'Registrar en Sucursal'}
            </button>
          </form>
        </div>

        {/* LISTADO DEL STAFF DEL CENTRO */}
        <div className="lg:col-span-2">
          <div className="bg-surface-container-lowest border border-outline-variant rounded-3xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-outline-variant flex justify-between items-center bg-surface-container-high/30">
              <h2 className="font-bold text-on-surface flex items-center gap-2"><Users className="text-primary"/> Mi Equipo de Trabajo</h2>
            </div>
            <div className="p-12 text-center text-on-surface-variant flex flex-col items-center gap-3">
              <Activity className="w-10 h-10 opacity-30" />
              <p>Aquí aparecerá el personal clínico y administrativo que asignes a tus centros médicos.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}