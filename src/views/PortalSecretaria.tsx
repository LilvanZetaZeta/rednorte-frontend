import { useSecretariaVM } from '../viewmodels/useSecretariaVM';
import { 
  Search, 
  UserPlus, 
  Plus, 
  Calendar, 
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  MoreVertical
} from 'lucide-react';

export default function PortalSecretaria() {
  const vm = useSecretariaVM();

  return (
    <div className="animate-in fade-in duration-700 space-y-8 pb-10">
      {/* Header de la página */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-1">Agenda y Operaciones</h1>
          <p className="text-slate-500 font-medium">Miércoles, 06 de Mayo, 2026</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-sky-100 text-[#00507d] px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-sky-200 transition-colors text-sm font-bold border border-sky-200">
            <UserPlus size={18} /> Registrar Paciente
          </button>
          <button className="bg-[#00507d] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-sky-800 transition-colors text-sm font-bold shadow-sm">
            <Plus size={18} /> Nueva Cita
          </button>
        </div>
      </div>

      {/* Grid de Estadísticas (KPIs) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {vm.stats.map((stat, i) => (
          <div key={i} className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</h3>
              <span className="text-[#00507d] opacity-50"><Calendar size={20} /></span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black text-slate-800">{stat.value}</span>
              <span className="text-xs text-slate-400 font-medium">{stat.sub}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Área de Contenido Principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Columna Izquierda: Check-in Rápido */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <CheckCircle className="text-[#00507d]" size={20} /> Ingreso Express
            </h2>
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                value={vm.rutBusqueda}
                onChange={(e) => vm.setRutBusqueda(e.target.value)}
                placeholder="Escanear o ingresar RUT..."
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-100 outline-none transition-all"
              />
            </div>
            <button 
              onClick={vm.handleCheckIn}
              className="w-full bg-[#00507d] text-white py-3 rounded-lg font-bold hover:bg-sky-800 transition-colors shadow-sm"
            >
              Procesar Ingreso
            </button>
          </div>

          {/* Llegadas Pendientes */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex-1">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-slate-900">Pendientes por Llegar</h2>
              <span className="bg-red-50 text-red-600 text-[10px] font-black px-2 py-1 rounded-full uppercase tracking-tighter">Próxima 1hr</span>
            </div>
            <div className="space-y-3">
              <div className="p-4 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer group">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-bold text-slate-800 group-hover:text-[#00507d]">Maria Gonzalez P.</h4>
                    <p className="text-xs text-slate-400">RUT: 15.234.567-8</p>
                  </div>
                  <span className="font-bold text-slate-800">09:15</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <div className="w-2 h-2 rounded-full bg-sky-500"></div>
                  <span>Dr. Silva (Cardiología)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Columna Derecha: Horario Diario */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-8 shadow-sm flex flex-col h-[600px]">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-slate-900 italic font-serif">Horario Diario</h2>
            <div className="flex gap-2">
              <button className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-400"><ChevronLeft size={20}/></button>
              <button className="px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 font-bold text-sm text-slate-600">Hoy</button>
              <button className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-400"><ChevronRight size={20}/></button>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto pr-2 space-y-6">
            {/* Slot de tiempo */}
            <div className="flex gap-6 min-h-[80px]">
              <div className="w-16 text-right pt-2 text-xs font-bold text-slate-400">09:00</div>
              <div className="flex-1 border-l-2 border-sky-600 pl-6">
                <div className="bg-sky-50 border border-sky-100 rounded-xl p-4 shadow-sm relative group">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-[#00507d]">Carlos Ramirez T.</h4>
                      <p className="text-xs text-sky-600/70 font-medium">Evaluación ECG</p>
                    </div>
                    <span className="bg-[#00507d] text-white text-[9px] px-2 py-0.5 rounded-full font-black uppercase">En curso</span>
                  </div>
                  <button className="absolute right-4 bottom-4 text-slate-300 hover:text-slate-600"><MoreVertical size={18}/></button>
                </div>
              </div>
            </div>

            <div className="flex gap-6 min-h-[80px]">
              <div className="w-16 text-right pt-2 text-xs font-bold text-slate-400">09:30</div>
              <div className="flex-1 border-l-2 border-slate-100 pl-6">
                <div className="bg-slate-50/50 border border-slate-100 rounded-xl p-4 opacity-70">
                  <div className="flex justify-between items-start">
                    <span className="font-bold text-slate-800">Maria Gonzalez P.</span>
                    <span className="text-slate-400 text-[9px] font-bold uppercase">Pendiente</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">Consulta Nuevo Paciente</p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}