import { useState } from 'react';
import { useAuthVM } from './useAuthVM';
import { useObtenerReservasPorMedicoQuery, useActualizarEstadoReservaMutation } from '../services/reservasApi';
import type { IReserva } from '../models/types';

export const usePortalDoctorVM = () => {
  const { session } = useAuthVM();
  const idAuth = session?.user?.id || '';
  const doctorName = session?.user?.user_metadata?.nombre_completo || 'Doctor';

  const { data: reservas, isLoading } = useObtenerReservasPorMedicoQuery(idAuth, { skip: !idAuth });
  const [actualizarEstado, { isLoading: isUpdating }] = useActualizarEstadoReservaMutation();

  const [pacienteActivo, setPacienteActivo] = useState<IReserva | null>(null);

  const agendaHoy = reservas?.filter(r => r.estado !== 'CANCELADA' && r.estado !== 'ATENDIDO') || [];

  const handleLlamarPaciente = (reserva: IReserva) => {
    setPacienteActivo(reserva);
  };

  const handleFinalizarAtencion = async (id: number) => {
     try {
       await actualizarEstado({ id, estado: 'ATENDIDO' }).unwrap();
       setPacienteActivo(null);
       return { success: true, message: 'Atención clínica finalizada con éxito.' };
     } catch (error) {
       return { success: false, error: 'Error al actualizar el estado de la reserva.' };
     }
  };

  return { 
    doctorName, agendaHoy, isLoading, isUpdating, 
    pacienteActivo, setPacienteActivo, handleLlamarPaciente, handleFinalizarAtencion 
  };
};