import { useState, useEffect, useMemo } from 'react';
import { supabase } from '../config/supabaseClient';
import { useObtenerMisReservasQuery, useCancelarReservaMutation } from '../services/reservasApi';

export const usePortalPacienteVM = () => {
  const [userName, setUserName] = useState<string>('Paciente');
  const [userId, setUserId] = useState<string>('');

  // 1. Hook de consulta de RTK Query
  const { 
    data, 
    isLoading, 
    isError, 
    refetch 
  } = useObtenerMisReservasQuery(userId, {
    skip: !userId, // Evita llamadas innecesarias si no hay ID
    refetchOnMountOrArgChange: true // Asegura datos frescos al volver a la pantalla
  });

  // 2. PROTECCIÓN CRÍTICA: Aseguramos que 'reservas' sea SIEMPRE un arreglo.
  // Usamos useMemo para que esta transformación solo ocurra cuando 'data' cambie.
  const reservas = useMemo(() => {
    if (!data) return [];
    return Array.isArray(data) ? data : [];
  }, [data]);

  const [cancelarReserva] = useCancelarReservaMutation();

  // 3. Gestión de sesión y metadatos del usuario
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        
        if (error) throw error;

        if (user) {
          setUserId(user.id);
          const name = user.user_metadata?.full_name || 'Paciente';
          setUserName(name);
        }
      } catch (err) {
        console.error("Error al recuperar sesión de usuario:", err);
      }
    };
    fetchUser();
  }, []);

  // 4. Lógica de negocio: Cancelación
  const handleCancelar = async (id: string) => {
    const confirmacion = window.confirm(
      '¿Deseas cancelar esta reserva? Liberaremos el cupo para otros pacientes.'
    );

    if (confirmacion) {
      try {
        await cancelarReserva(id).unwrap();
        // Opcional: Podrías disparar un mensaje de éxito aquí
      } catch (err) {
        console.error("Error al cancelar la reserva:", err);
        alert("No se pudo cancelar la reserva. Por favor, intenta más tarde.");
      }
    }
  };

  const handleCerrarSesion = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  return {
    userName,
    reservas, // Garantizado como Array, evita el error .length
    isLoading,
    isError,
    handleCancelar,
    handleCerrarSesion,
    refetch // Permitimos a la vista forzar una actualización si es necesario
  };
};