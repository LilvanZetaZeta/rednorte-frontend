import { useGetUsuariosStaffQuery, useUpdateUsuarioRolMutation, useUpdateUsuarioCentroMutation } from '../services/usuariosApi';
import { useGetCentrosQuery } from '../services/centrosMedicosApi';
import { supabase } from '../config/supabaseClient';
import { useState, useEffect } from 'react';

export const useDashboardAdminVM = () => {
  const { data: staff, isLoading, isError } = useGetUsuariosStaffQuery();
  const { data: centros } = useGetCentrosQuery();
  const [updateRol] = useUpdateUsuarioRolMutation();
  const [updateCentro] = useUpdateUsuarioCentroMutation();
  const [isDirector, setIsDirector] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsDirector(session?.user?.user_metadata?.rol?.toUpperCase() === 'DIRECTOR');
    });
  }, []);

  const handleUpdateRol = async (id: number, rol: string) => {
    setIsUpdating(true);
    try {
      await updateRol({ id, rol }).unwrap();
      return { success: true };
    } catch (error) {
      return { success: false, error: 'No tienes permisos para realizar esta acción' };
    } finally {
      setIsUpdating(false);
    }
  };

  const handleUpdateCentro = async (id: number, centroId: number | null) => {
    setIsUpdating(true);
    try {
      await updateCentro({ id, centroId }).unwrap();
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Error al asignar centro médico' };
    } finally {
      setIsUpdating(false);
    }
  };

  return { staff, centros, isLoading, isError, isDirector, handleUpdateRol, handleUpdateCentro, isUpdating };
};
