import { useState, useMemo, useCallback } from 'react';
import { useActualizarEstadoReservaMutation, useCancelarReservaMutation } from '../../services/reservasApi';
import type { IReserva } from '../../models/types';

export const useAgendaDiaria = (reservas: IReserva[] | undefined) => {
  const [rutBusqueda, setRutBusqueda] = useState('');
  
  const [actualizarEstado] = useActualizarEstadoReservaMutation();
  const [cancelarReservaBackend] = useCancelarReservaMutation();

  const reservasHoy = useMemo(() => {
    if (!reservas) return [];
    const hoy = new Date().toISOString().split('T')[0];
    return reservas
      .filter(r => r.fechaHora.startsWith(hoy))
      .sort((a, b) => a.fechaHora.localeCompare(b.fechaHora)); 
  }, [reservas]);

  const llegadasPendientes = useMemo(() => {
    return reservasHoy.filter(r => r.estado === 'VIGENTE');
  }, [reservasHoy]);

  const stats = useMemo(() => [
    { label: 'Citas Hoy', value: reservasHoy.length, sub: 'programadas' },
    { label: 'Pendientes Check-in', value: llegadasPendientes.length, sub: 'requieren acción' },
    { label: 'Citas Atendidas', value: reservasHoy.filter(r => r.estado === 'FINALIZADA' || r.estado === 'CONFIRMADA').length, sub: 'hoy' },
    { label: 'Canceladas', value: reservasHoy.filter(r => r.estado === 'CANCELADA' || r.estado === 'PENDIENTE_CANCELACION_ADMIN').length, sub: 'hoy' }
  ], [reservasHoy, llegadasPendientes]);

  // ✅ useCallback: Evita recrear funciones en cada render
  const handleCheckIn = useCallback(async () => {
    if (!rutBusqueda) return { success: false, error: "Ingrese un RUT para procesar" };
    const reserva = llegadasPendientes.find(r => r.paciente.rut === rutBusqueda);
    if (!reserva) return { success: false, error: "El paciente no tiene citas vigentes programadas para hoy." };

    try {
      await actualizarEstado({ id: reserva.id, estado: 'CONFIRMADA' }).unwrap();
      setRutBusqueda('');
      return { success: true, message: `Check-in exitoso. Paciente ${reserva.paciente.nombreCompleto} confirmado.` };
    } catch (error) {
      return { success: false, error: "Error al confirmar la cita." };
    }
  }, [rutBusqueda, llegadasPendientes, actualizarEstado]);

  const handleCancelarCita = useCallback(async (reservaId: number) => {
    try {
      await cancelarReservaBackend(reservaId).unwrap();
      return { success: true, message: "Operación de cancelación procesada exitosamente." };
    } catch (error: any) {
      return { success: false, error: error?.data?.error || "Error al procesar la cancelación." };
    }
  }, [cancelarReservaBackend]);

  const handleMarcarInasistencia = useCallback(async (id: number) => {
    try {
      await actualizarEstado({ id, estado: 'NO_ASISTE' }).unwrap();
      return { success: true, message: "Inasistencia registrada correctamente." };
    } catch (error) {
      return { success: false, error: "Error al actualizar la cita." };
    }
  }, [actualizarEstado]);

  return {
    rutBusqueda,
    setRutBusqueda,
    reservasHoy,
    llegadasPendientes,
    stats,
    handleCheckIn,
    handleCancelarCita,
    handleMarcarInasistencia
  };
};