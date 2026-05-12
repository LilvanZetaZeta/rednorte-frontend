import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLazyBuscarMedicosPorEspecialidadQuery } from '../services/catalogosApi';
import { useGetCentrosQuery, useLazyGetEspecialidadesPorCentroQuery } from '../services/centrosMedicosApi';
import { useCrearReservaMutation } from '../services/reservasApi';

export const useReservasVM = () => {
  const navigate = useNavigate();
  
  // Estados de selección
  const [centroSelec, setCentroSelec] = useState<any>(null);
  const [espSelec, setEspSelec] = useState<any>(null);
  const [medicoSelec, setMedicoSelec] = useState<any>(null);
  const [fechaHora, setFechaHora] = useState('');

  // Consultas
  const { data: centros, isLoading: loadC } = useGetCentrosQuery();
  const [getEspecialidades, { data: especialidades, isLoading: loadEsp }] = useLazyGetEspecialidadesPorCentroQuery();
  const [buscarMedicos, { data: medicos, isLoading: loadMed }] = useLazyBuscarMedicosPorEspecialidadQuery();
  const [crear, { isLoading: isSubmitting }] = useCrearReservaMutation();

  // Efectos para carga en cascada
  useEffect(() => {
    if (centroSelec) {
      getEspecialidades(centroSelec.id);
      setEspSelec(null);
      setMedicoSelec(null);
    }
  }, [centroSelec, getEspecialidades]);

  useEffect(() => {
    if (centroSelec && espSelec) {
      buscarMedicos({ centroId: centroSelec.id, especialidadId: espSelec.id });
      setMedicoSelec(null);
    }
  }, [espSelec, centroSelec, buscarMedicos]);

  const confirmarReserva = async () => {
    try {
      await crear({ 
        medicoId: medicoSelec.id, 
        centroId: centroSelec.id, 
        fechaHora, 
        origen: 'WEB' 
      }).unwrap();
      navigate('/portal');
    } catch { 
      alert('Error al crear reserva'); 
    }
  };

  return { 
    centros, loadC, centroSelec, setCentroSelec,
    especialidades, loadEsp, espSelec, setEspSelec, 
    medicos, loadMed, medicoSelec, setMedicoSelec,
    fechaHora, setFechaHora, 
    confirmarReserva, isSubmitting 
  };
};