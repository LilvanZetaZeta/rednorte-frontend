import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetEspecialidadesQuery, useLazyBuscarMedicosPorEspecialidadQuery } from '../services/catalogosApi';
import { useGetCentrosQuery } from '../services/centrosMedicosApi';
import { useCrearReservaMutation, useLazyObtenerSlotsDisponiblesQuery } from '../services/reservasApi';
import { useAuthVM } from './useAuthVM';
import { useObtenerMiPerfilQuery } from '../services/perfilPacienteApi';
import type { ICentroMedico, IEspecialidad, IUsuario } from '../models/types';

export const useReservasVM = () => {
  const navigate = useNavigate();
  const { session } = useAuthVM();

  const { data: perfil } = useObtenerMiPerfilQuery(session?.user?.id || '', {
    skip: !session?.user?.id,
  });

  const [centroSelec, setCentroSelec] = useState<ICentroMedico | null>(null);
  const [espSelec, setEspSelec] = useState<IEspecialidad | null>(null);
  const [medicoSelec, setMedicoSelec] = useState<IUsuario | null>(null);
  const [fechaSelec, setFechaSelec] = useState('');      // 'YYYY-MM-DD'
  const [slotSelec, setSlotSelec] = useState('');        // ISO datetime completo
  const [error, setError] = useState<string | null>(null);

  const { data: centros, isLoading: loadC } = useGetCentrosQuery();
  const { data: especialidades, isLoading: loadEsp } = useGetEspecialidadesQuery();
  const [buscarMedicos, { data: medicos, isLoading: loadMed }] =
    useLazyBuscarMedicosPorEspecialidadQuery();
  const [fetchSlots, { data: slots, isLoading: loadSlots }] =
    useLazyObtenerSlotsDisponiblesQuery();
  const [crear, { isLoading: isSubmitting }] = useCrearReservaMutation();

  useEffect(() => {
    if (espSelec) {
      buscarMedicos({ especialidad: espSelec.nombre });
      setMedicoSelec(null);
      setFechaSelec('');
      setSlotSelec('');
      setError(null);
    }
  }, [espSelec, buscarMedicos]);

  // Cuando cambia médico o fecha, pedir los slots disponibles
  useEffect(() => {
    if (medicoSelec && fechaSelec) {
      setSlotSelec('');
      fetchSlots({ medicoId: medicoSelec.id, fecha: fechaSelec });
    }
  }, [medicoSelec, fechaSelec, fetchSlots]);

  const confirmarReserva = async () => {
    setError(null);

    if (!perfil) {
      setError('Debes tener un perfil completo para reservar. Por favor completa tus datos en el portal.');
      return;
    }
    if (!centroSelec || !medicoSelec || !fechaSelec || !slotSelec) {
      setError('Por favor completa todos los campos.');
      return;
    }

    try {
      await crear({
        pacienteId: perfil.pacienteId,
        medicoId: medicoSelec.id,
        centroId: centroSelec.id,
        fechaHora: slotSelec,
        tipoReserva: 'CONSULTA_MEDICA',
        origen: 'WEB',
      }).unwrap();
      navigate('/portal');
    } catch (err: any) {
      const msg = err.data?.error || 'Error al crear reserva. Inténtalo de nuevo.';
      setError(msg);
    }
  };

  const hoy = new Date().toISOString().split('T')[0];

  return {
    centros, loadC, centroSelec, setCentroSelec,
    especialidades, loadEsp, espSelec, setEspSelec,
    medicos, loadMed, medicoSelec, setMedicoSelec,
    fechaSelec, setFechaSelec,
    slots, loadSlots, slotSelec, setSlotSelec,
    confirmarReserva, isSubmitting,
    error, setError,
    hoy,
  };
};