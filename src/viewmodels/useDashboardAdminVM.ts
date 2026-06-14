import { useGetUsuariosStaffQuery, useUpdateUsuarioRolMutation, useUpdateUsuarioCentroMutation, useUpdateUsuarioEspecialidadesMutation } from '../services/usuariosApi';
import { useGetCentrosQuery } from '../services/centrosMedicosApi';
import { useGetEspecialidadesQuery } from '../services/catalogosApi';
import { supabase } from '../config/supabaseClient';
import { useState, useEffect } from 'react';

export const useDashboardAdminVM = () => {
  const { data: staff, isLoading, isError } = useGetUsuariosStaffQuery();
  const { data: centros } = useGetCentrosQuery();
  const { data: especialidades } = useGetEspecialidadesQuery();
  const [updateRol] = useUpdateUsuarioRolMutation();
  const [updateCentro] = useUpdateUsuarioCentroMutation();
  const [updateEspecialidades] = useUpdateUsuarioEspecialidadesMutation();
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

  const handleUpdateEspecialidades = async (id: number, especialidadIds: number[]) => {
    setIsUpdating(true);
    try {
      await updateEspecialidades({ id, especialidadIds }).unwrap();
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Error al actualizar especialidades' };
    } finally {
      setIsUpdating(false);
    }
  };

  return { 
    staff, 
    centros, 
    especialidades,
    isLoading, 
    isError, 
    isDirector, 
    handleUpdateRol, 
    handleUpdateCentro, 
    handleUpdateEspecialidades,
    isUpdating 
  };
};
