import { apiGateway } from './apiGateway';

export interface CentroMedico {
  id?: number;
  nombreSucursal: string;
  region: string;
  comuna: string;
  direccion: string;
}

export const centrosMedicosApi = apiGateway.injectEndpoints({
  endpoints: (builder) => ({
    getCentros: builder.query<CentroMedico[], void>({
      query: () => '/centros-medicos',
      providesTags: ['CentrosMedicos'],
    }),
    createCentro: builder.mutation<CentroMedico, Partial<CentroMedico>>({
      query: (body) => ({
        url: '/centros-medicos',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['CentrosMedicos'],
    }),
    updateCentro: builder.mutation<CentroMedico, { id: number; data: Partial<CentroMedico> }>({
      query: ({ id, data }) => ({
        url: `/centros-medicos/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['CentrosMedicos'],
    }),
    deleteCentro: builder.mutation<void, number>({
      query: (id) => ({
        url: `/centros-medicos/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['CentrosMedicos'],
    }),
  }),
});

export const {
  useGetCentrosQuery,
  useCreateCentroMutation,
  useUpdateCentroMutation,
  useDeleteCentroMutation,
} = centrosMedicosApi;
