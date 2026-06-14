import { useState, useEffect } from 'react';
import { useAuthVM } from './useAuthVM';
import {
  useObtenerReservasPorMedicoQuery,
  useActualizarEstadoReservaMutation,
  useGuardarEvolucionClinicaMutation,
} from '../services/reservasApi';
import { useGetUsuarioPorIdAuthQuery } from '../services/usuariosApi';
import type { IReserva } from '../models/types';

export const usePortalDoctorVM = () => {
  const { session } = useAuthVM();
  const doctorName = session?.user?.user_metadata?.nombre_completo || 'Doctor';
  
  // Obtener perfil del médico de la base de datos para recuperar su ID interno (medicoId)
  const { data: usuarioDb, isLoading: isLoadingUsuario } = useGetUsuarioPorIdAuthQuery(
    session?.user?.id || '',
    { skip: !session?.user?.id }
  );

  const medicoId = usuarioDb?.id || null;

  const { data: reservasPage, isLoading: isLoadingReservas } = useObtenerReservasPorMedicoQuery(
    { medicoId: medicoId ?? 0 },
    { skip: medicoId === null }
  );
  const reservas = reservasPage?.content ?? [];

  const [actualizarEstado, { isLoading: isUpdating }] = useActualizarEstadoReservaMutation();
  const [guardarEvolucion, { isLoading: isSavingEvolucion }] = useGuardarEvolucionClinicaMutation();

  const [pacienteActivo, setPacienteActivo] = useState<IReserva | null>(null);
  const [evolucion, setEvolucion] = useState('');

  useEffect(() => {
    setEvolucion('');
  }, [pacienteActivo?.id]);

  const agendaHoy = reservas.filter((r) => r.estado !== 'CANCELADA' && r.estado !== 'ATENDIDO');

  const handleLlamarPaciente = (reserva: IReserva) => {
    setPacienteActivo(reserva);
  };

  const handleCerrarFicha = () => {
    setPacienteActivo(null);
    setEvolucion('');
  };

  const handleFinalizarAtencion = async (id: number) => {
    if (!pacienteActivo || pacienteActivo.id !== id) {
      return { success: false, error: 'No hay un paciente activo seleccionado.' };
    }
    if (!evolucion.trim()) {
      return {
        success: false,
        error:
          'La evolución clínica es obligatoria. Por favor, registre la anamnesis, diagnóstico y tratamiento antes de finalizar la consulta.',
      };
    }
    if (medicoId === null || !pacienteActivo.paciente?.id) {
      return {
        success: false,
        error: 'No se pudo identificar al médico o al paciente. Verifique su sesión.',
      };
    }

    try {
      // 1) Persistir la evolución clínica ANTES de cerrar la cita.
      await guardarEvolucion({
        reservaId: id,
        evolucion: evolucion.trim(),
        medicoId,
        pacienteId: pacienteActivo.paciente.id,
        procedimiento: pacienteActivo.tipoReserva,
      }).unwrap();

      // 2) Marcar la reserva como ATENDIDA.
      await actualizarEstado({ id, estado: 'ATENDIDO' }).unwrap();

      setPacienteActivo(null);
      setEvolucion('');
      return { success: true, message: 'Atención clínica registrada y finalizada con éxito.' };
    } catch (error: any) {
      const msg =
        error?.data?.message ||
        error?.data?.error ||
        'Error al finalizar la atención. La evolución clínica no se guardó.';
      return { success: false, error: msg };
    }
  };

  return {
    doctorName,
    agendaHoy,
    isLoading: isLoadingUsuario || isLoadingReservas,
    isUpdating: isUpdating || isSavingEvolucion,
    pacienteActivo,
    setPacienteActivo: handleCerrarFicha,
    evolucion,
    setEvolucion,
    handleLlamarPaciente,
    handleFinalizarAtencion,
  };
};
