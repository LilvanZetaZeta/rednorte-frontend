import { useAuthCentro } from './centro/useAuthCentro';
import { useGestionStaff } from './centro/useGestionStaff';
import { useEstadisticasCentro } from './centro/useEstadisticasCentro';

export const useDashboardCentroVM = () => {
  // 1. Obtenemos la sesión del administrador
  const authCentro = useAuthCentro();
  
  // 2. Pasamos el ID del centro a la gestión de personal
  const gestionStaff = useGestionStaff(authCentro.miCentroId);
  
  // 3. Pasamos el ID del centro y el personal filtrado a las estadísticas
  const estadisticas = useEstadisticasCentro(authCentro.miCentroId, gestionStaff.staffDelCentro);

  // 4. Retornamos la unión de todas las propiedades para la vista
  return {
    ...authCentro,
    ...gestionStaff,
    ...estadisticas,
    
    // Unificamos el estado de carga global
    isLoading: authCentro.loadingPerfil || gestionStaff.loadingS || estadisticas.loadingR,
  };
};