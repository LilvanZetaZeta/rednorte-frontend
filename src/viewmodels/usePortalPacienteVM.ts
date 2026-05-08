import { useState, useEffect } from 'react';
import { supabase } from '../config/supabaseClient';
import { useObtenerMisReservasQuery, useCancelarReservaMutation } from '../services/reservasApi';
import { 
  useObtenerMiPerfilQuery, 
  useCrearPerfilMutation,
  useActualizarPerfilMutation 
} from '../services/perfilPacienteApi';

export const usePortalPacienteVM = () => {
  const [userName, setUserName] = useState('Paciente');
  const [userId, setUserId] = useState('');
  const [userRut, setUserRut] = useState('');
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUserId(session.user.id);
        setUserName(session.user.user_metadata?.nombre_completo || 'Paciente');
        setUserRut(session.user.user_metadata?.rut || '');
        setUserEmail(session.user.email || '');
      }
    });
  }, []);

  const { data: reservas = [], isLoading: loadingReservas } = 
    useObtenerMisReservasQuery(userId, { skip: !userId });

  const { data: perfil, isLoading: loadingPerfil } = 
    useObtenerMiPerfilQuery(userId, { skip: !userId });

  const [cancelar] = useCancelarReservaMutation();
  const [crearPerfil] = useCrearPerfilMutation();
  const [actualizarPerfil] = useActualizarPerfilMutation();

  const handleCancelar = async (id: number) => {
    if (window.confirm('¿Cancelar esta reserva?')) {
      try { await cancelar(id).unwrap(); } catch { alert('Error al cancelar.'); }
    }
  };

  const handleGuardarPerfil = async (data: { prevision: string; telefonoContacto: string }) => {
    try {
      if (perfil) {
        await actualizarPerfil({ id: perfil.id, data }).unwrap();
      } else {
        await crearPerfil(data).unwrap();
      }
      return { success: true };
    } catch {
      return { success: false };
    }
  };

  return {
    userName,
    userRut,
    userEmail,
    userId,
    reservas,
    perfil,          // prevision + telefonoContacto desde ms-portal
    isLoading: loadingReservas || loadingPerfil,
    handleCancelar,
    handleGuardarPerfil,
  };
};