import { apiGateway } from './apiGateway';
import type { ICentroMedico } from '../models/ICentroMedico';

export const centroMedicoApi = apiGateway.injectEndpoints({
  endpoints: (builder) => ({
    obtenerCentrosMedicos: builder.query<ICentroMedico[], void>({
      query: () => '/centros-medicos',
      providesTags: ['CentrosMedicos'],
    }),
  }),
});

export const { useObtenerCentrosMedicosQuery } = centroMedicoApi;