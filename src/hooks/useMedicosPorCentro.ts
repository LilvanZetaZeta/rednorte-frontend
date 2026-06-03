import { useMemo } from 'react';
import { useGetUsuariosStaffQuery } from '../services/usuariosApi';
import type { IUsuario } from '../models/types';

/**
 * ✅ Hook reutilizable para obtener médicos de un centro específico
 * Elimina la duplicación de lógica de filtrado en múltiples componentes
 * 
 * @param centroId - ID del centro médico
 * @returns Array de médicos del centro
 */
export const useMedicosPorCentro = (centroId: number) => {
  const { data: usuarios } = useGetUsuariosStaffQuery();

  const medicosDelCentro = useMemo<IUsuario[]>(() => {
    if (!usuarios) return [];
    return usuarios.filter(u => u.rol === 'MEDICO' && u.centroMedico?.id === centroId);
  }, [usuarios, centroId]);

  return medicosDelCentro;
};

export default useMedicosPorCentro;