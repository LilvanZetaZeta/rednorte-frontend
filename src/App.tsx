import { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './config/supabaseClient';
import type { Session } from '@supabase/supabase-js';
import PortalPaciente from './views/PortalPaciente';

function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  // Estados de interfaz
  const [showAuthForm, setShowAuthForm] = useState(false);
  const [isLogin, setIsLogin] = useState(true); 
  
  // Estados de datos
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState(''); 
  const [rut, setRut] = useState(''); 
  const [authError, setAuthError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsInitializing(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setAuthError('');
    
    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setAuthError('Credenciales incorrectas.');
    } else {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName, rut: rut } }
      });
      if (error) {
        setAuthError(error.message);
      } else {
        alert('Cuenta creada. Ya puedes iniciar sesión.');
        setIsLogin(true);
        setPassword('');
      }
    }
    setIsLoading(false);
  };

  if (isInitializing) {
    return <div className="p-12 text-center text-primary font-h3 text-xl">Conectando...</div>;
  }

  // Si hay sesión, mandamos directo al portal
  if (session) {
    return (
      <Routes>
        <Route path="/*" element={<Navigate to="/portal" replace />} />
        <Route path="/portal" element={<PortalPaciente />} />
      </Routes>
    );
  }

  // --- VISTA HTML DE LA PÁGINA INICIAL (NO LOGUEADO) ---
  return (
    <div className="bg-background text-on-background font-body-md text-body-md antialiased selection:bg-primary-container selection:text-on-primary-container min-h-screen flex flex-col">
      
      {/* TopAppBar */}
      <header className="fixed top-0 w-full z-50 h-16 bg-white/95 backdrop-blur-md border-b border-surface-variant shadow-sm flex justify-between items-center px-6 lg:px-12 font-sans antialiased text-[#191c20] transition-opacity">
        <div className="text-lg font-bold tracking-tight text-primary flex items-center gap-2">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>health_and_safety</span>
          Servicio de Salud RedNorte
        </div>
        <div className="flex items-center gap-4 text-on-surface-variant">
          <button className="hover:text-primary transition-colors p-2 rounded-full hover:bg-surface-container-low flex items-center justify-center">
            <span className="material-symbols-outlined">notifications</span>
          </button>
          <button className="hover:text-primary transition-colors p-2 rounded-full hover:bg-surface-container-low flex items-center justify-center">
            <span className="material-symbols-outlined">help_outline</span>
          </button>
          <button className="hover:text-primary transition-colors p-2 rounded-full hover:bg-surface-container-low flex items-center justify-center">
            <span className="material-symbols-outlined">account_circle</span>
          </button>
        </div>
      </header>

      {/* Main Content Canvas */}
      <main className="pt-[80px] pb-xl px-gutter max-w-[1280px] mx-auto w-full flex flex-col gap-xl">
        
        {/* Hero Section */}
        <section className="flex flex-col lg:flex-row gap-lg items-center justify-between min-h-[716px]">
          
          <div className="flex-1 flex flex-col gap-md max-w-2xl z-10">
            {!showAuthForm ? (
              // VISTA POR DEFECTO (TEXTO Y BOTONES)
              <>
                <div className="inline-flex items-center gap-2 px-sm py-xs bg-surface-container-high text-on-surface-variant rounded-full font-label-sm text-label-sm w-fit shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)] border border-[#E2E8F0]">
                  <span className="material-symbols-outlined text-[16px] text-primary">verified</span>
                  Clinical Management System
                </div>
                <h1 className="font-h1 text-h1 text-on-background text-balance leading-tight">
                  Cuidando tu salud en el norte de Chile
                </h1>
                <p className="font-body-lg text-body-lg text-on-surface-variant text-pretty max-w-xl">
                  Experience seamless healthcare with our modern, unified network. We provide efficient, human-centric digital environments for both patients and healthcare providers, reducing cognitive load and prioritizing your well-being.
                </p>
                <div className="flex flex-wrap items-center gap-md pt-sm">
                  <button 
                    onClick={() => setShowAuthForm(true)}
                    className="bg-primary text-on-primary font-label-sm text-label-sm px-md py-sm rounded-lg hover:bg-primary-container hover:text-on-primary-container transition-colors shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)] border border-[#E2E8F0] flex items-center gap-2"
                  >
                    Patient Portal
                    <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                  </button>
                  <button className="bg-secondary-container text-on-secondary-container font-label-sm text-label-sm px-md py-sm rounded-lg hover:bg-surface-variant transition-colors flex items-center gap-2">
                    Institutional Login
                    <span className="material-symbols-outlined text-[18px]">login</span>
                  </button>
                </div>
              </>
            ) : (
              // VISTA DE FORMULARIO INYECTADA EN EL HERO
              <div className="bg-surface-container-lowest p-8 rounded-2xl shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)] border border-surface-variant w-full max-w-md animate-fade-in">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="font-h2 text-[24px] text-on-background">{isLogin ? 'Iniciar Sesión' : 'Registro de Paciente'}</h2>
                  <button onClick={() => setShowAuthForm(false)} className="text-on-surface-variant hover:text-error transition-colors">
                    <span className="material-symbols-outlined">close</span>
                  </button>
                </div>
                
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  {!isLogin && (
                    <>
                      <div>
                        <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1">Nombre Completo</label>
                        <input type="text" required={!isLogin} value={fullName} onChange={e => setFullName(e.target.value)}
                          className="w-full px-4 py-2 border border-outline-variant rounded-lg bg-surface text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none" />
                      </div>
                      <div>
                        <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1">RUT</label>
                        <input type="text" required={!isLogin} value={rut} onChange={e => setRut(e.target.value)} placeholder="12.345.678-9"
                          className="w-full px-4 py-2 border border-outline-variant rounded-lg bg-surface text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none" />
                      </div>
                    </>
                  )}
                  <div>
                    <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1">Correo Electrónico</label>
                    <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                      className="w-full px-4 py-2 border border-outline-variant rounded-lg bg-surface text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none" />
                  </div>
                  <div>
                    <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1">Contraseña</label>
                    <input type="password" required minLength={6} value={password} onChange={e => setPassword(e.target.value)}
                      className="w-full px-4 py-2 border border-outline-variant rounded-lg bg-surface text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none" />
                  </div>
                  
                  {authError && (
                    <div className="p-3 bg-error-container text-on-error-container font-caption text-caption rounded-lg flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px]">error</span> {authError}
                    </div>
                  )}

                  <button type="submit" disabled={isLoading} className="w-full bg-primary text-on-primary font-label-sm text-label-sm py-3 rounded-lg hover:bg-primary-container mt-2 transition-colors disabled:opacity-50">
                    {isLoading ? 'Procesando...' : (isLogin ? 'Acceder al Portal' : 'Completar Registro')}
                  </button>
                </form>
                
                <div className="mt-6 text-center">
                  <button onClick={() => setIsLogin(!isLogin)} className="font-label-sm text-label-sm text-primary hover:underline">
                    {isLogin ? '¿No tienes cuenta? Regístrate' : '¿Ya eres paciente? Inicia sesión'}
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="flex-1 w-full lg:w-auto relative">
            {/* Imagen abstracta de la clínica */}
            <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)] border border-[#E2E8F0] bg-surface-container-highest">
              <img alt="Modern healthcare professional" className="w-full h-full object-cover" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCdERDa2yQwAZxK6_DO-vP2lIs8S0NNWr2iyTNeGZ94w_uyhqEKSBFULh4VSQPxFfrGmzm70ZG5jh3W9JxGAyBTCAT5BpbTwThOgj_j_yH8sku8JUip0EQ9zELC3iwe-RL_9XT_xSnONULsk0H1_46KN_Rl8c_OhcSNaX4s_4Kxpye6_GnQ1QP1320QAmRfxhO36P4nm1RMUO0iDLJJaY6nF6QzatPuD-U46bnXx3TOukpkVaW6aa5Htcf8O1Sg7_Nz80MVR3Xr568"/>
              
              {/* Tarjeta flotante */}
              <div className="absolute bottom-md left-md bg-white/80 backdrop-blur-md p-md rounded-xl shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)] border border-[#E2E8F0] flex items-center gap-sm">
                <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container">
                  <span className="material-symbols-outlined">favorite</span>
                </div>
                <div>
                  <div className="font-label-sm text-label-sm text-on-surface-variant">Network Status</div>
                  <div className="font-h3 text-h3 text-primary">Optimal</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Bento Grid (Beneficios) */}
        <section className="flex flex-col gap-lg pt-lg border-t border-surface-variant">
          <div className="flex flex-col gap-sm max-w-2xl">
            <h2 className="font-h2 text-h2 text-on-background">Modernizing Healthcare Delivery</h2>
            <p className="font-body-md text-body-md text-on-surface-variant">Our platform is built on principles of high-utility minimalism, ensuring critical information is easily accessible.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
            <div className="bg-surface-container-lowest p-lg rounded-2xl shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)] border border-[#E2E8F0] flex flex-col gap-md hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-secondary-container text-on-secondary-container flex items-center justify-center">
                <span className="material-symbols-outlined text-[24px]">event_repeat</span>
              </div>
              <div>
                <h3 className="font-h3 text-h3 text-on-surface mb-xs">Automated Rescheduling</h3>
                <p className="font-body-md text-body-md text-on-surface-variant">Intelligent calendar management that autonomously optimizes appointment slots.</p>
              </div>
            </div>
            <div className="bg-surface-container-lowest p-lg rounded-2xl shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)] border border-[#E2E8F0] flex flex-col gap-md hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-secondary-container text-on-secondary-container flex items-center justify-center">
                <span className="material-symbols-outlined text-[24px]">hub</span>
              </div>
              <div>
                <h3 className="font-h3 text-h3 text-on-surface mb-xs">Unified Network</h3>
                <p className="font-body-md text-body-md text-on-surface-variant">A seamless, interconnected system bridging multiple facilities across the region.</p>
              </div>
            </div>
            <div className="bg-surface-container-lowest p-lg rounded-2xl shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)] border border-[#E2E8F0] flex flex-col gap-md hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-secondary-container text-on-secondary-container flex items-center justify-center">
                <span className="material-symbols-outlined text-[24px]">notifications_active</span>
              </div>
              <div>
                <h3 className="font-h3 text-h3 text-on-surface mb-xs">Real-time Alerts</h3>
                <p className="font-body-md text-body-md text-on-surface-variant">Instant, low-profile notifications for critical updates and lab results.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-surface-container-low border-t border-surface-variant py-lg mt-auto">
        <div className="max-w-[1280px] mx-auto px-gutter flex flex-col md:flex-row justify-between items-center gap-md">
          <div className="flex items-center gap-2 text-primary font-bold">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>health_and_safety</span>
            Servicio de Salud RedNorte
          </div>
          <div className="flex gap-md font-label-sm text-label-sm text-on-surface-variant">
            <a className="hover:text-primary transition-colors" href="#">Privacy Policy</a>
            <a className="hover:text-primary transition-colors" href="#">Terms of Service</a>
          </div>
          <div className="font-caption text-caption text-outline">© 2026 RedNorte. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
}

export default App;