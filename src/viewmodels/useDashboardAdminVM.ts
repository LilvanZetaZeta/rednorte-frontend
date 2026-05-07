import { useGetUsuariosStaffQuery, useUpdateUsuarioRolMutation } from '../services/usuariosApi';
import { useAuthVM } from './useAuthVM';

export const useDashboardAdminVM = () => {
  const { session } = useAuthVM();
  const userRole = (session?.user?.user_metadata?.rol || 'paciente').toUpperCase();
  const isDirector = userRole === 'DIRECTOR';

  const { data: staff, isLoading, isError, refetch } = useGetUsuariosStaffQuery();
  const [updateRol, { isLoading: isUpdating }] = useUpdateUsuarioRolMutation();

  const handleUpdateRol = async (id: number, nuevoRol: string) => {
    if (!isDirector) return { success: false, error: 'No tienes permisos para realizar esta acción' };
    
    try {
      await updateRol({ id, rol: nuevoRol }).unwrap();
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.data?.error || 'Error al actualizar el rol' };
    }
  };

  return {
    staff,
    isLoading,
    isError,
    isUpdating,
    isDirector,
    handleUpdateRol,
    refetch
  };
};
