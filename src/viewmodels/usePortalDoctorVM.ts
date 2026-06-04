import { useState, useEffect } from 'react';
import { useAuthVM } from './useAuthVM';
import {
  useObtenerReservasPorMedicoQuery,
  useActualizarEstadoReservaMutation,
  useGuardarEvolucionClinicaMutation,
} from '../services/reservasApi';
import type { IReserva } from '../models/types';

export const usePortalDoctorVM = () => {
  const { session } = useAuthVM();
  const idAuth = session?.user?.id || '';
  const doctorName = session?.user?.user_metadata?.nombre_completo || 'Doctor';
  // El id del médico puede venir como metadato del usuario en Supabase o
  // resolverse a partir de su perfil. Si no está, las mutaciones abortan.
  const medicoIdRaw = session?.user?.user_metadata?.medicoId as number | string | undefined;
  const medicoId =
    typeof medicoIdRaw === 'number'
      ? medicoIdRaw
      : typeof medicoIdRaw === 'string' && medicoIdRaw.trim() !== ''
      ? Number(medicoIdRaw)
      : null;

  // El endpoint /portal/reservas/medico/{medicoId} espera un Long numérico
  // (no el UUID de Supabase). Si no tenemos un medicoId numérico, omitimos
  // la consulta para evitar 404/400.
  const { data: reservasPage, isLoading } = useObtenerReservasPorMedicoQuery(
    { medicoId: medicoId ?? 0 },
    { skip: medicoId === null }
  );
  const reservas = reservasPage?.content ?? [];

  const [actualizarEstado, { isLoading: isUpdating }] = useActualizarEstadoReservaMutation();
  const [guardarEvolucion, { isLoading: isSavingEvolucion }] = useGuardarEvolucionClinicaMutation();

  const [pacienteActivo, setPacienteActivo] = useState<IReserva | null>(null);
  // Estado controlado del textarea de evolución clínica.
  // Se resetea cada vez que se selecciona un paciente distinto para evitar
  // pegar texto de la consulta anterior en una nueva ficha.
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

  /**
   * Persiste la evolución clínica en el historial del paciente y luego
   * marca la reserva como ATENDIDA. Si la evolución está vacía, aborta
   * la operación con un mensaje claro para evitar fichas clínicas vacías.
   */
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
    isLoading,
    isUpdating: isUpdating || isSavingEvolucion,
    pacienteActivo,
    setPacienteActivo: handleCerrarFicha,
    evolucion,
    setEvolucion,
    handleLlamarPaciente,
    handleFinalizarAtencion,
  };
};
