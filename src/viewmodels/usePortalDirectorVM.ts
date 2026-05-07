import { useGetResumenQuery, useGetMetricasPorCentroQuery } from '../services/metricasApi';
import { useLayoutVM } from './useLayoutVM';

export const usePortalDirectorVM = () => {
  const { userName } = useLayoutVM();
  const { data: resumen, isLoading: loadR, isError: errR } = useGetResumenQuery();
  const { data: centros, isLoading: loadC, isError: errC } = useGetMetricasPorCentroQuery();
  return { userName, resumen, centros, isLoading: loadR || loadC, isError: errR || errC };
};