import { useState, useEffect } from 'react';
import { supabase } from '../config/supabaseClient';
import { useObtenerMisReservasQuery, useCancelarReservaMutation } from '../services/reservasApi';

export const usePortalPacienteVM = () => {
  const [userName, setUserName] = useState<string>('Paciente');
  
  // RTK Query maneja isLoading, isError y caché automáticamente
  const { data: reservas = [], isLoading, isError } = useObtenerMisReservasQuery();
  const [cancelarReserva] = useCancelarReservaMutation();

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.user_metadata?.full_name) {
        setUserName(user.user_metadata.full_name);
      }
    };
    fetchUser();
  }, []);

  const handleCancelar = async (id: string) => {
    if(window.confirm('¿Deseas cancelar esta reserva? Liberaremos el cupo.')) {
      await cancelarReserva(id);
      // Aquí se dispararía el llamado al MS-Reasignacion desde el Backend
    }
  };

  const handleCerrarSesion = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  return {
    userName,
    reservas,
    isLoading,
    isError,
    handleCancelar,
    handleCerrarSesion
  };
};