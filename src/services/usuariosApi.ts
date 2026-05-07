import { apiGateway } from './apiGateway';

export const usuariosApi = apiGateway.injectEndpoints({
  endpoints: (builder) => ({
    asignarMedico: builder.mutation<any, { correo: string }>({
      query: (body) => ({
        url: '/usuarios/asignar-medico',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Usuarios'],
    }),
    getUsuariosStaff: builder.query<any[], void>({
      query: () => '/usuarios/staff',
      providesTags: ['Usuarios'],
    }),
    updateUsuarioRol: builder.mutation<void, { id: number; rol: string }>({
      query: ({ id, rol }) => ({
        url: `/usuarios/${id}/rol`,
        method: 'PATCH',
        body: { rol },
      }),
      invalidatesTags: ['Usuarios'],
    }),
    updateUsuarioCentro: builder.mutation<void, { id: number; centroId: number | null }>({
      query: ({ id, centroId }) => ({
        url: `/usuarios/${id}/centro`,
        method: 'PATCH',
        body: { centroId },
      }),
      invalidatesTags: ['Usuarios'],
    }),
  }),
});

export const { 
  useAsignarMedicoMutation, 
  useGetUsuariosStaffQuery, 
  useUpdateUsuarioRolMutation,
  useUpdateUsuarioCentroMutation
} = usuariosApi;
