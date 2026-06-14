import { useObtenerCentrosMedicosQuery } from '../services/centrosMedicosApi';

export const useCentrosMedicos = () => {
  const { data: centros = [], isLoading, isError } = useObtenerCentrosMedicosQuery();
  return { centros, isLoading, error: isError ? 'Error al cargar centros médicos' : null };
};