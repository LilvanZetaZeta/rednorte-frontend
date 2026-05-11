import { apiGateway } from './apiGateway';
import type { IEspecialidad, IUsuario } from '../models/types';

export const catalogosApi = apiGateway.injectEndpoints({
  endpoints: (builder) => ({
    getEspecialidades: builder.query<IEspecialidad[], void>({ query: () => '/especialidades', providesTags: ['Especialidades'] }),
    buscarMedicosPorEspecialidad: builder.query<IUsuario[], string>({
      query: (esp) => `/usuarios/medicos/buscar?especialidad=${encodeURIComponent(esp)}`,
      providesTags: ['Usuarios'],
    }),
  }),
});
export const { useGetEspecialidadesQuery, useLazyBuscarMedicosPorEspecialidadQuery } = catalogosApi;