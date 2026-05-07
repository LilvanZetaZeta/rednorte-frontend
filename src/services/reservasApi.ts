import { apiGateway } from './apiGateway';
import type { IReserva } from '../models/types';

export const reservasApi = apiGateway.injectEndpoints({
  endpoints: (builder) => ({
    obtenerMisReservas: builder.query<IReserva[], string>({
      query: (idAuth) => `/reservas/paciente/${idAuth}`,
      providesTags: ['Reservas'],
    }),
    crearReserva: builder.mutation<IReserva, any>({
      query: (body) => ({ url: '/reservas', method: 'POST', body }),
      invalidatesTags: ['Reservas'],
    }),
    cancelarReserva: builder.mutation<void, number>({
      query: (id) => ({ url: `/reservas/${id}/cancelar`, method: 'PUT' }),
      invalidatesTags: ['Reservas'],
    }),
  }),
});
export const { useObtenerMisReservasQuery, useCrearReservaMutation, useCancelarReservaMutation } = reservasApi;