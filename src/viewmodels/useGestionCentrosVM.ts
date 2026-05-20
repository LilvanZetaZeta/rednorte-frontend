import { useState } from 'react';
import {
  useGetCentrosQuery,
  useCreateCentroMutation,
  useUpdateCentroMutation,
  useDeleteCentroMutation,
} from '../services/centrosMedicosApi';
import { useGetAdminsDisponiblesQuery, useUpdateUsuarioCentroMutation } from '../services/usuariosApi';
import type { CentroMedico } from '../services/centrosMedicosApi';

export const useGestionCentrosVM = () => {
  const { data: centros, isLoading, isError, refetch } = useGetCentrosQuery();
  const { data: adminsDisponibles, refetch: refetchAdmins } = useGetAdminsDisponiblesQuery();
  const [createCentro] = useCreateCentroMutation();
  const [updateCentro] = useUpdateCentroMutation();
  const [deleteCentro] = useDeleteCentroMutation();
  const [updateUsuarioCentro] = useUpdateUsuarioCentroMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCentro, setEditingCentro] = useState<CentroMedico | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOpenCreate = () => {
    setEditingCentro(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (centro: CentroMedico) => {
    setEditingCentro(centro);
    setIsModalOpen(true);
  };

  const handleSave = async (
    data: Partial<CentroMedico>, 
    newAdminId: number | null | undefined, 
    previousAdminId: number | null
  ) => {
    setIsSubmitting(true);
    try {
      let savedCentro: CentroMedico;
      if (editingCentro?.id) {
        savedCentro = await updateCentro({ id: editingCentro.id, data }).unwrap();
      } else {
        savedCentro = await createCentro(data).unwrap();
      }

      // newAdminId === undefined means no change was made
      if (newAdminId !== undefined) {
        // Unlink previous admin if there was one
        if (previousAdminId && previousAdminId !== newAdminId) {
          await updateUsuarioCentro({ id: previousAdminId, centroId: null }).unwrap();
        }

        // Link new admin if one was selected
        if (newAdminId && savedCentro.id) {
          await updateUsuarioCentro({ id: newAdminId, centroId: savedCentro.id }).unwrap();
        }
      }

      setIsModalOpen(false);
      refetchAdmins();
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Error al guardar el centro médico' };
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Estás seguro de eliminar este centro médico?')) {
      try {
        await deleteCentro(id).unwrap();
        return { success: true };
      } catch (error) {
        return { success: false, error: 'Error al eliminar el centro médico' };
      }
    }
    return { success: false };
  };

  return {
    centros,
    adminsDisponibles,
    isLoading,
    isError,
    isModalOpen,
    setIsModalOpen,
    editingCentro,
    isSubmitting,
    handleOpenCreate,
    handleOpenEdit,
    handleSave,
    handleDelete,
    refetch
  };
};
