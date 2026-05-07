import { useState, useEffect } from 'react';
import { supabase } from '../config/supabaseClient';
import { useObtenerMisReservasQuery, useCancelarReservaMutation } from '../services/reservasApi';

export const usePortalPacienteVM = () => {
  const [userName, setUserName] = useState('Paciente');
  const [userId, setUserId] = useState('');
  
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUserId(session.user.id);
        setUserName(session.user.user_metadata?.nombre_completo);
      }
    });
  }, []);

  const { data: reservas = [], isLoading, isError } = useObtenerMisReservasQuery(userId, { skip: !userId });
  const [cancelar] = useCancelarReservaMutation();

  const handleCancelar = async (id: number) => {
    if (window.confirm('¿Cancelar esta reserva?')) {
      try { await cancelar(id).unwrap(); } catch { alert("Error al cancelar."); }
    }
  };

  return { userName, reservas, isLoading, isError, handleCancelar };
};