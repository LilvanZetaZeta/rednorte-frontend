import { useState, useEffect } from 'react';
import { supabase } from '../config/supabaseClient';
import { useGetResumenQuery } from '../services/metricasApi';
import { useObtenerReservasPorCentroQuery } from '../services/reservasApi';

export const useDashboardCentroVM = () => {
  const [miCentroId, setMiCentroId] = useState<number | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      const centroId = session?.user?.user_metadata?.centro_id;
      if (centroId) setMiCentroId(Number(centroId));
    });
  }, []);

  const { data: resumen, isLoading: loadingMetricas } = useGetResumenQuery();
  const { data: agendaCentro, isLoading: loadingAgenda } = useObtenerReservasPorCentroQuery(
    miCentroId!, 
    { skip: !miCentroId } 
  );

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