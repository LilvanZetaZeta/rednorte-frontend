import { useMemo } from 'react';
import { useObtenerReservasPorCentroQuery } from '../../services/reservasApi';
import type { IUsuario } from '../../models/types';

export const useEstadisticasCentro = (miCentroId: number | null, staffDelCentro: IUsuario[]) => {
  const { data: reservas, isLoading: loadingR } = useObtenerReservasPorCentroQuery(miCentroId!, { skip: !miCentroId });

  const metricas = useMemo(() => ({
    totalReservas: reservas?.length ?? 0,
    vigentes:      reservas?.filter(r => r.estado === 'VIGENTE' || r.estado === 'CONFIRMADA').length ?? 0,
    medicos:       staffDelCentro.filter(u => u.rol === 'MEDICO').length,
    secretarias:   staffDelCentro.filter(u => u.rol === 'SECRETARIA').length,
  }), [reservas, staffDelCentro]);

  return { 
    metricas, 
    loadingR 
  };
};