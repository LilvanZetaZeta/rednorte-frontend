import { useState } from 'react';
import { 
  useGetCentrosQuery, 
  useCreateCentroMutation, 
  useUpdateCentroMutation, 
  useDeleteCentroMutation,
} from '../services/centrosMedicosApi';
import type { CentroMedico } from '../services/centrosMedicosApi';

export const useGestionCentrosVM = () => {
  const { data: centros, isLoading, isError, refetch } = useGetCentrosQuery();
  const [createCentro] = useCreateCentroMutation();
  const [updateCentro] = useUpdateCentroMutation();
  const [deleteCentro] = useDeleteCentroMutation();

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

  const handleSave = async (data: Partial<CentroMedico>) => {
    setIsSubmitting(true);
    try {
      if (editingCentro?.id) {
        await updateCentro({ id: editingCentro.id, data }).unwrap();
      } else {
        await createCentro(data).unwrap();
      }
      setIsModalOpen(false);
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
  };

  return {
    centros,
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
