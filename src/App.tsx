import { useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useAuthVM } from './viewmodels/useAuthVM';
import { ProtectedRoute } from './components/ProtectedRoute';
import { SplashScreen } from './components/SplashScreen';

// Vistas
import Home from './views/Home';
import Layout from './views/Layout';
import PortalPaciente from './views/PortalPaciente';
import PortalDoctor from './views/PortalDoctor';
import PortalDirector from './views/PortalDirector';
import PortalSecretaria from './views/PortalSecretaria';
import DashboardAdmin from './views/DashboardAdmin';
import Reservas from './views/Reservas';

export default function App() {
  const { session, isInitializing, isLoading } = useAuthVM();
  const navigate = useNavigate();
  const location = useLocation();

  const userRole = (session?.user?.user_metadata?.rol || 'paciente').toLowerCase();

  // Efecto para evitar que usuarios entren a portales de otros roles
  // (Ya no te expulsa del '/' si estás logueado)
  useEffect(() => {
    if (session && !isInitializing) {
      if (userRole === 'director' && location.pathname === '/portal') {
        navigate('/director/portal', { replace: true });
      } else if (userRole === 'paciente' && location.pathname === '/director/portal') {
        navigate('/portal', { replace: true });
      }
    }
  }, [session, userRole, isInitializing, location.pathname, navigate]);

  if (isInitializing || isLoading) return <SplashScreen />;

  return (
    <Routes>
      {/* RUTA PÚBLICA (Ahora siempre renderiza el Home, logueado o no) */}
      <Route path="/" element={<Home />} />
      
      {/* FLUJO TRANSACCIONAL */}
      <Route path="/agendar" element={
        <ProtectedRoute allowedRoles={['PACIENTE']}>
          <Reservas />
        </ProtectedRoute>
      } />
      
      {/* RUTAS PROTEGIDAS */}
      <Route element={<Layout />}>
        <Route path="/portal" element={<ProtectedRoute allowedRoles={['PACIENTE']}><PortalPaciente /></ProtectedRoute>} />
        <Route path="/doctor/agenda" element={<ProtectedRoute allowedRoles={['MEDICO']}><PortalDoctor /></ProtectedRoute>} />
        <Route path="/ops" element={<ProtectedRoute allowedRoles={['ADMINISTRATIVO', 'SECRETARIA']}><PortalSecretaria /></ProtectedRoute>} />
        <Route path="/director/portal" element={<ProtectedRoute allowedRoles={['DIRECTOR']}><PortalDirector /></ProtectedRoute>} />
        <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={['ADMINISTRATIVO', 'DIRECTOR']}><DashboardAdmin /></ProtectedRoute>} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}