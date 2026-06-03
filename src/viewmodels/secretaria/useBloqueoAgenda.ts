import { useState } from 'react';
import { useBloquearAgendaMedicoMutation } from '../../services/reservasApi';

export const useBloqueoAgenda = () => {
  const [bloquearAgenda] = useBloquearAgendaMedicoMutation();
  const [showModalBloqueo, setShowModalBloqueo] = useState(false);
  const [bloqueoData, setBloqueoData] = useState({ medicoId: '', fecha: '' });

  const handleBloqueoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await bloquearAgenda({
        medicoId: Number(bloqueoData.medicoId),
        fechaBloqueo: bloqueoData.fecha
      }).unwrap();
      
      setShowModalBloqueo(false);
      setBloqueoData({ medicoId: '', fecha: '' });
      return { success: true, message: 'Agenda bloqueada y proceso de reasignación iniciado.' };
    } catch (error: any) {
      return { success: false, error: "Error al levantar la contingencia: " + (error?.data?.error || "Error desconocido") };
    }
  };

  return {
    showModalBloqueo,
    setShowModalBloqueo,
    bloqueoData,
    setBloqueoData,
    handleBloqueoSubmit
  };
};