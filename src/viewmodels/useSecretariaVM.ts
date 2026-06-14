import { useMemo } from 'react';
import { useGetDashboardSecretariaQuery } from '../services/metricasApi';
import { useObtenerReservasPorCentroQuery } from '../services/reservasApi';
import { useMedicosPorCentro } from '../hooks/useMedicosPorCentro';


import { useAgendaDiaria } from './secretaria/useAgendaDiaria';
import { useAgendamientoCita } from './secretaria/useAgendamientoCita';
import { useBloqueoAgenda } from './secretaria/useBloqueoAgenda';

export const useSecretariaVM = () => {

  const centroId = 1;

  const { data: metricasDashboard, isLoading: loadingMetricas } = useGetDashboardSecretariaQuery({ centroId });
  
  const { data: reservasPage, isLoading: loadingReservas } = useObtenerReservasPorCentroQuery({ centroId, page: 0, size: 50 });
 
  const reservas = reservasPage?.content ?? [];
  
 
  const medicosDelCentro = useMedicosPorCentro(centroId);


  const stats = useMemo(() => [
    { label: 'Citas Hoy', value: metricasDashboard?.totalReservasHoy ?? 0, sub: `${metricasDashboard?.citasConfirmadas ?? 0} confirmadas` },
    { label: 'Pendientes Check-in', value: metricasDashboard?.pendientesCheckin ?? 0, sub: 'Por llegar' },
    { label: 'Médicos', value: metricasDashboard?.totalMedicosCentro ?? 0, sub: 'En el centro' },
    { label: 'Canceladas Hoy', value: metricasDashboard?.citasCanceladasHoy ?? 0, sub: 'Reasignadas' },
  ], [metricasDashboard]);

  const { stats: _statsAgenda, ...restAgendaDiaria } = useAgendaDiaria(reservas);
  const agendamientoCita = useAgendamientoCita();
  const bloqueoAgenda = useBloqueoAgenda();

  return {
    isLoading: loadingMetricas || loadingReservas,
    centroId,
    medicosDelCentro,
    stats,
    ...restAgendaDiaria,
    ...agendamientoCita,
    ...bloqueoAgenda
  };
};
