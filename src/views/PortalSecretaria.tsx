import { useSecretariaVM } from '../viewmodels/useSecretariaVM';
import { Search, Plus, Calendar, CheckCircle, X } from 'lucide-react';

export default function PortalSecretaria() {
  const vm = useSecretariaVM();

  const formatHora = (fechaString: string) => {
    const date = new Date(fechaString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (vm.isLoading) return <div className="p-10 text-center font-bold text-slate-500">Cargando base de datos...</div>;

  return (
    <div className="animate-in fade-in duration-700 space-y-8 pb-10 relative">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-1">Agenda y Operaciones</h1>
          <p className="text-slate-500 font-medium">{new Date().toLocaleDateString('es-CL', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => vm.setShowModalBloqueo(true)}
            className="bg-red-50 text-red-600 px-4 py-2 rounded-lg text-sm font-bold border border-red-200 hover:bg-red-100 transition"
          >
            Bloquear Agenda Médico
          </button>
          <button 
            onClick={vm.openModalNuevaCita}
            className="bg-[#00507d] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-sky-800 transition-colors text-sm font-bold shadow-sm"
          >
            <Plus size={18} /> Nueva Cita
          </button>
        </div>
      </div>

      {/* KPIS REALES */}
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

      {/* ÁREA PRINCIPAL */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* COLUMNA IZQUIERDA: CHECK-IN */}
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
              Confirmar Llegada (Check-In)
            </button>
          </div>

          {/* LLEGADAS PENDIENTES */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex-1">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-slate-900">Pendientes por Llegar</h2>
              <span className="bg-orange-50 text-orange-600 text-[10px] font-black px-2 py-1 rounded-full uppercase">Hoy</span>
            </div>
            <div className="space-y-3">
              {vm.llegadasPendientes.length === 0 && <p className="text-sm text-slate-400">No hay pacientes pendientes.</p>}
              {vm.llegadasPendientes.map(res => (
                <div key={res.id} className="p-4 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer group">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-bold text-slate-800 group-hover:text-[#00507d]">{res.paciente.nombreCompleto}</h4>
                      <p className="text-xs text-slate-400">RUT: {res.paciente.rut}</p>
                    </div>
                    <span className="font-bold text-[#00507d]">{formatHora(res.fechaHora)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <div className="w-2 h-2 rounded-full bg-sky-500"></div>
                    <span>Dr. {res.medico.nombreCompleto}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* COLUMNA DERECHA: HORARIO DIARIO */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-8 shadow-sm flex flex-col h-[600px]">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-slate-900 italic font-serif">Horario Diario</h2>
          </div>
          
          <div className="flex-1 overflow-y-auto pr-2 space-y-6">
            {vm.reservasHoy.length === 0 && <p className="text-center text-slate-500 pt-10">Agenda libre el día de hoy.</p>}
            
            {vm.reservasHoy.map((reserva) => {
              const isConfirmada = reserva.estado === 'CONFIRMADA';
              const isCancelada = reserva.estado.includes('CANCELADA') || reserva.estado === 'NO_ASISTE';
              
              return (
                <div key={reserva.id} className="flex gap-6 min-h-[80px]">
                  <div className="w-16 text-right pt-2 text-xs font-bold text-slate-400">{formatHora(reserva.fechaHora)}</div>
                  <div className={`flex-1 border-l-2 pl-6 ${isConfirmada ? 'border-green-500' : isCancelada ? 'border-red-200' : 'border-sky-600'}`}>
                    
                    <div className={`rounded-xl p-4 shadow-sm relative group border ${isCancelada ? 'bg-red-50/50 opacity-60 border-red-100' : 'bg-sky-50 border-sky-100'}`}>
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className={`font-bold ${isCancelada ? 'text-red-700 line-through' : 'text-[#00507d]'}`}>{reserva.paciente.nombreCompleto}</h4>
                          <p className="text-xs text-slate-500 font-medium">Médico: {reserva.medico.nombreCompleto}</p>
                        </div>
                        <span className={`text-[9px] px-2 py-0.5 rounded-full font-black uppercase text-white ${isConfirmada ? 'bg-green-500' : isCancelada ? 'bg-red-400' : 'bg-[#00507d]'}`}>
                          {reserva.estado.replace(/_/g, ' ')}
                        </span>
                      </div>
                      
                      {!isCancelada && reserva.estado !== 'FINALIZADA' && (
                        <div className="flex gap-2 mt-3 pt-3 border-t border-sky-200/50">
                          <button onClick={() => vm.handleMarcarInasistencia(reserva.id)} className="text-[10px] font-bold text-slate-500 hover:text-red-600">Marcar Inasistencia</button>
                          <button onClick={() => vm.handleCancelarCita(reserva.id)} className="text-[10px] font-bold text-red-500 hover:text-red-700 ml-auto">Cancelar / Escalar</button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* MODAL NUEVA CITA */}
      {vm.showModalNuevaCita && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-[#00507d] text-white">
              <h2 className="text-xl font-bold">Agendar Nueva Cita</h2>
              <button onClick={() => vm.setShowModalNuevaCita(false)} className="hover:bg-white/20 p-1 rounded-lg transition"><X size={20} /></button>
            </div>
            
              <form onSubmit={vm.handleCrearCitaSubmit} className="p-6 space-y-4">
                {/* RUT CON VALIDACIÓN DE FORMATO */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">RUT Paciente *</label>
                  <div className="flex gap-2">
                    <input 
                      required 
                      type="text" 
                      value={vm.formData.rut} 
                      onChange={e => vm.setFormData({...vm.formData, rut: vm.formatearRut(e.target.value)})} 
                      className="w-full p-2 border rounded-lg outline-none font-mono" 
                      placeholder="12.345.678-9"
                      disabled={vm.rutVerificado}
                    />
                    <button type="button" onClick={vm.handleValidarRutPaciente} className="px-4 py-2 bg-slate-200 rounded-lg font-bold text-slate-700 hover:bg-slate-300 transition">Validar</button>
                  </div>
                  {vm.validacionRutError && <p className="mt-2 text-sm text-red-600">{vm.validacionRutError}</p>}
                  {vm.rutVerificado && (
                    <p className="mt-2 text-sm text-green-700">{vm.pacienteExiste ? 'Paciente registrado. Complete con los datos de la cita.' : 'Nuevo paciente. Ingrese nombre y correo para registrarlo.'}</p>
                  )}
                </div>

                {vm.rutVerificado && vm.pacienteExiste === false && (
                  <div className="grid grid-cols-1 gap-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1">Nombre Completo *</label>
                      <input value={vm.formData.nombre} required type="text" placeholder="Nombre Completo" onChange={e => vm.setFormData({...vm.formData, nombre: e.target.value})} className="w-full p-2 border rounded-lg" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1">Correo Electrónico *</label>
                      <input value={vm.formData.correo} required type="email" placeholder="Correo Electrónico" onChange={e => vm.setFormData({...vm.formData, correo: e.target.value})} className="w-full p-2 border rounded-lg" />
                    </div>
                  </div>
                )}

                {vm.rutVerificado && (
                  <>
                    <hr className="border-slate-100 my-2" />

                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1">Filtrar por Especialidad</label>
                        <select value={vm.filtroEspecialidadId} onChange={e => vm.setFiltroEspecialidadId(e.target.value ? Number(e.target.value) : '')} className="w-full p-2 border rounded-lg outline-none">
                          <option value="">Todas las especialidades</option>
                          {vm.especialidadesDisponibles.map((esp) => (
                            <option key={esp.id} value={esp.id}>{esp.nombre}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1">Seleccionar Médico *</label>
                        <select 
                          required 
                          value={vm.formData.medicoId} 
                          onChange={e => vm.setFormData({...vm.formData, medicoId: e.target.value})}
                          className="w-full p-2 border rounded-lg outline-none"
                        >
                          <option value="">Seleccione un médico de su centro...</option>
                          {vm.doctoresFiltrados.map(m => (
                            <option key={m.id} value={m.id}>{m.nombreCompleto} - {m.especialidades?.[0]?.nombre || 'General'}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1">Fecha de la Cita *</label>
                        <input 
                          required 
                          type="date" 
                          min={new Date().toISOString().slice(0, 10)}
                          value={vm.fechaSeleccionada}
                          onChange={e => {
                            vm.setFechaSeleccionada(e.target.value);
                            vm.setFormData({...vm.formData, fechaHora: ''});
                          }}
                          className="w-full p-2 border rounded-lg outline-none" 
                        />
                      </div>

                      {vm.fechaSeleccionada && vm.formData.medicoId && (
                        <div>
                          <label className="block text-xs font-bold text-slate-500 mb-1">Horas Disponibles *</label>
                          {vm.horasDisponibles.length > 0 ? (
                            <div className="grid grid-cols-2 gap-2">
                              {vm.horasDisponibles.map((hora) => (
                                <button
                                  key={hora}
                                  type="button"
                                  onClick={() => vm.setFormData({...vm.formData, fechaHora: hora})}
                                  className={`px-3 py-2 border rounded-lg text-left ${vm.formData.fechaHora === hora ? 'bg-[#00507d] text-white' : 'bg-slate-50 text-slate-700 hover:bg-slate-100'}`}
                                >
                                  {new Date(hora).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </button>
                              ))}
                            </div>
                          ) : (
                            <p className="text-sm text-slate-500">No hay horas disponibles para {new Date(vm.fechaSeleccionada).toLocaleDateString('es-CL', { weekday: 'long', day: 'numeric', month: 'long' })} después de la hora actual.</p>
                          )}
                        </div>
                      )}
                    </div>
                  </>
                )}

                <div className="pt-4 flex gap-3">
                  <button type="button" onClick={() => vm.setShowModalNuevaCita(false)} className="flex-1 px-4 py-2 bg-slate-100 text-slate-600 rounded-lg font-bold">Cancelar</button>
                  <button type="submit" className="flex-1 px-4 py-2 bg-[#00507d] text-white rounded-lg font-bold">Confirmar Cita</button>
                </div>
              </form>
          </div>
        </div>
      )}

      {/* MODAL BLOQUEO AGENDA (CONTINGENCIA) */}
      {vm.showModalBloqueo && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-red-600 text-white">
              <h2 className="text-xl font-bold">Bloquear Agenda Médica</h2>
              <button onClick={() => vm.setShowModalBloqueo(false)} className="hover:bg-white/20 p-1 rounded-lg transition"><X size={20} /></button>
            </div>
            
            <form onSubmit={vm.handleBloqueoSubmit} className="p-6 space-y-4">
              <div className="p-3 bg-red-50 border border-red-100 rounded-lg text-xs text-red-800 font-medium">
                Esta acción cancelará todas las citas del médico en la fecha indicada y encenderá de forma autónoma el motor reactivo de reasignación.
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">ID Médico Ausente *</label>
                <input required type="number" value={vm.bloqueoData.medicoId} onChange={e => vm.setBloqueoData({...vm.bloqueoData, medicoId: e.target.value})} className="w-full p-2 border rounded-lg outline-none" placeholder="ID del profesional"/>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Fecha de la Ausencia *</label>
                <input required type="date" value={vm.bloqueoData.fecha} onChange={e => vm.setBloqueoData({...vm.bloqueoData, fecha: e.target.value})} className="w-full p-2 border rounded-lg outline-none" />
              </div>

              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => vm.setShowModalBloqueo(false)} className="flex-1 px-4 py-2 bg-slate-100 text-slate-600 rounded-lg font-bold hover:bg-slate-200">Cancelar</button>
                <button type="submit" className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 shadow-sm">Ejecutar Bloqueo</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}