import { useMemo } from 'react';
import { useGetUsuariosStaffQuery } from '../services/usuariosApi';
import type { IUsuario } from '../models/types';

export const useMedicosPorCentro = (centroId: number) => {
  const { data: usuarios } = useGetUsuariosStaffQuery();

  const medicosDelCentro = useMemo<IUsuario[]>(() => {
    if (!usuarios) return [];
    return usuarios.filter(u => u.rol === 'MEDICO' && u.centroMedico?.id === centroId);
  }, [usuarios, centroId]);

  return medicosDelCentro;
};

export default useMedicosPorCentro;