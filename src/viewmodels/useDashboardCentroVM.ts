import { useGetResumenQuery } from '../services/metricasApi';
import { useObtenerReservasPorCentroQuery } from '../services/reservasApi';

export const useDashboardCentroVM = () => {
  // Asumimos que este administrador está asignado al Centro ID: 1 (Podrías hacerlo dinámico leyendo su perfil)
  const miCentroId = 1; 

  const { data: resumen, isLoading: loadingMetricas } = useGetResumenQuery();
  const { data: agendaCentro, isLoading: loadingAgenda } = useObtenerReservasPorCentroQuery(miCentroId);

  // Calculamos métricas exclusivas de este centro basadas en sus reservas reales
  const reservasCanceladas = agendaCentro?.filter(r => r.estado === 'CANCELADA').length || 0;
  const reservasAtendidas = agendaCentro?.filter(r => r.estado === 'ATENDIDO').length || 0;
  const pacientesTotales = agendaCentro?.length || 0;

  return {
    miCentroId,
    resumenGlobal: resumen,
    agendaCentro,
    metricasLocales: { pacientesTotales, reservasCanceladas, reservasAtendidas },
    isLoading: loadingMetricas || loadingAgenda
  };
};