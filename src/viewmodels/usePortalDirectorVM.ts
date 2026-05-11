import { useGetResumenQuery, useGetMetricasPorCentroQuery } from '../services/metricasApi';
import { useAsignarMedicoMutation } from '../services/usuariosApi';
import { useLayoutVM } from './useLayoutVM';

export const usePortalDirectorVM = () => {
  const { userName } = useLayoutVM();
  const { data: resumen, isLoading: loadR, isError: errR, refetch: refetchResumen } = useGetResumenQuery();
  const { data: centros, isLoading: loadC, isError: errC } = useGetMetricasPorCentroQuery();
  
  const [asignarMedico, { isLoading: isAssigning }] = useAsignarMedicoMutation();

  const handleAsignarMedico = async (correo: string) => {
    try {
      await asignarMedico({ correo }).unwrap();
      refetchResumen();
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.data?.error || 'Error al asignar médico' };
    }
  };

  return { 
    userName, 
    resumen, 
    centros, 
    isLoading: loadR || loadC, 
    isError: errR || errC,
    handleAsignarMedico,
    isAssigning
  };
};