import { apiGateway } from './apiGateway';
import type { IUsuario } from '../models/types';

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
    asignarAdmin: builder.mutation<any, { correo: string }>({
      query: (body) => ({
        url: '/usuarios/asignar-admin',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Usuarios'],
    }),
    getUsuariosStaff: builder.query<IUsuario[], void>({
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
    updateUsuarioEspecialidades: builder.mutation<void, { id: number; especialidadIds: number[] }>({
      query: ({ id, especialidadIds }) => ({
        url: `/usuarios/${id}/especialidades`,
        method: 'PATCH',
        body: especialidadIds,
      }),
      invalidatesTags: ['Usuarios'],
    }),
    getAdminsDisponibles: builder.query<IUsuario[], void>({
      query: () => '/usuarios/admins-disponibles',
      providesTags: ['Usuarios'],
    }),
  }),
});

export const { 
  useAsignarMedicoMutation,
  useAsignarAdminMutation,
  useGetUsuariosStaffQuery, 
  useUpdateUsuarioRolMutation,
  useUpdateUsuarioCentroMutation,
  useUpdateUsuarioEspecialidadesMutation,
  useGetAdminsDisponiblesQuery
} = usuariosApi;

