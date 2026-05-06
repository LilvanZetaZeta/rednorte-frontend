import { apiGateway } from './apiGateway';

export interface DashboardResumen {
  totalReservas: number;
  reservasVigentes: number;
  reservasCanceladas: number;
  totalPacientes: number;
  totalMedicos: number;
  totalCentros: number;
}

export interface CentroMetrica {
  nombreCentro: string;
  cantidadReservas: number;
}

export const metricasApi = apiGateway.injectEndpoints({
  endpoints: (builder) => ({
    getResumen: builder.query<DashboardResumen, void>({
      query: () => '/gestion/metricas/resumen',
    }),
    getMetricasPorCentro: builder.query<CentroMetrica[], void>({
      query: () => '/gestion/metricas/centros',
    }),
  }),
});

export const { useGetResumenQuery, useGetMetricasPorCentroQuery } = metricasApi;
