import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthVM } from './viewmodels/useAuthVM';
import { ShieldPlus, BadgeCheck, ArrowRight, X } from 'lucide-react';

// Vistas
import PortalPaciente from './views/PortalPaciente';
import PortalDoctor from './views/PortalDoctor';
import DashboardAdmin from './views/DashboardAdmin';
import Layout from './views/Layout';

function App() {
  const vm = useAuthVM();

  if (vm.isInitializing) {
    return <div className="min-h-screen flex items-center justify-center text-primary font-h3 text-xl">Conectando...</div>;
  }

  // --- LÓGICA DE RUTEO PROTEGIDO CON LAYOUT ---
  if (vm.session) {
    const userRole = vm.session.user.user_metadata?.rol || 'paciente';

    return (
      <Routes>
        <Route element={<Layout />}>
          
          {userRole === 'paciente' && (
            <>
              <Route path="/portal" element={<PortalPaciente />} />
              <Route path="*" element={<Navigate to="/portal" replace />} />
            </>
          )}
          
          {userRole === 'doctor' && (
            <>
              <Route path="/doctor/agenda" element={<PortalDoctor />} />
              <Route path="*" element={<Navigate to="/doctor/agenda" replace />} />
            </>
          )}

          {userRole === 'admin' && (
            <>
              <Route path="/admin/dashboard" element={<DashboardAdmin />} />
              <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
            </>
          )}

        </Route>
      </Routes>
    );
  }

  // --- VISTA PÚBLICA (Landing Page) ---
  return (
    <div className="bg-background text-on-background font-body-md text-body-md min-h-screen flex flex-col">
       <header className="fixed top-0 w-full z-50 h-16 bg-white/95 backdrop-blur-md border-b border-surface-variant shadow-sm flex justify-between items-center px-6 lg:px-12 font-sans antialiased text-[#191c20]">
        <div className="text-lg font-bold tracking-tight text-primary flex items-center gap-2">
          <ShieldPlus className="w-6 h-6" />
          Servicio de Salud RedNorte
        </div>
      </header>

      <main className="pt-[80px] pb-xl px-gutter max-w-[1280px] mx-auto w-full flex flex-col gap-xl">
        <section className="flex flex-col lg:flex-row gap-lg items-center justify-between min-h-[716px]">
          <div className="flex-1 flex flex-col gap-md max-w-2xl z-10">
            {!vm.showAuthForm ? (
              <>
                <div className="inline-flex items-center gap-2 px-sm py-xs bg-surface-container-high text-on-surface-variant rounded-full font-label-sm text-label-sm w-fit shadow-sm border border-[#E2E8F0]">
                  <BadgeCheck className="w-4 h-4 text-primary" />
                  Sistema de Gestión Clínica
                </div>
                <h1 className="font-h1 text-h1 text-on-background text-balance leading-tight">
                  Cuidando tu salud en el norte de Chile
                </h1>
                <div className="flex flex-wrap items-center gap-md pt-sm">
                  <button 
                    onClick={() => vm.setShowAuthForm(true)}
                    className="bg-primary text-on-primary font-label-sm text-label-sm px-md py-sm rounded-lg hover:bg-primary-container hover:text-on-primary-container transition-colors shadow-sm border flex items-center gap-2"
                  >
                    Portal del Paciente <ArrowRight className="w-[18px] h-[18px]" />
                  </button>
                </div>
              </>
            ) : (
              <div className="bg-surface-container-lowest p-8 rounded-2xl shadow-sm border border-surface-variant w-full max-w-md animate-fade-in">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="font-h2 text-[24px] text-on-background">{vm.isLogin ? 'Iniciar Sesión' : 'Registro'}</h2>
                  <button onClick={() => vm.setShowAuthForm(false)} className="text-on-surface-variant hover:text-error transition-colors">
                    <X className="w-6 h-6" />
                  </button>
                </div>
                
                <form onSubmit={vm.handleSubmit} className="flex flex-col gap-4">
                  {!vm.isLogin && (
                    <>
                      <input type="text" required value={vm.fullName} onChange={e => vm.setFullName(e.target.value)} placeholder="Nombre Completo" className="w-full px-4 py-2 border rounded-lg outline-none focus:border-primary" />
                      <input type="text" required value={vm.rut} onChange={e => vm.setRut(e.target.value)} placeholder="RUT (ej. 12.345.678-9)" className="w-full px-4 py-2 border rounded-lg outline-none focus:border-primary" />
                    </>
                  )}
                  <input type="email" required value={vm.email} onChange={e => vm.setEmail(e.target.value)} placeholder="Correo Electrónico" className="w-full px-4 py-2 border rounded-lg outline-none focus:border-primary" />
                  <input type="password" required minLength={6} value={vm.password} onChange={e => vm.setPassword(e.target.value)} placeholder="Contraseña" className="w-full px-4 py-2 border rounded-lg outline-none focus:border-primary" />
                  
                  {vm.authError && <div className="p-3 bg-error-container text-error rounded-lg text-sm">{vm.authError}</div>}
                  <button type="submit" disabled={vm.isLoading} className="w-full bg-primary text-on-primary py-3 rounded-lg hover:bg-primary-container transition-colors disabled:opacity-50">
                    {vm.isLoading ? 'Procesando...' : (vm.isLogin ? 'Acceder' : 'Registrarse')}
                  </button>
                </form>
                <div className="mt-6 text-center">
                  <button onClick={() => vm.setIsLogin(!vm.isLogin)} className="text-primary hover:underline text-sm">
                    {vm.isLogin ? '¿No tienes cuenta? Regístrate' : '¿Ya eres paciente? Inicia sesión'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;