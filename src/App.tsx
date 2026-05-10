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
import GestionCentros from './views/GestionCentros';
import Reservas from './views/Reservas';
import DashboardCentro from './views/DashboardCentro'; 

export default function App() {
  const { session, isInitializing, isLoading } = useAuthVM();
  const navigate = useNavigate();
  const location = useLocation();

  const userRole = (session?.user?.user_metadata?.rol || 'paciente').toLowerCase();

  useEffect(() => {
    if (session && !isInitializing) {
      const isHome = location.pathname === '/' || location.pathname === '/portal';
      
      if (userRole === 'director' && isHome) {
        navigate('/director/portal', { replace: true });
      } 
      else if (userRole === 'administrativo' && isHome) {
        navigate('/admin/centro', { replace: true }); // Administrativo Local
      }
      else if (userRole === 'secretaria' && isHome) {
        navigate('/ops', { replace: true }); // Secretaria Operativa
      }
      else if (userRole === 'medico' && isHome) {
        navigate('/doctor/agenda', { replace: true }); // Médico Clínico
      }
    }
  }, [session, userRole, isInitializing, location.pathname, navigate]);

  if (isInitializing || isLoading) return <SplashScreen />;

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      
      {/* FLUJO PACIENTE */}
      <Route path="/agendar" element={<ProtectedRoute allowedRoles={['PACIENTE']}><Reservas /></ProtectedRoute>} />
      
      <Route element={<Layout />}>
        
        {/* 1. PACIENTE */}
        <Route path="/portal" element={<ProtectedRoute allowedRoles={['PACIENTE']}><PortalPaciente /></ProtectedRoute>} />
        
        {/* 2. MÉDICO */}
        <Route path="/doctor/agenda" element={<ProtectedRoute allowedRoles={['MEDICO']}><PortalDoctor /></ProtectedRoute>} />
        
        {/* 3. SECRETARÍA */}
        <Route path="/ops" element={<ProtectedRoute allowedRoles={['SECRETARIA']}><PortalSecretaria /></ProtectedRoute>} />
        
        {/* 4. ADMINISTRATIVO (Gerente Local) */}
        <Route path="/admin/centro" element={<ProtectedRoute allowedRoles={['ADMINISTRATIVO']}><DashboardCentro /></ProtectedRoute>} />
        
        {/* 5. DIRECTOR (Control Global) */}
        <Route path="/director/portal" element={<ProtectedRoute allowedRoles={['DIRECTOR']}><PortalDirector /></ProtectedRoute>} />
        <Route path="/director/centros" element={<ProtectedRoute allowedRoles={['DIRECTOR']}><GestionCentros /></ProtectedRoute>} />
        <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={['ADMINISTRATIVO', 'DIRECTOR']}><DashboardAdmin /></ProtectedRoute>} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}