import { useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useAuthVM } from './viewmodels/useAuthVM';
import { ShieldPlus, BadgeCheck, ArrowRight, X } from 'lucide-react';
import heroImage from './assets/hero.webp';
import PortalPaciente from './views/PortalPaciente';
import PortalDoctor from './views/PortalDoctor';
import DashboardAdmin from './views/DashboardAdmin';
import PortalDirector from './views/PortalDirector';
import Layout from './views/Layout';
import { SplashScreen } from './components/SplashScreen';

function AppContent() {
  const { session, isInitializing, showAuthForm, setShowAuthForm, isLogin, setIsLogin, email, handleEmailChange, password, handlePasswordChange, fullName, handleFullNameChange, rut, handleRutChange, authError, isLoading, handleSubmit, fieldErrors } = useAuthVM();
  const navigate = useNavigate();
  const location = useLocation();

  const metadata = session?.user?.user_metadata || {};
  const appMetadata = session?.user?.app_metadata || {};
  const rawRol = metadata.rol || metadata.role || metadata.Role || appMetadata.rol || appMetadata.role || 'paciente';
  const userRole = rawRol.toString().trim().toLowerCase();

  useEffect(() => {
    if (session && !isInitializing) {
      
      // Si es director y está en el portal de pacientes o en la raíz, redirigir
      if (userRole === 'director' && (location.pathname === '/portal' || location.pathname === '/')) {
        navigate('/director/portal', { replace: true });
      }
      // Si es paciente y está en el portal de director, devolver al portal
      else if (userRole === 'paciente' && location.pathname === '/director/portal') {
        navigate('/portal', { replace: true });
      }
    }
  }, [session, userRole, isInitializing, location.pathname, navigate]);

  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-medium text-on-surface-variant">Conectando...</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return <SplashScreen />;
  }


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
                            <div>
                              <input 
                                type="text" 
                                required 
                                value={fullName} 
                                onChange={e => handleFullNameChange(e.target.value)} 
                                placeholder="Nombre Completo" 
                                autoComplete="name"
                                className={`w-full px-4 py-2 border rounded-lg ${fieldErrors.fullName ? 'border-error' : 'border-gray-300'}`}
                              />
                              {fieldErrors.fullName && (
                                <p className="text-error text-sm mt-1">{fieldErrors.fullName}</p>
                              )}
                            </div>
                            <div>
                              <input 
                                type="text" 
                                required 
                                value={rut} 
                                onChange={e => handleRutChange(e.target.value)} 
                                placeholder="RUT (ej: 12345678-9)" 
                                autoComplete="off"
                                className={`w-full px-4 py-2 border rounded-lg ${fieldErrors.rut ? 'border-error' : 'border-gray-300'}`}
                              />
                              {fieldErrors.rut && (
                                <p className="text-error text-sm mt-1">{fieldErrors.rut}</p>
                              )}
                            </div>
                          </>
                        )}
                        <div>
                          <input 
                            type="email" 
                            required 
                            value={email} 
                            onChange={e => handleEmailChange(e.target.value)} 
                            placeholder="Correo" 
                            autoComplete="email"
                            className={`w-full px-4 py-2 border rounded-lg ${fieldErrors.email && !isLogin ? 'border-error' : 'border-gray-300'}`}
                          />
                          {fieldErrors.email && !isLogin && (
                            <p className="text-error text-sm mt-1">{fieldErrors.email}</p>
                          )}
                        </div>
                        <div>
                          <input 
                            type="password" 
                            required 
                            value={password} 
                            onChange={e => handlePasswordChange(e.target.value)} 
                            placeholder="Contraseña" 
                            autoComplete={isLogin ? "current-password" : "new-password"}
                            className={`w-full px-4 py-2 border rounded-lg ${fieldErrors.password && !isLogin ? 'border-error' : 'border-gray-300'}`}
                          />
                          {fieldErrors.password && !isLogin && (
                            <p className="text-error text-sm mt-1">{fieldErrors.password}</p>
                          )}
                        </div>
                        {authError && <div className="p-3 bg-error-container text-error rounded-lg text-sm">{authError}</div>}
                        <button 
                          type="submit" 
                          disabled={isLoading || (!isLogin && Object.values(fieldErrors).some(err => err !== null))} 
                          className="w-full bg-primary text-on-primary py-3 rounded-lg disabled:opacity-50"
                        >
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
          <Navigate 
            to={
              userRole === 'director' ? "/director/portal" : 
              userRole === 'admin' ? "/admin/dashboard" : 
              userRole === 'doctor' ? "/doctor/agenda" : 
              "/portal"
            } 
            replace 
          />
        )
      } />

      {/* RUTAS PROTEGIDAS BAJO LAYOUT */}
      <Route element={<Layout />}>
        <Route path="/portal" element={session ? <PortalPaciente /> : <Navigate to="/" replace />} />
        <Route path="/doctor/agenda" element={session ? <PortalDoctor /> : <Navigate to="/" replace />} />
        <Route path="/admin/dashboard" element={session ? <DashboardAdmin /> : <Navigate to="/" replace />} />
        <Route path="/director/portal" element={session ? <PortalDirector /> : <Navigate to="/" replace />} />
      </Route>

      {/* CATCH ALL */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppContent;