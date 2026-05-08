import { useNavigate } from 'react-router-dom';
import { useAuthVM } from '../viewmodels/useAuthVM';
import { 
  ShieldPlus, 
  BadgeCheck, 
  ArrowRight, 
  X, 
  Activity, 
  Users, 
  Building2, 
  Stethoscope,
  HeartPulse,
  CheckCircle,
  Loader2,
  Calendar
} from 'lucide-react';
import heroImage from '../assets/hero.webp'; 

export default function Home() {
  const vm = useAuthVM();
  const navigate = useNavigate();

  const handleAction = () => {
    if (!vm.session) return vm.setShowAuthForm(true);
    const role = (vm.session.user.user_metadata?.rol || 'PACIENTE').toUpperCase();
    navigate(role === 'DIRECTOR' ? '/director/portal' : role === 'SECRETARIA' ? '/ops' : '/portal');
  };

  return (
    <div className="bg-[#f7f9fe] text-slate-900 font-sans min-h-screen flex flex-col selection:bg-sky-700 selection:text-white">
      
      {/* POPUP DE ÉXITO (TOAST) FLOTANTE */}
      {vm.successMessage && (
        <div className="fixed bottom-8 right-8 z-[200] animate-in slide-in-from-bottom-8 fade-in duration-300">
          <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl shadow-xl flex items-center gap-3">
            <CheckCircle className="text-emerald-500 w-6 h-6 shrink-0" />
            <span className="text-emerald-700 font-bold text-sm">{vm.successMessage}</span>
          </div>
        </div>
      )}

      {/* HEADER */}
      <header className="fixed top-0 w-full z-50 h-16 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm flex justify-between items-center px-6 lg:px-12 transition-all">
        <div className="text-lg font-black tracking-tight text-[#00507d] flex items-center gap-2">
          <ShieldPlus className="text-[#00507d] w-6 h-6" /> RedNorte
        </div>
        <div className="flex items-center gap-4 text-slate-500">
          <div className="hidden md:flex items-center gap-6 mr-4 text-sm font-medium">
            <a href="#servicios" className="hover:text-[#00507d] transition-colors">Especialidades</a>
            <a href="#centros" className="hover:text-[#00507d] transition-colors">Nuestros Centros</a>
          </div>
          {vm.session ? (
            <button onClick={vm.handleLogout} className="text-sm font-bold text-red-500 hover:bg-red-50 px-5 py-2 rounded-full transition-colors border border-transparent hover:border-red-100">Cerrar Sesión</button>
          ) : (
            <button onClick={() => vm.setShowAuthForm(true)} className="text-sm font-bold text-[#00507d] bg-sky-50 hover:bg-sky-100 px-6 py-2 rounded-full transition-colors">Acceder al Portal</button>
          )}
        </div>
      </header>

      {/* MODAL DE AUTENTICACIÓN (DINÁMICO) */}
      {vm.showAuthForm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white p-8 rounded-3xl shadow-2xl border border-slate-200 w-full max-w-md relative animate-in zoom-in-95 duration-300 min-h-[450px] flex flex-col">
            
            {/* Cabecera del Modal */}
            {!vm.isLoading && !vm.isSuccess && (
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-3xl font-black text-slate-900">{vm.isLogin ? 'Bienvenido' : 'Crear Cuenta'}</h2>
                  <p className="text-sm text-slate-500 mt-1">{vm.isLogin ? 'Ingresa a tu portal de salud' : 'Únete a la red médica'}</p>
                </div>
                <button onClick={() => vm.setShowAuthForm(false)} className="text-slate-400 hover:text-slate-600 bg-slate-100 p-2 rounded-full"><X size={20} /></button>
              </div>
            )}

            {/* CONTENIDO SEGÚN ESTADO */}
            {vm.isLoading ? (
              <div className="flex-1 flex flex-col items-center justify-center gap-4 animate-in fade-in duration-500">
                <div className="relative">
                  <Loader2 className="w-16 h-16 text-[#00507d] animate-spin" />
                  <div className="absolute inset-0 bg-sky-500/10 blur-2xl rounded-full animate-pulse" />
                </div>
                <p className="text-[#00507d] font-bold text-lg animate-pulse">Comprobando credenciales...</p>
              </div>
            ) : vm.isSuccess ? (
              <div className="flex-1 flex flex-col items-center justify-center gap-4 animate-in zoom-in duration-500 text-center">
                <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center shadow-lg shadow-emerald-200/50">
                  <CheckCircle size={48} />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-900">¡Acceso Correcto!</h3>
                  <p className="text-slate-500 font-medium mt-1">Redirigiendo a tu espacio de salud...</p>
                </div>
              </div>
            ) : (
              <>
                <form onSubmit={vm.handleSubmit} className="flex flex-col gap-4">
                  {!vm.isLogin && (
                    <div className="flex flex-col gap-4 animate-in slide-in-from-right-4">
                      <div className="flex flex-col gap-1">
                        <input type="text" required value={vm.fullName} onChange={e => vm.handleFullNameChange(e.target.value)} placeholder="Nombre Completo" className={`w-full px-4 py-4 border rounded-xl bg-slate-50 font-medium ${vm.fieldErrors.fullName ? 'border-red-500' : 'border-slate-200'} outline-none focus:border-[#00507d]`} />
                        {vm.fieldErrors.fullName && <span className="text-red-500 text-xs font-bold px-2">{vm.fieldErrors.fullName}</span>}
                      </div>
                      <div className="flex flex-col gap-1">
                        <input type="text" required value={vm.rut} onChange={e => vm.handleRutChange(e.target.value)} placeholder="RUT (ej: 12345678-9)" className={`w-full px-4 py-4 border rounded-xl bg-slate-50 font-medium ${vm.fieldErrors.rut ? 'border-red-500' : 'border-slate-200'} outline-none focus:border-[#00507d]`} />
                        {vm.fieldErrors.rut && <span className="text-red-500 text-xs font-bold px-2">{vm.fieldErrors.rut}</span>}
                      </div>
                    </div>
                  )}
                  <div className="flex flex-col gap-1">
                    <input type="email" required value={vm.email} onChange={e => vm.handleEmailChange(e.target.value)} placeholder="Correo Electrónico" className={`w-full px-4 py-4 border rounded-xl bg-slate-50 font-medium ${!vm.isLogin && vm.fieldErrors.email ? 'border-red-500' : 'border-slate-200'} outline-none focus:border-[#00507d]`} />
                    {!vm.isLogin && vm.fieldErrors.email && <span className="text-red-500 text-xs font-bold px-2">{vm.fieldErrors.email}</span>}
                  </div>

                  <div className="flex flex-col gap-1">
                    <input type="password" required value={vm.password} onChange={e => vm.handlePasswordChange(e.target.value)} placeholder="Contraseña" className={`w-full px-4 py-4 border rounded-xl bg-slate-50 font-medium ${!vm.isLogin && vm.fieldErrors.password ? 'border-red-500' : 'border-slate-200'} outline-none focus:border-[#00507d]`} />
                    {!vm.isLogin && vm.fieldErrors.password && <span className="text-red-500 text-xs font-bold px-2">{vm.fieldErrors.password}</span>}
                  </div>
                  
                  {vm.authError && <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm font-bold flex items-center gap-2"><ShieldPlus className="shrink-0"/> {vm.authError}</div>}
                  
                  <button type="submit" className="w-full bg-[#00507d] text-white py-4 rounded-xl font-bold mt-4 hover:bg-sky-800 transition-all shadow-lg active:scale-[0.98]">
                    {vm.isLogin ? 'Ingresar a mi Portal' : 'Registrarme ahora'}
                  </button>
                </form>
                <button onClick={() => vm.setIsLogin(!vm.isLogin)} className="mt-auto pt-8 text-slate-500 text-sm font-medium w-full text-center hover:text-[#00507d] transition-colors">
                  {vm.isLogin ? '¿No tienes cuenta? ' : '¿Ya eres paciente? '} <span className="font-bold underline">{vm.isLogin ? 'Crea tu cuenta' : 'Inicia sesión'}</span>
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* CONTENIDO DE LA LANDING PAGE */}
      <main className="pt-[100px] flex flex-col">
        
        {/* HERO SECTION */}
        <section className="px-6 max-w-[1280px] mx-auto w-full flex flex-col lg:flex-row gap-12 items-center justify-between min-h-[600px] mb-20">
          <div className="flex-1 flex flex-col gap-6 max-w-2xl z-10 animate-in slide-in-from-bottom-8 duration-700">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-[#00507d] rounded-full text-sm font-bold w-fit shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500"></span>
              </span>
              Sistema Integrado de Gestión Clínica
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black text-slate-900 text-balance leading-[1.1] tracking-tighter">
              Tu salud, conectada de manera <span className="text-[#00507d] italic font-serif">inteligente.</span>
            </h1>
            
            <p className="text-lg text-slate-500 text-pretty max-w-xl font-medium leading-relaxed">
              Agenda tus horas, revisa tus exámenes y accede a tu historial clínico desde cualquier lugar. La red médica más avanzada del norte, en la palma de tu mano.
            </p>
            
            <div className="flex flex-wrap items-center gap-4 pt-6">
              <button onClick={handleAction} className="bg-[#00507d] text-white font-bold px-8 py-4 rounded-2xl hover:bg-sky-800 transition-all shadow-xl shadow-sky-900/20 flex items-center gap-3 hover:-translate-y-1">
                {vm.session ? 'Ir a mi Portal' : 'Agendar mi Atención'} <ArrowRight className="w-5 h-5" />
              </button>
              {!vm.session && (
                <button onClick={() => vm.setShowAuthForm(true)} className="bg-white text-slate-700 border border-slate-200 font-bold px-8 py-4 rounded-2xl hover:bg-slate-50 transition-all shadow-sm">
                  Iniciar Sesión
                </button>
              )}
            </div>

            <div className="flex items-center gap-6 mt-8 pt-8 border-t border-slate-200">
              <div className="flex -space-x-4">
                <img className="w-12 h-12 rounded-full border-4 border-[#f7f9fe] object-cover" src="https://i.pravatar.cc/100?img=1" alt="Paciente" />
                <img className="w-12 h-12 rounded-full border-4 border-[#f7f9fe] object-cover" src="https://i.pravatar.cc/100?img=2" alt="Paciente" />
                <img className="w-12 h-12 rounded-full border-4 border-[#f7f9fe] object-cover" src="https://i.pravatar.cc/100?img=3" alt="Paciente" />
                <div className="w-12 h-12 rounded-full border-4 border-[#f7f9fe] bg-sky-100 flex items-center justify-center text-xs font-bold text-[#00507d]">+2k</div>
              </div>
              <div className="text-sm font-medium text-slate-500 leading-tight">
                Pacientes confían en <br/> nuestra red cada mes.
              </div>
            </div>
          </div>

          <div className="flex-1 w-full lg:w-auto relative hidden lg:block animate-in fade-in duration-1000 delay-300">
            <div className="relative w-full aspect-[4/3] rounded-[40px] overflow-hidden shadow-2xl bg-slate-200">
              <img src={heroImage} alt="Clínica Moderna" className="w-full h-full object-cover" />
              
              <div className="absolute top-8 left-8 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-xl flex items-center gap-4 animate-bounce hover:animate-none transition-all duration-500">
                <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                  <Activity size={24} />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Disponibilidad</div>
                  <div className="text-lg font-black text-slate-800">Horas para hoy</div>
                </div>
              </div>

              <div className="absolute bottom-8 right-8 bg-[#00507d]/90 backdrop-blur-md p-5 rounded-2xl shadow-xl flex flex-col gap-2">
                <div className="flex items-center gap-2 text-sky-200 text-xs font-bold uppercase tracking-wider">
                  <BadgeCheck size={16} /> Especialistas Certificados
                </div>
                <div className="text-2xl font-black text-white">+150 Médicos</div>
              </div>
            </div>
          </div>
        </section>

        {/* SECCIÓN DE MÉTRICAS (Social Proof) */}
        <section className="bg-white border-y border-slate-200 py-16">
          <div className="max-w-[1280px] mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-slate-100">
            <div className="text-center px-4">
              <div className="flex justify-center text-[#00507d] mb-4"><Users size={32} /></div>
              <p className="text-4xl font-black text-slate-900 mb-1">10k+</p>
              <p className="text-sm font-medium text-slate-500">Pacientes Atendidos</p>
            </div>
            <div className="text-center px-4">
              <div className="flex justify-center text-[#00507d] mb-4"><Building2 size={32} /></div>
              <p className="text-4xl font-black text-slate-900 mb-1">8</p>
              <p className="text-sm font-medium text-slate-500">Centros Médicos</p>
            </div>
            <div className="text-center px-4">
              <div className="flex justify-center text-[#00507d] mb-4"><Stethoscope size={32} /></div>
              <p className="text-4xl font-black text-slate-900 mb-1">25+</p>
              <p className="text-sm font-medium text-slate-500">Especialidades</p>
            </div>
            <div className="text-center px-4">
              <div className="flex justify-center text-[#00507d] mb-4"><HeartPulse size={32} /></div>
              <p className="text-4xl font-black text-slate-900 mb-1">99%</p>
              <p className="text-sm font-medium text-slate-500">Satisfacción</p>
            </div>
          </div>
        </section>

        {/* BENTO GRID - BENEFICIOS */}
        <section id="servicios" className="max-w-[1280px] mx-auto px-6 py-24 flex flex-col gap-12">
          <div className="flex flex-col gap-4 max-w-2xl text-center mx-auto">
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">Atención médica de vanguardia</h2>
            <p className="text-lg text-slate-500 font-medium">Nuestra plataforma está construida con tecnología de punta para asegurar que tu información esté siempre disponible y segura.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-10 rounded-[32px] border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 group">
              <div className="w-14 h-14 rounded-2xl bg-sky-50 text-[#00507d] flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                <Calendar size={28} />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">Agenda Inteligente</h3>
              <p className="text-slate-500 leading-relaxed">
                Visualiza la disponibilidad en tiempo real de todos nuestros especialistas. Cancela o reprograma con un solo clic.
              </p>
            </div>
            
            <div className="bg-white p-10 rounded-[32px] border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 group">
              <div className="w-14 h-14 rounded-2xl bg-sky-50 text-[#00507d] flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                <ShieldPlus size={28} />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">Historial Unificado</h3>
              <p className="text-slate-500 leading-relaxed">
                Tus exámenes, recetas y evoluciones centralizadas. Los médicos de nuestra red acceden a tu historial al instante.
              </p>
            </div>
            
            <div className="bg-white p-10 rounded-[32px] border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 group">
              <div className="w-14 h-14 rounded-2xl bg-sky-50 text-[#00507d] flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                <Activity size={28} />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">Resultados en Línea</h3>
              <p className="text-slate-500 leading-relaxed">
                Recibe notificaciones automáticas cuando tus resultados de laboratorio o imágenes estén listos para revisión.
              </p>
            </div>
          </div>
        </section>

      </main>

      {/* FOOTER CORPORATIVO LIMPIO */}
      <footer className="bg-slate-900 text-slate-300 pt-20 pb-20 mt-auto">
        <div className="max-w-[1280px] mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 text-white font-black text-2xl mb-6">
              <ShieldPlus className="text-sky-400" size={32} /> RedNorte
            </div>
            <p className="text-slate-400 max-w-sm leading-relaxed">
              Transformando la experiencia de salud en la zona norte con tecnología, empatía y profesionales de excelencia.
            </p>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">Pacientes</h4>
            <ul className="space-y-4 font-medium text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Portal del Paciente</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Agendar Hora</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Especialidades</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">Emergencias</h4>
            <div className="flex items-center gap-3 text-red-400 font-bold">
              <Activity size={20} />
              <span>Urgencias: 131</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}