import { useState } from 'react';

export const useAgendamientoCita = () => {
  const [showModalNuevaCita, setShowModalNuevaCita] = useState(false);

  const openModalNuevaCita = () => {
    setShowModalNuevaCita(true);
  };

  return {
    showModalNuevaCita,
    setShowModalNuevaCita,
    openModalNuevaCita,
  };
};