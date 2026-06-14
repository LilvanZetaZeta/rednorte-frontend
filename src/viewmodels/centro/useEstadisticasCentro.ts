import { useMemo } from 'react';
import { useObtenerReservasPorCentroQuery } from '../../services/reservasApi';
import type { IUsuario } from '../../models/types';

export const useEstadisticasCentro = (miCentroId: number | null, staffDelCentro: IUsuario[]) => {
  const { data: reservas, isLoading: loadingR } = useObtenerReservasPorCentroQuery({ centroId: miCentroId! }, { skip: !miCentroId });

  const metricas = useMemo(() => ({
    totalReservas: reservas?.content?.length ?? 0,
    vigentes:      reservas?.content?.filter(r => r.estado === 'VIGENTE' || r.estado === 'CONFIRMADA').length ?? 0,
    medicos:       staffDelCentro.filter(u => u.rol === 'MEDICO').length,
    secretarias:   staffDelCentro.filter(u => u.rol === 'SECRETARIA').length,
  }), [reservas, staffDelCentro]);

  return { 
    metricas, 
    loadingR 
  };
};