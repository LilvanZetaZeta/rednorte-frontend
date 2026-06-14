import { useState, useEffect } from 'react';
import { supabase } from '../../config/supabaseClient';
import { useGetUsuarioPorIdAuthQuery } from '../../services/usuariosApi';

export const useAuthCentro = () => {
  const [idAuth, setIdAuth] = useState<string | null>(null);
  const [fallbackName, setFallbackName] = useState('');

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setIdAuth(session.user.id);
        setFallbackName(session.user.user_metadata?.nombre_completo || session.user.email || '');
      }
    });
  }, []);

  const { data: miPerfil, isLoading: loadingPerfil } = useGetUsuarioPorIdAuthQuery(idAuth!, { skip: !idAuth });
  
  const miCentroId   = miPerfil?.centroMedico?.id ?? null;
  const nombreCentro = miPerfil?.centroMedico?.nombreSucursal ?? '';
  const adminName    = miPerfil?.nombreCompleto || fallbackName;

  return { 
    idAuth, 
    miCentroId, 
    nombreCentro, 
    adminName, 
    loadingPerfil 
  };
};