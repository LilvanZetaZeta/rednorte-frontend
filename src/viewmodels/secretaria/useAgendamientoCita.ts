import { useState, useMemo } from 'react';
import { useCrearReservaMutation } from '../../services/reservasApi';
import type { IReserva, IUsuario, IEspecialidad } from '../../models/types';

export const useAgendamientoCita = (centroId: number, reservas: IReserva[] | undefined, medicosDelCentro: IUsuario[]) => {
  const [crearReserva] = useCrearReservaMutation();

  const [showModalNuevaCita, setShowModalNuevaCita] = useState(false);
  const [formData, setFormData] = useState({ rut: '', nombre: '', correo: '', medicoId: '', fechaHora: '' });
  const [rutVerificado, setRutVerificado] = useState(false);
  const [pacienteExiste, setPacienteExiste] = useState<boolean | null>(null);
  const [esPacienteNuevo, setEsPacienteNuevo] = useState(false);
  const [validacionRutError, setValidacionRutError] = useState('');
  const [filtroEspecialidadId, setFiltroEspecialidadId] = useState<number | ''>('');
  const [fechaSeleccionada, setFechaSeleccionada] = useState('');

  const especialidadesDisponibles = useMemo<IEspecialidad[]>(() => {
    const map = new Map<number, string>();
    medicosDelCentro.forEach((medico) => {
      medico.especialidades?.forEach((esp) => map.set(esp.id, esp.nombre));
    });
    return Array.from(map.entries()).map(([id, nombre]) => ({ id, nombre }));
  }, [medicosDelCentro]);

  const doctoresFiltrados = useMemo<IUsuario[]>(() => {
    if (!filtroEspecialidadId) return medicosDelCentro;
    return medicosDelCentro.filter((medico) => medico.especialidades?.some((esp) => esp.id === filtroEspecialidadId));
  }, [medicosDelCentro, filtroEspecialidadId]);

  const horasDisponibles = useMemo<string[]>(() => {
    const medicoId = Number(formData.medicoId);
    if (!medicoId || !fechaSeleccionada) return [];

    const hoy = new Date();
    const fechaSeleccionadaDate = new Date(`${fechaSeleccionada}T00:00:00`);
    if (Number.isNaN(fechaSeleccionadaDate.getTime())) return [];

    const isSameDay = (a: Date, b: Date) =>
      a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

    const reservasDelMedico = reservas?.filter((r) => {
      return r.medico.id === medicoId && isSameDay(new Date(r.fechaHora), fechaSeleccionadaDate);
    }) || [];

    const horasReservadas = new Set(
      reservasDelMedico.map((r) => new Date(r.fechaHora).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }))
    );

    const slots: string[] = [];
    for (let hora = 8; hora < 18; hora++) {
      for (let minuto = 0; minuto < 60; minuto += 30) {
        const slot = new Date(`${fechaSeleccionada}T${hora.toString().padStart(2, '0')}:${minuto.toString().padStart(2, '0')}:00`);
        if (isSameDay(slot, hoy) && slot <= hoy) continue;
        
        const slotHora = slot.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        if (!horasReservadas.has(slotHora)) {
          slots.push(`${fechaSeleccionada}T${hora.toString().padStart(2, '0')}:${minuto.toString().padStart(2, '0')}`);
        }
      }
    }
    return slots;
  }, [formData.medicoId, fechaSeleccionada, reservas]);

  const formatearRut = (rut: string) => {
    let valor = rut.replace(/[^0-9kK]/g, '');
    if (valor.length > 1) {
      const cuerpo = valor.slice(0, -1);
      const dv = valor.slice(-1);
      return `${cuerpo.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}-${dv.toUpperCase()}`;
    }
    return valor;
  };

  const handleResetNuevaCita = () => {
    setFormData({ rut: '', nombre: '', correo: '', medicoId: '', fechaHora: '' });
    setRutVerificado(false);
    setPacienteExiste(null);
    setValidacionRutError('');
    setFiltroEspecialidadId('');
    setFechaSeleccionada('');
  };

  const openModalNuevaCita = () => {
    handleResetNuevaCita();
    setShowModalNuevaCita(true);
  };

  const handleValidarRutPaciente = () => {
    if (!formData.rut.trim()) {
      setValidacionRutError('Ingrese un RUT válido');
      return;
    }
    const reservaExistente = reservas?.find((r) => r.paciente.rut === formData.rut.trim());
    const existe = Boolean(reservaExistente);
    setPacienteExiste(existe);
    setEsPacienteNuevo(!existe);
    setRutVerificado(true);
    setValidacionRutError('');

    if (reservaExistente) {
      setFormData(prev => ({ ...prev, nombre: reservaExistente.paciente.nombreCompleto, correo: reservaExistente.paciente.correo || '' }));
    } else {
      setFormData(prev => ({ ...prev, nombre: '', correo: '' }));
    }
  };

  const handleCrearCitaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rutVerificado) return { success: false, error: 'Valide el RUT antes de seleccionar médico y hora.' };
    if (!formData.medicoId || !fechaSeleccionada || !formData.fechaHora) return { success: false, error: 'Complete los datos de la cita.' };
    if (pacienteExiste === false && (!formData.nombre || !formData.correo)) return { success: false, error: 'Complete los datos del paciente nuevo.' };

    try {
      await crearReserva({
        pacienteRut: formData.rut,
        pacienteNombreCompleto: formData.nombre || undefined,
        pacienteCorreo: formData.correo || undefined,
        medicoId: Number(formData.medicoId),
        centroId,
        fechaHora: formData.fechaHora,
        origen: 'PRESENCIAL'
      }).unwrap();

      setShowModalNuevaCita(false);
      handleResetNuevaCita();
      return { success: true, message: 'Cita registrada correctamente.' };
    } catch (error: any) {
      return { success: false, error: error?.data?.error || 'Error al crear la reserva.' };
    }
  };

  return {
    showModalNuevaCita, setShowModalNuevaCita, openModalNuevaCita,
    formData, setFormData, handleCrearCitaSubmit,
    rutVerificado, pacienteExiste, validacionRutError, handleValidarRutPaciente,
    filtroEspecialidadId, setFiltroEspecialidadId,
    fechaSeleccionada, setFechaSeleccionada,
    horasDisponibles, especialidadesDisponibles, doctoresFiltrados,
    formatearRut, esPacienteNuevo, setEsPacienteNuevo
  };
};