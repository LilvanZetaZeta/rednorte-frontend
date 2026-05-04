import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthVM } from './viewmodels/useAuthVM';
import { ShieldPlus, BadgeCheck, ArrowRight, X } from 'lucide-react';
import heroImage from './assets/hero.webp';
import PortalPaciente from './views/PortalPaciente';
import PortalDoctor from './views/PortalDoctor';
import DashboardAdmin from './views/DashboardAdmin';
import Layout from './views/Layout';

function App() {
  const { session, isInitializing, showAuthForm, setShowAuthForm, isLogin, setIsLogin, email, setEmail, password, setPassword, fullName, setFullName, rut, setRut, authError, isLoading, handleSubmit } = useAuthVM();

  if (isInitializing) {
    return <div className="min-h-screen flex items-center justify-center text-primary font-h3 text-xl">Conectando con RedNorte...</div>;
  }

  const userRole = session?.user?.user_metadata?.rol?.toLowerCase() || 'paciente';

  return (
    <Routes>
      {/* RUTA PÚBLICA / LANDING */}
      <Route path="/" element={
        !session ? (
          <div className="bg-background text-on-background font-body-md min-h-screen flex flex-col">
            <header className="fixed top-0 w-full z-50 h-16 bg-white/95 border-b border-surface-variant flex justify-between items-center px-6 lg:px-12">
              <div className="text-lg font-bold tracking-tight text-primary flex items-center gap-2">
                <ShieldPlus className="w-6 h-6" /> Servicio de Salud RedNorte
              </div>
            </header>
            <main className="pt-[80px] pb-xl px-gutter max-w-[1280px] mx-auto w-full flex flex-col gap-xl">
              <section className="flex flex-col lg:flex-row gap-lg items-center justify-between min-h-[716px]">
                <div className="flex-1 flex flex-col gap-md max-w-2xl z-10">
                  {!showAuthForm ? (
                    <>
                      <div className="inline-flex items-center gap-2 px-sm py-xs bg-surface-container-high rounded-full border border-[#E2E8F0]">
                        <BadgeCheck className="w-4 h-4 text-primary" /> Sistema de Gestión Clínica
                      </div>
                      <h1 className="font-h1 text-h1 leading-tight">Cuidando tu salud en el norte de Chile</h1>
                      <button onClick={() => setShowAuthForm(true)} className="bg-primary text-on-primary px-md py-sm rounded-lg flex items-center gap-2 w-fit">
                        Portal del Paciente <ArrowRight className="w-[18px] h-[18px]" />
                      </button>
                    </>
                  ) : (
                    <div className="bg-surface-container-lowest p-8 rounded-2xl shadow-sm border border-surface-variant w-full max-w-md animate-fade-in">
                      <div className="flex justify-between items-center mb-6">
                        <h2 className="font-h2 text-[24px]">{isLogin ? 'Iniciar Sesión' : 'Registro'}</h2>
                        <button onClick={() => setShowAuthForm(false)}><X className="w-6 h-6" /></button>
                      </div>
                      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        {!isLogin && (
                          <>
                            <input type="text" required value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Nombre Completo" className="w-full px-4 py-2 border rounded-lg" />
                            <input type="text" required value={rut} onChange={e => setRut(e.target.value)} placeholder="RUT" className="w-full px-4 py-2 border rounded-lg" />
                          </>
                        )}
                        <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="Correo" className="w-full px-4 py-2 border rounded-lg" />
                        <input type="password" required value={password} onChange={e => setPassword(e.target.value)} placeholder="Contraseña" className="w-full px-4 py-2 border rounded-lg" />
                        {authError && <div className="p-3 bg-error-container text-error rounded-lg text-sm">{authError}</div>}
                        <button type="submit" disabled={isLoading} className="w-full bg-primary text-on-primary py-3 rounded-lg disabled:opacity-50">
                          {isLoading ? 'Procesando...' : (isLogin ? 'Acceder' : 'Registrarse')}
                        </button>
                      </form>
                      <button onClick={() => setIsLogin(!isLogin)} className="mt-4 text-primary text-sm w-full text-center hover:underline">
                        {isLogin ? '¿No tienes cuenta? Regístrate' : '¿Ya eres paciente? Inicia sesión'}
                      </button>
                    </div>
                  )}
                </div>
                <div className="flex-1 hidden lg:flex items-center justify-center">
                  <img src={heroImage} alt="Servicio de Salud RedNorte" className="w-full h-auto max-w-lg object-cover rounded-lg" />
                </div>
              </section>
            </main>
          </div>
        ) : (
          /* Redirección automática si ya hay sesión */
          <Navigate to={userRole === 'admin' ? "/admin/dashboard" : userRole === 'doctor' ? "/doctor/agenda" : "/portal"} replace />
        )
      } />

      {/* RUTAS PROTEGIDAS BAJO LAYOUT */}
      <Route element={<Layout />}>
        <Route path="/portal" element={session ? <PortalPaciente /> : <Navigate to="/" replace />} />
        <Route path="/doctor/agenda" element={session ? <PortalDoctor /> : <Navigate to="/" replace />} />
        <Route path="/admin/dashboard" element={session ? <DashboardAdmin /> : <Navigate to="/" replace />} />
      </Route>

      {/* CATCH ALL */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;