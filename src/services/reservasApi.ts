import { apiGateway } from './apiGateway';
import type { IReserva } from '../models/types';

export const reservasApi = apiGateway.injectEndpoints({
  endpoints: (builder) => ({
    obtenerMisReservas: builder.query<IReserva[], string>({
      query: (idAuth) => `/reservas/paciente/${idAuth}`,
      providesTags: ['Reservas'],
    }),
    obtenerReservasPorCentro: builder.query<IReserva[], number>({
      query: (centroId) => `/reservas/centro/${centroId}`,
      providesTags: ['Reservas'],
    }),
    // NUEVO: Obtener la agenda del médico
    obtenerReservasPorMedico: builder.query<IReserva[], string>({
      query: (idAuth) => `/reservas/medico/${idAuth}`,
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
    // NUEVO: Cambiar el estado de la reserva (Ej: a ATENDIDO)
    actualizarEstadoReserva: builder.mutation<void, { id: number, estado: string }>({
      query: ({ id, estado }) => ({ 
        url: `/reservas/${id}/estado`, 
        method: 'PUT',
        params: { estado } // Asumiendo que el backend recibe un query param o ajustarlo a body si es necesario
      }),
      invalidatesTags: ['Reservas'],
    }),
  }),
});

export const { 
  useObtenerMisReservasQuery, 
  useObtenerReservasPorCentroQuery,
  useObtenerReservasPorMedicoQuery, 
  useCrearReservaMutation, 
  useCancelarReservaMutation,
  useActualizarEstadoReservaMutation
} = reservasApi;