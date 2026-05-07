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
  }),
});

export const { useAsignarMedicoMutation } = usuariosApi;
