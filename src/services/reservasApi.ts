import { apiGateway } from './apiGateway';
import type { IReserva, CrearReservaPayload } from '../models/types';

// ✅ Interfaz para respuesta paginada
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
    // ✅ PAGINACIÓN: Ahora acepta parámetros de paginación
    obtenerReservasPorCentro: builder.query<PageResponse<IReserva>, { centroId: number; page?: number; size?: number }>({
      query: ({ centroId, page = 0, size = 20 }) => 
        `/portal/reservas/centro/${centroId}?page=${page}&size=${size}`,
      providesTags: ['Reservas'],
    }),
    // ✅ PAGINACIÓN: Ahora acepta parámetros de paginación
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
    // Persiste la evolución clínica del paciente (anamnesis, diagnóstico, tratamiento)
    // en el historial de citas antes de marcar la reserva como ATENDIDA.
    guardarEvolucionClinica: builder.mutation<void, { reservaId: number; evolucion: string; medicoId: number; pacienteId: number }>({
      query: (body) => ({
        url: '/gestion/historial-citas',
        method: 'POST',
        body: {
          reservaId: body.reservaId,
          evolucionClinica: body.evolucion,
          medicoId: body.medicoId,
          pacienteId: body.pacienteId,
          fechaRegistro: new Date().toISOString(),
        },
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
  useBloquearAgendaMedicoMutation,
  useGuardarEvolucionClinicaMutation
} = reservasApi;
