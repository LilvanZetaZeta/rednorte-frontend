import { apiGateway } from './apiGateway';
import type { DashboardResumen, CentroMetrica } from '../models/types';

export const metricasApi = apiGateway.injectEndpoints({
  endpoints: (builder) => ({
    getResumen: builder.query<DashboardResumen, void>({ 
      query: () => '/portal/metricas/resumen' 
    }),
    getMetricasPorCentro: builder.query<CentroMetrica[], void>({ 
      query: () => '/portal/metricas/centros' 
    }),
  }),
});

export const { useGetResumenQuery, useGetMetricasPorCentroQuery } = metricasApi;