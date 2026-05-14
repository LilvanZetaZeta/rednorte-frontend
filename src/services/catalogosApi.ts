import { apiGateway } from './apiGateway';
import type { IEspecialidad, IUsuario } from '../models/types';

export const catalogosApi = apiGateway.injectEndpoints({
  endpoints: (builder) => ({
    getEspecialidades: builder.query<IEspecialidad[], void>({ query: () => '/especialidades', providesTags: ['Especialidades'] }),
    crearEspecialidad: builder.mutation<IEspecialidad, Partial<IEspecialidad>>({
      query: (nueva) => ({
        url: '/especialidades',
        method: 'POST',
        body: nueva,
      }),
      invalidatesTags: ['Especialidades'],
    }),
    actualizarEspecialidad: builder.mutation<IEspecialidad, { id: number, data: Partial<IEspecialidad> }>({
      query: ({ id, data }) => ({
        url: `/especialidades/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Especialidades'],
    }),
    eliminarEspecialidad: builder.mutation<void, number>({
      query: (id) => ({
        url: `/especialidades/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Especialidades'],
    }),
    buscarMedicosPorEspecialidad: builder.query<IUsuario[], { especialidad?: string, centroId?: number, especialidadId?: number }>({
      query: ({ especialidad, centroId, especialidadId }) => {
        let url = '/usuarios/medicos/buscar?';
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