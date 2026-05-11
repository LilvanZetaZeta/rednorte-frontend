import { apiGateway } from './apiGateway';

export interface PerfilPaciente {
  id: number;
  pacienteId: number;
  prevision: string | null;
  telefonoContacto: string | null;
}

export const perfilPacienteApi = apiGateway.injectEndpoints({
  endpoints: (builder) => ({
    obtenerMiPerfil: builder.query<PerfilPaciente, string>({
      query: (idAuth) => `/perfil-pacientes/auth/${idAuth}`,
      providesTags: ['Pacientes'],
    }),
    crearPerfil: builder.mutation<PerfilPaciente, Partial<PerfilPaciente>>({
      query: (body) => ({ url: '/perfil-pacientes', method: 'POST', body }),
      invalidatesTags: ['Pacientes'],
    }),
    actualizarPerfil: builder.mutation<PerfilPaciente, { id: number; data: Partial<PerfilPaciente> }>({
      query: ({ id, data }) => ({ url: `/perfil-pacientes/${id}`, method: 'PUT', body: data }),
      invalidatesTags: ['Pacientes'],
    }),
  }),
});

export const { 
  useObtenerMiPerfilQuery,
  useCrearPerfilMutation,
  useActualizarPerfilMutation
} = perfilPacienteApi;