import { apiGateway } from './apiGateway';
import type { ICentroMedico } from '../models/types';

export const centroMedicoApi = apiGateway.injectEndpoints({
  endpoints: (builder) => ({
    obtenerCentrosMedicos: builder.query<ICentroMedico[], void>({ query: () => '/centros', providesTags: ['CentrosMedicos'] }),
  }),
});
export const { useObtenerCentrosMedicosQuery } = centroMedicoApi;