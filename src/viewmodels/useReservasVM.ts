import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetEspecialidadesQuery, useLazyBuscarMedicosPorEspecialidadQuery } from '../services/catalogosApi';
import { useGetCentrosQuery } from '../services/centrosMedicosApi';
import { useCrearReservaMutation } from '../services/reservasApi';
import { useAuthVM } from './useAuthVM';
import { useObtenerMiPerfilQuery } from '../services/perfilPacienteApi';

export const useReservasVM = () => {
  const navigate = useNavigate();
  const { session } = useAuthVM();
  
  // Perfil del paciente
  const { data: perfil } = useObtenerMiPerfilQuery(session?.user?.id || '', { skip: !session?.user?.id });
  
  // Estados de selección
  const [centroSelec, setCentroSelec] = useState<any>(null);
  const [espSelec, setEspSelec] = useState<any>(null);
  const [medicoSelec, setMedicoSelec] = useState<any>(null);
  const [fechaHora, setFechaHora] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Consultas
  const { data: centros, isLoading: loadC } = useGetCentrosQuery();
  const { data: especialidades, isLoading: loadEsp } = useGetEspecialidadesQuery();
  const [buscarMedicos, { data: medicos, isLoading: loadMed }] = useLazyBuscarMedicosPorEspecialidadQuery();
  const [crear, { isLoading: isSubmitting }] = useCrearReservaMutation();

  // Efecto para buscar médicos cuando se selecciona especialidad
  useEffect(() => {
    if (espSelec) {
      buscarMedicos(espSelec.nombre); // El servicio buscarMedicosPorEspecialidad espera el nombre de la especialidad
      setMedicoSelec(null);
      setError(null);
    }
  }, [espSelec, buscarMedicos]);

  const confirmarReserva = async () => {
    setError(null);
    if (!perfil) {
      setError('Debes tener un perfil completo para reservar. Por favor completa tus datos en el portal.');
      return;
    }

    if (!centroSelec || !medicoSelec || !fechaHora) {
      setError('Por favor completa todos los campos.');
      return;
    }

    try {
      await crear({ 
        pacienteId: perfil.pacienteId,
        medicoId: medicoSelec.id, 
        centroId: centroSelec.id, 
        fechaHora, 
        origen: 'WEB' 
      }).unwrap();
      navigate('/portal');
    } catch (err: any) { 
      const msg = err.data?.error || 'Error al crear reserva. Inténtalo de nuevo.';
      setError(msg); 
    }
  };

  return { 
    centros, loadC, centroSelec, setCentroSelec,
    especialidades, loadEsp, espSelec, setEspSelec, 
    medicos, loadMed, medicoSelec, setMedicoSelec,
    fechaHora, setFechaHora, 
    confirmarReserva, isSubmitting,
    error, setError 
  };
};