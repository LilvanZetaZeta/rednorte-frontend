import { useMemo } from 'react';
import { useGetResumenQuery } from '../services/metricasApi';
import { useObtenerReservasPorCentroQuery } from '../services/reservasApi';
import { useGetUsuariosStaffQuery } from '../services/usuariosApi';
import type { IUsuario } from '../models/types';

import { useAgendaDiaria } from './secretaria/useAgendaDiaria';
import { useAgendamientoCita } from './secretaria/useAgendamientoCita';
import { useBloqueoAgenda } from './secretaria/useBloqueoAgenda';

export const useSecretariaVM = () => {
  // TODO: Obtener del contexto de autenticación real
  const centroId = 1; 

  const { isLoading: loadingMetricas } = useGetResumenQuery();
  const { data: reservas, isLoading: loadingReservas } = useObtenerReservasPorCentroQuery(centroId);
  const { data: usuarios } = useGetUsuariosStaffQuery();

  // Filtrado de Médicos solo de este centro
  const medicosDelCentro = useMemo<IUsuario[]>(() => {
    if (!usuarios) return [];
    return usuarios.filter(u => u.rol === 'MEDICO' && u.centroMedico?.id === centroId);
  }, [usuarios, centroId]);

  // Instanciamos los hooks especializados
  const agendaDiaria = useAgendaDiaria(reservas);
  const agendamientoCita = useAgendamientoCita(centroId, reservas, medicosDelCentro);
  const bloqueoAgenda = useBloqueoAgenda();

  return {
    isLoading: loadingMetricas || loadingReservas,
    medicosDelCentro,
    
    // Spread de las propiedades para mantener el contrato con la Vista intacto
    ...agendaDiaria,
    ...agendamientoCita,
    ...bloqueoAgenda
  };
};