import { apiGateway } from './apiGateway';
import type { IReserva } from '../models/Ireserva';

export const reservasApi = apiGateway.injectEndpoints({
  endpoints: (builder) => ({
    obtenerMisReservas: builder.query<IReserva[], void>({
      query: () => '/reservas/mis-reservas',
      providesTags: ['Reservas'],
    }),
    cancelarReserva: builder.mutation<void, string>({
      query: (id) => ({
        url: `/reservas/${id}/cancelar`,
        method: 'POST',
      }),
      invalidatesTags: ['Reservas'], // Refresca la lista al cancelar
    }),
  }),
});

export const { useObtenerMisReservasQuery, useCancelarReservaMutation } = reservasApi;