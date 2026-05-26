import { useEffect, Suspense, lazy } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useAuthVM } from './viewmodels/useAuthVM';
import { ProtectedRoute } from './components/ProtectedRoute';
import { SplashScreen } from './components/SplashScreen';

// Importaciones Lazy
const Home = lazy(() => import('./views/Home'));
const Layout = lazy(() => import('./views/Layout'));
const PortalPaciente = lazy(() => import('./views/PortalPaciente'));
const PortalDoctor = lazy(() => import('./views/PortalDoctor'));
const PortalDirector = lazy(() => import('./views/PortalDirector'));
const PortalSecretaria = lazy(() => import('./views/PortalSecretaria'));
const DashboardAdmin = lazy(() => import('./views/DashboardAdmin'));
const GestionCentros = lazy(() => import('./views/GestionCentros'));
const GestionEspecialidades = lazy(() => import('./views/GestionEspecialidades'));
const Reservas = lazy(() => import('./views/Reservas'));
const DashboardCentro = lazy(() => import('./views/DashboardCentro'));

export default function App() {
  const { session, isInitializing, isLoading } = useAuthVM();
  const navigate = useNavigate();
  const location = useLocation();

  const userRole = (session?.user?.user_metadata?.rol || 'paciente').toLowerCase();

  useEffect(() => {
    if (session && !isInitializing) {
      const isHome = location.pathname === '/' || location.pathname === '/portal';
      
      if (userRole === 'director' && isHome) navigate('/director/portal', { replace: true });
      else if (userRole === 'administrativo' && isHome) navigate('/admin/centro', { replace: true });
      else if (userRole === 'secretaria' && isHome) navigate('/ops', { replace: true });
      else if (userRole === 'medico' && isHome) navigate('/doctor/agenda', { replace: true });
    }
  }, [session, userRole, isInitializing, location.pathname, navigate]);

  if (isInitializing || isLoading) return <SplashScreen />;

  return (
    // Suspense muestra tu SplashScreen mientras se descarga el trozo de código necesario
    <Suspense fallback={<SplashScreen />}>
      <Routes>
        <Route path="/" element={<Home />} />
        
        {/* FLUJO PACIENTE */}
        <Route path="/agendar" element={
          <ProtectedRoute allowedRoles={['PACIENTE']}><Reservas /></ProtectedRoute>
        } />
        
        <Route element={<Layout />}>
          <Route path="/portal" element={<ProtectedRoute allowedRoles={['PACIENTE']}><PortalPaciente /></ProtectedRoute>} />
          <Route path="/doctor/agenda" element={<ProtectedRoute allowedRoles={['MEDICO']}><PortalDoctor /></ProtectedRoute>} />
          <Route path="/ops" element={<ProtectedRoute allowedRoles={['SECRETARIA']}><PortalSecretaria /></ProtectedRoute>} />
          <Route path="/admin/centro" element={<ProtectedRoute allowedRoles={['ADMINISTRATIVO']}><DashboardCentro /></ProtectedRoute>} />
          
          {/* DIRECTOR */}
          <Route path="/director/portal" element={<ProtectedRoute allowedRoles={['DIRECTOR']}><PortalDirector /></ProtectedRoute>} />
          <Route path="/director/centros" element={<ProtectedRoute allowedRoles={['DIRECTOR']}><GestionCentros /></ProtectedRoute>} />
          <Route path="/director/especialidades" element={<ProtectedRoute allowedRoles={['DIRECTOR']}><GestionEspecialidades /></ProtectedRoute>} />
          <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={['ADMINISTRATIVO', 'DIRECTOR']}><DashboardAdmin /></ProtectedRoute>} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}