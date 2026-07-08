import { useState, useEffect } from 'react';
import { supabase } from '../config/supabaseClient';
import { useObtenerMisReservasQuery, useCancelarReservaMutation } from '../services/reservasApi';
import { 
  useObtenerMiPerfilQuery, 
  useCrearPerfilMutation,
  useActualizarPerfilMutation 
} from '../services/perfilPacienteApi';
// 1. Importar los hooks de reasignación
import { useObtenerOfertasQuery, useResponderOfertaMutation } from '../services/reasignacionesApi';

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

  // 2. Consulta de ofertas pendientes atada al userId
  const { data: ofertas = [], isLoading: loadingOfertas } = 
    useObtenerOfertasQuery(userId, { skip: !userId });

  const [cancelar, { isLoading: isCanceling }] = useCancelarReservaMutation();
  const [crearPerfil, { isLoading: isCreatingPerfil }] = useCrearPerfilMutation();
  const [actualizarPerfil, { isLoading: isUpdatingPerfil }] = useActualizarPerfilMutation();
  
  // 3. Mutación para procesar la respuesta
  const [responderMutation, { isLoading: isProcesandoOferta }] = useResponderOfertaMutation();

  const handleCancelar = async (id: number) => {
    try { 
      await cancelar(id).unwrap(); 
      return { success: true };
    } catch (err: any) { 
      return { success: false, error: err?.data?.error || 'Error al cancelar la reserva.' }; 
    }
  };

  const handleGuardarPerfil = async (data: { prevision: string; telefonoContacto: string }) => {
    try {
      if (perfil) {
        await actualizarPerfil({ id: perfil.id, data }).unwrap();
      } else {
        await crearPerfil({ ...data, idAuth: userId }).unwrap();
      }
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.data?.error || 'Error al guardar el perfil' };
    }
  };

  // 4. Lógica de negocio para determinar la oferta a mostrar
  const ofertaPendiente = ofertas.length > 0 ? ofertas[0] : null;

  // 5. Manejador para la vista, usando el mismo patrón de retorno que tus otras funciones
  const handleResponderOferta = async (estado: 'ACEPTADA' | 'RECHAZADA') => {
    if (!ofertaPendiente) return { success: false, error: 'No hay oferta pendiente que responder.' };
    
    try {
      await responderMutation({ ofertaId: ofertaPendiente.id, estado }).unwrap();
      return { success: true };
    } catch (error: any) {
      console.error("Fallo al responder a la reasignación", error);
      return { success: false, error: error?.data?.error || 'Hubo un problema de red al procesar tu respuesta.' };
    }
  };

  return {
    userName, userRut, userEmail, userId, reservas, perfil,
    // CRÍTICO: Sumamos loadingOfertas para no renderizar la vista hasta que tengamos la respuesta del Gateway
    isLoading: loadingReservas || loadingPerfil || loadingOfertas,
    handleCancelar, handleGuardarPerfil,
    isCanceling,
    isGuardandoPerfil: isCreatingPerfil || isUpdatingPerfil,
    
    // 6. Exportamos las herramientas para la vista
    ofertaPendiente,
    handleResponderOferta,
    isProcesandoOferta
  };
};