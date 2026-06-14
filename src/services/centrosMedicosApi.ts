import { apiGateway } from './apiGateway';
import type { ICentroMedico } from '../models/types';

export const centrosMedicosApi = apiGateway.injectEndpoints({
  endpoints: (builder) => ({
    obtenerCentrosMedicos: builder.query<ICentroMedico[], void>({
      query: () => '/portal/centros-medicos',
      providesTags: ['CentrosMedicos'],
    }),
    getCentros: builder.query<ICentroMedico[], void>({
      query: () => '/portal/centros-medicos',
      providesTags: ['CentrosMedicos'],
    }),
    createCentro: builder.mutation<ICentroMedico, Partial<ICentroMedico>>({
      query: (body) => ({
        url: '/gestion/centros-medicos',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['CentrosMedicos'],
    }),
    updateCentro: builder.mutation<ICentroMedico, { id: number; data: Partial<ICentroMedico> }>({
      query: ({ id, data }) => ({
        url: `/gestion/centros-medicos/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['CentrosMedicos'],
    }),
    deleteCentro: builder.mutation<void, number>({
      query: (id) => ({
        url: `/gestion/centros-medicos/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['CentrosMedicos'],
    }),
    getEspecialidadesPorCentro: builder.query<any[], number>({
      query: (id) => `/portal/centros-medicos/${id}/especialidades`,
      providesTags: ['Especialidades'],
    }),
  }),
});

export const {
  useObtenerCentrosMedicosQuery,
  useGetCentrosQuery,
  useCreateCentroMutation,
  useUpdateCentroMutation,
  useDeleteCentroMutation,
  useGetEspecialidadesPorCentroQuery,
  useLazyGetEspecialidadesPorCentroQuery,
} = centrosMedicosApi;