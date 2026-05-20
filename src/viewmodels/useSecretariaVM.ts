import { useState, useMemo } from 'react';
import { useGetResumenQuery } from '../services/metricasApi';
import { 
  useObtenerReservasPorCentroQuery, 
  useActualizarEstadoReservaMutation,
  useCrearReservaMutation,
  useCancelarReservaMutation,
  useBloquearAgendaMedicoMutation
} from '../services/reservasApi';
import { useGetUsuariosStaffQuery } from '../services/usuariosApi';
import type { IEspecialidad, IUsuario } from '../models/types';

export const useSecretariaVM = () => {
  const [rutBusqueda, setRutBusqueda] = useState('');
  const [esPacienteNuevo, setEsPacienteNuevo] = useState(false);
  
  // TODO: Obtener del contexto de autenticación real
  const centroId = 1; 

  const { isLoading: loadingMetricas } = useGetResumenQuery();
  const { data: reservas, isLoading: loadingReservas } = useObtenerReservasPorCentroQuery(centroId);
  const { data: usuarios } = useGetUsuariosStaffQuery();
  
  const [actualizarEstado] = useActualizarEstadoReservaMutation();
  const [cancelarReservaBackend] = useCancelarReservaMutation();
  const [crearReserva] = useCrearReservaMutation();
  const [bloquearAgenda] = useBloquearAgendaMedicoMutation();

  const [showModalNuevaCita, setShowModalNuevaCita] = useState(false);
  const [formData, setFormData] = useState({
    rut: '', nombre: '', correo: '', medicoId: '', fechaHora: ''
  });
  const [rutVerificado, setRutVerificado] = useState(false);
  const [pacienteExiste, setPacienteExiste] = useState<boolean | null>(null);
  const [validacionRutError, setValidacionRutError] = useState('');
  const [filtroEspecialidadId, setFiltroEspecialidadId] = useState<number | ''>('');
  const [fechaSeleccionada, setFechaSeleccionada] = useState('');

  const [showModalBloqueo, setShowModalBloqueo] = useState(false);
  const [bloqueoData, setBloqueoData] = useState({ medicoId: '', fecha: '' });

  // Lógica de filtrado de Médicos solo de este centro
  const medicosDelCentro = useMemo<IUsuario[]>(() => {
    if (!usuarios) return [];
    return usuarios.filter(u => u.rol === 'MEDICO' && u.centroMedico?.id === centroId);
  }, [usuarios, centroId]);

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

  const stats = [
    { label: 'Citas Hoy', value: reservasHoy.length, icon: 'calendar_today', sub: 'programadas' },
    { label: 'Pendientes Check-in', value: llegadasPendientes.length, icon: 'hourglass_empty', sub: 'requieren acción' },
    { label: 'Citas Atendidas', value: reservasHoy.filter(r => r.estado === 'FINALIZADA' || r.estado === 'CONFIRMADA').length, icon: 'check_circle', sub: 'hoy' },
    { label: 'Canceladas', value: reservasHoy.filter(r => r.estado === 'CANCELADA' || r.estado === 'PENDIENTE_CANCELACION_ADMIN').length, icon: 'cancel', sub: 'hoy' }
  ];

  // Formateador de RUT (puntos y guion)
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
      setFormData((prev) => ({
        ...prev,
        nombre: reservaExistente.paciente.nombreCompleto,
        correo: reservaExistente.paciente.correo || '',
      }));
    } else {
      setFormData((prev) => ({ ...prev, nombre: '', correo: '' }));
    }
  };

  const handleCheckIn = async () => {
    if (!rutBusqueda) return alert("Ingrese un RUT para procesar");
    const reserva = llegadasPendientes.find(r => r.paciente.rut === rutBusqueda);
    if (!reserva) return alert("El paciente no tiene citas vigentes programadas para hoy.");

    try {
      await actualizarEstado({ id: reserva.id, estado: 'CONFIRMADA' }).unwrap();
      alert(`Check-in exitoso. Paciente ${reserva.paciente.nombreCompleto} confirmado.`);
      setRutBusqueda('');
    } catch (error) {
      alert("Error al confirmar la cita.");
    }
  };

  const handleCancelarCita = async (reservaId: number) => {
    if(window.confirm("¿Desea cancelar esta cita? El sistema validará la regla de las 24 horas.")) {
      try {
        await cancelarReservaBackend(reservaId).unwrap();
        alert("Operación de cancelación procesada.");
      } catch (error: any) {
        alert(error?.data?.error || "Error al procesar la cancelación.");
      }
    }
  };

  const handleMarcarInasistencia = async (id: number) => {
    try {
      await actualizarEstado({ id, estado: 'NO_ASISTE' }).unwrap();
    } catch (error) {
      alert("Error al actualizar la cita.");
    }
  };

  const horasDisponibles = useMemo<string[]>(() => {
    const medicoId = Number(formData.medicoId);
    if (!medicoId || !fechaSeleccionada) return [];

    const hoy = new Date();
    const fechaSeleccionadaDate = new Date(`${fechaSeleccionada}T00:00:00`);
    if (Number.isNaN(fechaSeleccionadaDate.getTime())) return [];

    const isSameDay = (a: Date, b: Date) =>
      a.getFullYear() === b.getFullYear() &&
      a.getMonth() === b.getMonth() &&
      a.getDate() === b.getDate();

    const reservasDelMedico = reservas?.filter((r) => {
      const reservaFecha = new Date(r.fechaHora);
      return r.medico.id === medicoId && isSameDay(reservaFecha, fechaSeleccionadaDate);
    }) || [];

    const horasReservadas = new Set(
      reservasDelMedico.map((r) =>
        new Date(r.fechaHora).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      )
    );

    const slots: string[] = [];
    const horaInicio = 8;
    const horaFin = 18;
    for (let hora = horaInicio; hora < horaFin; hora += 1) {
      for (let minuto = 0; minuto < 60; minuto += 30) {
        const slot = new Date(`${fechaSeleccionada}T${hora.toString().padStart(2, '0')}:${minuto.toString().padStart(2, '0')}:00`);
        if (isSameDay(slot, hoy) && slot <= hoy) continue;
        const slotHora = slot.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        if (horasReservadas.has(slotHora)) continue;
        slots.push(`${fechaSeleccionada}T${hora.toString().padStart(2, '0')}:${minuto.toString().padStart(2, '0')}`);
      }
    }

    return slots;
  }, [formData.medicoId, fechaSeleccionada, reservas]);

  const handleCrearCitaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rutVerificado) {
      return alert('Valide el RUT antes de seleccionar médico y hora.');
    }
    if (!formData.medicoId) {
      return alert('Seleccione un médico.');
    }
    if (!fechaSeleccionada) {
      return alert('Seleccione la fecha de la cita.');
    }
    if (!formData.fechaHora) {
      return alert('Elija una hora disponible.');
    }
    if (pacienteExiste === false && (!formData.nombre || !formData.correo)) {
      return alert('Complete el nombre y correo del paciente nuevo.');
    }

    try {
      await crearReserva({
        pacienteRut: formData.rut,
        pacienteNombreCompleto: formData.nombre || undefined,
        pacienteCorreo: formData.correo || undefined,
        medicoId: Number(formData.medicoId),
        centroId: centroId,
        fechaHora: formData.fechaHora,
        origen: 'PRESENCIAL'
      }).unwrap();

      alert('Cita registrada correctamente.');
      setShowModalNuevaCita(false);
      handleResetNuevaCita();
    } catch (error: any) {
      alert(error?.data?.error || 'Error al crear la reserva.');
    }
  };

  const handleBloqueoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await bloquearAgenda({
        medicoId: Number(bloqueoData.medicoId),
        fechaBloqueo: bloqueoData.fecha
      }).unwrap();
      
      alert("Agenda bloqueada y proceso de reasignación iniciado.");
      setShowModalBloqueo(false);
      setBloqueoData({ medicoId: '', fecha: '' });
    } catch (error: any) {
      alert("Error al levantar la contingencia: " + (error?.data?.error || "Error desconocido"));
    }
  };

  return {
    stats,
    isLoading: loadingMetricas || loadingReservas,
    rutBusqueda, setRutBusqueda,
    handleCheckIn,
    reservasHoy, llegadasPendientes,
    handleCancelarCita, handleMarcarInasistencia,
    showModalNuevaCita, setShowModalNuevaCita, openModalNuevaCita,
    formData, setFormData, handleCrearCitaSubmit,
    rutVerificado, pacienteExiste, validacionRutError, handleValidarRutPaciente,
    filtroEspecialidadId, setFiltroEspecialidadId,
    fechaSeleccionada, setFechaSeleccionada,
    horasDisponibles, especialidadesDisponibles, doctoresFiltrados,
    showModalBloqueo, setShowModalBloqueo,
    bloqueoData, setBloqueoData, handleBloqueoSubmit,
    medicosDelCentro,
    formatearRut,
    esPacienteNuevo,
    setEsPacienteNuevo
  };
};