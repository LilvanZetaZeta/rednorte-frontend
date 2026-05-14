import { useState } from 'react';
import { 
  useGetEspecialidadesQuery, 
  useCrearEspecialidadMutation, 
  useActualizarEspecialidadMutation, 
  useEliminarEspecialidadMutation 
} from '../services/catalogosApi';
import type { IEspecialidad } from '../models/types';

export const useGestionEspecialidadesVM = () => {
  const { data: especialidades, isLoading, isError, refetch } = useGetEspecialidadesQuery();
  const [crearEspecialidad] = useCrearEspecialidadMutation();
  const [actualizarEspecialidad] = useActualizarEspecialidadMutation();
  const [eliminarEspecialidad] = useEliminarEspecialidadMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEspecialidad, setEditingEspecialidad] = useState<IEspecialidad | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOpenCreate = () => {
    setEditingEspecialidad(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (esp: IEspecialidad) => {
    setEditingEspecialidad(esp);
    setIsModalOpen(true);
  };

  const handleSave = async (nombre: string) => {
    setIsSubmitting(true);
    try {
      if (editingEspecialidad?.id) {
        await actualizarEspecialidad({ id: editingEspecialidad.id, data: { nombre } }).unwrap();
      } else {
        await crearEspecialidad({ nombre }).unwrap();
      }
      setIsModalOpen(false);
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Error al guardar la especialidad' };
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Estás seguro de eliminar esta especialidad?')) {
      try {
        await eliminarEspecialidad(id).unwrap();
        return { success: true };
      } catch (error) {
        return { success: false, error: 'Error al eliminar la especialidad' };
      }
    }
  };

  return {
    especialidades,
    isLoading,
    isError,
    isModalOpen,
    setIsModalOpen,
    editingEspecialidad,
    isSubmitting,
    handleOpenCreate,
    handleOpenEdit,
    handleSave,
    handleDelete,
    refetch
  };
};
