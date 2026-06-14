import { apiGateway } from './apiGateway';
import type { IReserva, CrearReservaPayload, IHistorialCita } from '../models/types';

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

export const reservasApi = apiGateway.injectEndpoints({
  endpoints: (builder) => ({
    obtenerMisReservas: builder.query<IReserva[], string>({
      query: (idAuth) => `/portal/reservas/paciente/${idAuth}`,
      providesTags: ['Reservas'],
    }),
    obtenerReservasPorCentro: builder.query<PageResponse<IReserva>, { centroId: number; page?: number; size?: number }>({
      query: ({ centroId, page = 0, size = 20 }) => 
        `/portal/reservas/centro/${centroId}?page=${page}&size=${size}`,
      providesTags: ['Reservas'],
    }),
    obtenerReservasPorMedico: builder.query<PageResponse<IReserva>, { medicoId: number; page?: number; size?: number }>({
      query: ({ medicoId, page = 0, size = 20 }) => 
        `/portal/reservas/medico/${medicoId}?page=${page}&size=${size}`,
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
    guardarEvolucionClinica: builder.mutation<void, { reservaId: number; evolucion: string; medicoId: number; pacienteId: number; procedimiento?: string }>({
      query: (body) => ({
        url: '/gestion/historial-citas',
        method: 'POST',
        body: {
          pacienteId: body.pacienteId,
          medicoId: body.medicoId,
          observaciones: body.evolucion,
          procedimientoRealizado: body.procedimiento || null,
          reservaId: body.reservaId,
        },
      }),
      invalidatesTags: ['Reservas'],
    }),
    obtenerHistorialPorReserva: builder.query<IHistorialCita, number>({
      query: (reservaId) => `/portal/historial-citas/reserva/${reservaId}`,
      providesTags: ['Reservas'],
    }),
    obtenerHistorialPorPaciente: builder.query<IHistorialCita[], number>({
      query: (pacienteId) => `/portal/historial-citas/paciente/${pacienteId}`,
      providesTags: ['Reservas'],
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
  useBloquearAgendaMedicoMutation,
  useGuardarEvolucionClinicaMutation,
  useObtenerHistorialPorReservaQuery,
  useObtenerHistorialPorPacienteQuery,
  useLazyObtenerHistorialPorPacienteQuery
} = reservasApi;
