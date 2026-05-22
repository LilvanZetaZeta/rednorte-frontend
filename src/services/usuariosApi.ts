import { apiGateway } from './apiGateway';
import type { IUsuario } from '../models/types';
 
export const usuariosApi = apiGateway.injectEndpoints({
  endpoints: (builder) => ({
 
    getTodosUsuarios: builder.query<IUsuario[], void>({
      query: () => '/usuarios/todos',
      providesTags: ['Usuarios'],
    }),
 
    getUsuariosStaff: builder.query<IUsuario[], void>({
      query: () => '/usuarios/staff',
      providesTags: ['Usuarios'],
    }),
 
    getAdminsDisponibles: builder.query<IUsuario[], void>({
      query: () => '/usuarios/admins-disponibles',
      providesTags: ['Usuarios'],
    }),
 
    getUsuarioPorIdAuth: builder.query<IUsuario, string>({
      query: (idAuth) => `/usuarios/auth/${idAuth}`,
      providesTags: ['Usuarios'],
    }),
 
    asignarMedico: builder.mutation<any, { correo: string }>({
      query: (body) => ({ url: '/usuarios/asignar-medico', method: 'POST', body }),
      invalidatesTags: ['Usuarios'],
    }),
 
    asignarAdmin: builder.mutation<any, { correo: string }>({
      query: (body) => ({ url: '/usuarios/asignar-admin', method: 'POST', body }),
      invalidatesTags: ['Usuarios'],
    }),
 
    patchUsuario: builder.mutation<IUsuario, { id: number; nombreCompleto?: string; correo?: string }>({
      query: ({ id, ...body }) => ({ url: `/usuarios/${id}`, method: 'PATCH', body }),
      invalidatesTags: ['Usuarios'],
    }),
 
    eliminarUsuario: builder.mutation<void, number>({
      query: (id) => ({ url: `/usuarios/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Usuarios'],
    }),
 
    updateUsuarioRol: builder.mutation<void, { id: number; rol: string }>({
      query: ({ id, rol }) => ({ url: `/usuarios/${id}/rol`, method: 'PATCH', body: { rol } }),
      invalidatesTags: ['Usuarios'],
    }),
 
    updateUsuarioCentro: builder.mutation<void, { id: number; centroId: number | null }>({
      query: ({ id, centroId }) => ({ url: `/usuarios/${id}/centro`, method: 'PATCH', body: { centroId } }),
      invalidatesTags: ['Usuarios'],
    }),
 
    updateUsuarioEspecialidades: builder.mutation<void, { id: number; especialidadIds: number[] }>({
      query: ({ id, especialidadIds }) => ({ url: `/usuarios/${id}/especialidades`, method: 'PATCH', body: especialidadIds }),
      invalidatesTags: ['Usuarios'],
    }),
  }),
});
 
export const {
  useGetTodosUsuariosQuery,
  useGetUsuariosStaffQuery,
  useGetAdminsDisponiblesQuery,
  useGetUsuarioPorIdAuthQuery,
  useAsignarMedicoMutation,
  useAsignarAdminMutation,
  usePatchUsuarioMutation,
  useEliminarUsuarioMutation,
  useUpdateUsuarioRolMutation,
  useUpdateUsuarioCentroMutation,
  useUpdateUsuarioEspecialidadesMutation,
} = usuariosApi;