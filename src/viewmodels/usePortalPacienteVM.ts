import { useState, useEffect, useMemo } from 'react';
import { supabase } from '../config/supabaseClient';
import { useObtenerMisReservasQuery, useCancelarReservaMutation } from '../services/reservasApi';

export const usePortalPacienteVM = () => {
  const [userName, setUserName] = useState<string>('Paciente');
  const [userAuthId, setUserAuthId] = useState<string>(''); 
  const { 
    data, 
    isLoading, 
    isError, 
    refetch 
  } = useObtenerMisReservasQuery(userAuthId, {
    skip: !userAuthId, 
    refetchOnMountOrArgChange: true 
  });

  
  const reservas = useMemo(() => {
    if (!data) return [];
    return Array.isArray(data) ? data : [];
  }, [data]);

  const [cancelarReserva] = useCancelarReservaMutation();

  
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error) throw error;

        if (user) {
          
          setUserAuthId(user.id);
          const name = user.user_metadata?.nombre_completo || 'Paciente';
          setUserName(name);
        }
      } catch (err) {
        console.error("Error al recuperar sesión:", err);
      }
    };
    fetchUser();
  }, []);

  const handleCancelar = async (id: string) => {
    if (window.confirm('¿Deseas cancelar esta reserva?')) {
      try {
        await cancelarReserva(id).unwrap();
      } catch (err) {
        console.error("Error al cancelar:", err);
        alert("No se pudo cancelar la reserva.");
      }
    }
  };

  const handleCerrarSesion = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  return {
    userName, reservas, isLoading, isError,
    handleCancelar, handleCerrarSesion, refetch
  };
};