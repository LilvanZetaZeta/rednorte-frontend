import { useState, useEffect } from 'react';
import { supabase } from '../config/supabaseClient';
import { useObtenerMisReservasQuery, useCancelarReservaMutation } from '../services/reservasApi';

export const usePortalPacienteVM = () => {
  const [userName, setUserName] = useState<string>('Paciente');
  // 1. Añadimos un estado para guardar el ID del paciente una vez que Supabase nos lo dé
  const [userId, setUserId] = useState<string>('');

  // 2. Le pasamos el userId a la consulta, pero usamos 'skip' para bloquear la petición
  // de red hasta que userId deje de estar vacío.
  const { data: reservas = [], isLoading, isError } = useObtenerMisReservasQuery(userId, {
    skip: !userId
  });
  
  const [cancelarReserva] = useCancelarReservaMutation();

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // 3. Cuando Supabase responde, guardamos el ID. 
        // Esto causará un re-render y RTK Query soltará el freno y hará el fetch.
        setUserId(user.id);
        
        if (user.user_metadata?.full_name) {
          setUserName(user.user_metadata.full_name);
        }
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
    isLoading, // Mostrará 'true' automáticamente cuando RTK Query esté haciendo la petición real
    isError,
    handleCancelar,
    handleCerrarSesion
  };
};