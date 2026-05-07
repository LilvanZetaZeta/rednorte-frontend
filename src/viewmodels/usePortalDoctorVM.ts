import { useState } from 'react';
import { useAuthVM } from './useAuthVM';
import { useObtenerReservasPorMedicoQuery, useActualizarEstadoReservaMutation } from '../services/reservasApi';

export const usePortalDoctorVM = () => {
  const { session } = useAuthVM();
  const idAuth = session?.user?.id || '';
  const doctorName = session?.user?.user_metadata?.nombre_completo || 'Doctor';

  // Traemos la agenda del médico usando su ID de Supabase
  const { data: reservas, isLoading } = useObtenerReservasPorMedicoQuery(idAuth, { skip: !idAuth });
  const [actualizarEstado, { isLoading: isUpdating }] = useActualizarEstadoReservaMutation();

  const [pacienteActivo, setPacienteActivo] = useState<any>(null);

  // Filtramos para mostrar solo las citas que requieren atención (Vigentes o en Sala de Espera)
  const agendaHoy = reservas?.filter(r => r.estado !== 'CANCELADA' && r.estado !== 'ATENDIDO') || [];

  const handleLlamarPaciente = (reserva: any) => {
    setPacienteActivo(reserva);
  };

  const handleFinalizarAtencion = async (id: number) => {
    if(window.confirm('¿Confirmar que la atención clínica ha finalizado? Esto actualizará la ficha del paciente.')) {
       try {
         await actualizarEstado({ id, estado: 'ATENDIDO' }).unwrap();
         setPacienteActivo(null); // Cerramos la ficha
         alert('Atención finalizada con éxito.');
       } catch (error) {
         alert('Error al actualizar el estado de la reserva. Revisa la consola o los permisos del Gateway.');
       }
    }
  };

  return { 
    doctorName, agendaHoy, isLoading, isUpdating, 
    pacienteActivo, setPacienteActivo, handleLlamarPaciente, handleFinalizarAtencion 
  };
};