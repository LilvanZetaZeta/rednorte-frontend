import { useGetResumenQuery, useGetMetricasPorCentroQuery } from '../services/metricasApi';
import { useLayoutVM } from './useLayoutVM';

export const usePortalDirectorVM = () => {
  const { userName } = useLayoutVM();
  
  const { 
    data: resumen, 
    isLoading: isLoadingResumen, 
    isError: isErrorResumen 
  } = useGetResumenQuery();

  const { 
    data: centros, 
    isLoading: isLoadingCentros, 
    isError: isErrorCentros 
  } = useGetMetricasPorCentroQuery();

  const isLoading = isLoadingResumen || isLoadingCentros;
  const isError = isErrorResumen || isErrorCentros;

  return {
    userName,
    resumen,
    centros,
    isLoading,
    isError
  };
};
