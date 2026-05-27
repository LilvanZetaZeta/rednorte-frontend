import { apiGateway } from './apiGateway';
import type { IEspecialidad, IUsuario } from '../models/types';

export const catalogosApi = apiGateway.injectEndpoints({
  endpoints: (builder) => ({
    getEspecialidades: builder.query<IEspecialidad[], void>({ 
      query: () => '/portal/especialidades', 
      providesTags: ['Especialidades'] 
    }),
    crearEspecialidad: builder.mutation<IEspecialidad, Partial<IEspecialidad>>({
      query: (nueva) => ({
        url: '/gestion/especialidades',
        method: 'POST',
        body: nueva,
      }),
      invalidatesTags: ['Especialidades'],
    }),
    actualizarEspecialidad: builder.mutation<IEspecialidad, { id: number, data: Partial<IEspecialidad> }>({
      query: ({ id, data }) => ({
        url: `/gestion/especialidades/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Especialidades'],
    }),
    eliminarEspecialidad: builder.mutation<void, number>({
      query: (id) => ({
        url: `/gestion/especialidades/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Especialidades'],
    }),
    buscarMedicosPorEspecialidad: builder.query<IUsuario[], { especialidad?: string, centroId?: number, especialidadId?: number }>({
      query: ({ especialidad, centroId, especialidadId }) => {
        let url = '/portal/usuarios/medicos/buscar?';
        if (centroId && especialidadId) {
          url += `centroId=${centroId}&especialidadId=${especialidadId}`;
        } else if (especialidad) {
          url += `especialidad=${encodeURIComponent(especialidad)}`;
        }
        return url;
      },
      providesTags: ['Usuarios'],
    }),
  }),
});

export const { 
  useGetEspecialidadesQuery, 
  useLazyBuscarMedicosPorEspecialidadQuery,
  useCrearEspecialidadMutation,
  useActualizarEspecialidadMutation,
  useEliminarEspecialidadMutation
} = catalogosApi;