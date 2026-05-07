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
    updateUsuarioRol: builder.mutation<any, { id: number, rol: string }>({
      query: ({ id, rol }) => ({
        url: `/usuarios/${id}/rol`,
        method: 'PATCH',
        body: { rol },
      }),
      invalidatesTags: ['Usuarios'],
    }),
  }),
});

export const { 
  useAsignarMedicoMutation, 
  useGetUsuariosStaffQuery, 
  useUpdateUsuarioRolMutation 
} = usuariosApi;
