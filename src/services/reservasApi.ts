import { apiGateway } from './apiGateway';
import type { IReserva } from '../models/Ireserva';

export const reservasApi = apiGateway.injectEndpoints({
  endpoints: (builder) => ({
    obtenerMisReservas: builder.query<IReserva[], string>({
  query: (pacienteId) => `/reservas/paciente/${pacienteId}`,
  providesTags: ['Reservas'],
}),
    cancelarReserva: builder.mutation<void, string>({
      query: (id) => ({
        url: `/reservas/${id}/cancelar`,
        method: 'POST',
      }),
      invalidatesTags: ['Reservas'], 
    }),
  }),
});

export const { useObtenerMisReservasQuery, useCancelarReservaMutation } = reservasApi;