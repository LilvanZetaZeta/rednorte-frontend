import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetEspecialidadesQuery, useLazyBuscarMedicosPorEspecialidadQuery } from '../services/catalogosApi';
import { useObtenerCentrosMedicosQuery } from '../services/centroMedicoService';
import { useCrearReservaMutation } from '../services/reservasApi';

export const useReservasVM = () => {
  const navigate = useNavigate();
  const [paso, setPaso] = useState(1);
  const [espSelec, setEspSelec] = useState<any>(null);
  const [medicoSelec, setMedicoSelec] = useState<any>(null);
  const [centroSelec, setCentroSelec] = useState<any>(null);
  const [fechaHora, setFechaHora] = useState('');

  const { data: especialidades, isLoading: loadEsp } = useGetEspecialidadesQuery();
  const [buscarMedicos, { data: medicos, isLoading: loadMed }] = useLazyBuscarMedicosPorEspecialidadQuery();
  const { data: centros, isLoading: loadC } = useObtenerCentrosMedicosQuery();
  const [crear, { isLoading: isSubmitting }] = useCrearReservaMutation();

  useEffect(() => { if (espSelec) buscarMedicos(espSelec.nombre); }, [espSelec]);

  const confirmarReserva = async () => {
    try {
      await crear({ medicoId: medicoSelec.id, centroId: centroSelec.id, fechaHora, origen: 'WEB' }).unwrap();
      navigate('/portal');
    } catch { alert('Error al crear reserva'); }
  };

  return { paso, setPaso, especialidades, loadEsp, espSelec, setEspSelec, setMedicoSelec, medicos, loadMed, medicoSelec, centros, loadC, centroSelec, setCentroSelec, fechaHora, setFechaHora, confirmarReserva, isSubmitting };
};