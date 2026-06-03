import { apiGateway } from './apiGateway';
import type { DashboardResumen, CentroMetrica, DashboardSecretaria } from '../models/types';

export const metricasApi = apiGateway.injectEndpoints({
  endpoints: (builder) => ({
    getResumen: builder.query<DashboardResumen, void>({ 
      query: () => '/portal/metricas/resumen' 
    }),
    getMetricasPorCentro: builder.query<CentroMetrica[], void>({ 
      query: () => '/portal/metricas/centros' 
    }),
    getDashboardSecretaria: builder.query<DashboardSecretaria, { centroId: number; fecha?: string }>({
      query: ({ centroId, fecha }) => {
        if (fecha) {
          return `/portal/metricas/centro/${centroId}/dashboard-secretaria?fecha=${fecha}`;
        }
        // Si no hay fecha, usa la ruta base sin parámetros (el backend usa hoy por defecto)
        return `/portal/metricas/centro/${centroId}/dashboard-secretaria`;
      },
    }),
  }),
});

export const { useGetResumenQuery, useGetMetricasPorCentroQuery, useGetDashboardSecretariaQuery } = metricasApi;
