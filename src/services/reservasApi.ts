import { apiGateway } from './apiGateway';
import type { IReserva, CrearReservaPayload } from '../models/types';

export const reservasApi = apiGateway.injectEndpoints({
  endpoints: (builder) => ({
    obtenerMisReservas: builder.query<IReserva[], string>({
      query: (idAuth) => `/portal/reservas/paciente/${idAuth}`,
      providesTags: ['Reservas'],
    }),
    obtenerReservasPorCentro: builder.query<IReserva[], number>({
      query: (centroId) => `/portal/reservas/centro/${centroId}`,
      providesTags: ['Reservas'],
    }),
    obtenerReservasPorMedico: builder.query<IReserva[], string>({
      query: (idAuth) => `/portal/reservas/medico/${idAuth}`,
      providesTags: ['Reservas'],
    }),
    crearReserva: builder.mutation<IReserva, CrearReservaPayload>({
      query: (body) => ({ 
        url: '/gestion/reservas', 
        method: 'POST', 
        body 
      }),
      invalidatesTags: ['Reservas'],
    }),
    cancelarReserva: builder.mutation<void, number>({
      query: (id) => ({ 
        url: `/gestion/reservas/${id}/cancelar`, 
        method: 'PUT' 
      }),
      invalidatesTags: ['Reservas'],
    }),
    actualizarEstadoReserva: builder.mutation<void, { id: number, estado: string }>({
      query: ({ id, estado }) => ({ 
        url: `/gestion/reservas/${id}`,
        method: 'PATCH',
        body: { estado }
      }),
      invalidatesTags: ['Reservas'],
    }),
    bloquearAgendaMedico: builder.mutation<void, { medicoId: number, fechaBloqueo: string }>({
      query: (body) => ({ 
        url: '/gestion/reservas/reasignaciones/agenda/bloquear', 
        method: 'POST', 
        body 
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
  useActualizarEstadoReservaMutation,
  useBloquearAgendaMedicoMutation
} = reservasApi;