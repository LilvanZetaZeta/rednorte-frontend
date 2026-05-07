import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthVM } from '../viewmodels/useAuthVM';
import type { JSX } from 'react';

interface ProtectedRouteProps {
  children: JSX.Element;
  allowedRoles: string[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { session, isInitializing } = useAuthVM();

  // Mientras Supabase verifica la sesión, no renderizamos nada (o podrías poner el SplashScreen aquí)
  if (isInitializing) return null;

  // Si no hay sesión activa, expulsamos al Home
  if (!session) return <Navigate to="/" replace />;

  // Obtenemos el rol asegurando que esté en mayúsculas para que coincida con allowedRoles
  const userRole = (session.user.user_metadata?.rol || 'PACIENTE').toUpperCase();

  // Si el rol del usuario está permitido, mostramos la vista, si no, lo devolvemos al Home
  return allowedRoles.includes(userRole) ? children : <Navigate to="/" replace />;
};