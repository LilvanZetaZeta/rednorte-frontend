import { useGetResumenQuery, useGetMetricasPorCentroQuery } from '../services/metricasApi';
import { useAsignarAdminMutation } from '../services/usuariosApi';
import { useLayoutVM } from './useLayoutVM';

export const usePortalDirectorVM = () => {
  const { userName } = useLayoutVM();
  const { data: resumen, isLoading: loadR, isError: errR, refetch: refetchResumen } = useGetResumenQuery();
  const { data: centros, isLoading: loadC, isError: errC } = useGetMetricasPorCentroQuery();
  
  const [asignarAdmin, { isLoading: isAssigning }] = useAsignarAdminMutation();

  const handleAsignarAdmin = async (correo: string) => {
    try {
      await asignarAdmin({ correo }).unwrap();
      refetchResumen();
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.data?.error || 'Error al asignar administrador' };
    }
  };

  return { 
    userName, 
    resumen, 
    centros, 
    isLoading: loadR || loadC, 
    isError: errR || errC,
    handleAsignarAdmin,
    isAssigning
  };
};