import { apiGateway } from './apiGateway';
import type { DashboardResumen, CentroMetrica } from '../models/types';

export const metricasApi = apiGateway.injectEndpoints({
  endpoints: (builder) => ({
    getResumen: builder.query<DashboardResumen, void>({ query: () => '/gestion/metricas/resumen' }),
    getMetricasPorCentro: builder.query<CentroMetrica[], void>({ query: () => '/gestion/metricas/centros' }),
  }),
});
export const { useGetResumenQuery, useGetMetricasPorCentroQuery } = metricasApi;