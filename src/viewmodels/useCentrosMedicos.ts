import { useObtenerCentrosMedicosQuery } from '../services/centroMedicoService';

export const useCentrosMedicos = () => {
  const { data: centros = [], isLoading, isError } = useObtenerCentrosMedicosQuery();

  const error = isError ? 'Error al cargar centros médicos' : null;

  return { centros, isLoading, error };
};