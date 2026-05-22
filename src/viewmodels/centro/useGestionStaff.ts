import { useState, useMemo } from 'react';
import { 
  useGetUsuariosStaffQuery, 
  useGetTodosUsuariosQuery,
  useUpdateUsuarioCentroMutation,
  useUpdateUsuarioEspecialidadesMutation,
  useEliminarUsuarioMutation,
  usePatchUsuarioMutation,
  useUpdateUsuarioRolMutation
} from '../../services/usuariosApi';
import { useGetEspecialidadesQuery } from '../../services/catalogosApi';
import type { IUsuario } from '../../models/types';

export interface IFormAsignar {
  usuarioId: number | null;
  rol: 'SECRETARIA' | 'MEDICO';
  especialidadIds: number[];
}

export interface IFormEdit {
  nombreCompleto: string;
  correo: string;
  especialidadIds: number[];
}

export const useGestionStaff = (miCentroId: number | null) => {
  const { data: todosStaff, isLoading: loadingS, refetch: refetchStaff } = useGetUsuariosStaffQuery();
  const { data: todosUsuarios } = useGetTodosUsuariosQuery();
  const { data: especialidades } = useGetEspecialidadesQuery();

  const [updateCentro]         = useUpdateUsuarioCentroMutation();
  const [updateEspecialidades] = useUpdateUsuarioEspecialidadesMutation();
  const [eliminarUsuario]      = useEliminarUsuarioMutation();
  const [patchUsuario]         = usePatchUsuarioMutation();
  const [updateRol]            = useUpdateUsuarioRolMutation();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showModal,    setShowModal]    = useState(false);
  const [editingUser,  setEditingUser]  = useState<IUsuario | null>(null);
  const [busqueda, setBusqueda] = useState('');

  const [formAsignar, setFormAsignar] = useState<IFormAsignar>({
    usuarioId: null, rol: 'SECRETARIA', especialidadIds: [],
  });
  
  const [formEdit, setFormEdit] = useState<IFormEdit>({
    nombreCompleto: '', correo: '', especialidadIds: [],
  });

  const staffDelCentro = useMemo(() => {
    if (!todosStaff || !miCentroId) return [];
    return todosStaff.filter(
      u => (u.rol === 'MEDICO' || u.rol === 'SECRETARIA') && u.centroMedico?.id === miCentroId
    );
  }, [todosStaff, miCentroId]);

  const candidatos = useMemo(() => {
    if (!todosUsuarios) return [];
    const idsStaff = new Set(staffDelCentro.map(u => u.id));
    return todosUsuarios.filter(u => !idsStaff.has(u.id));
  }, [todosUsuarios, staffDelCentro]);

  const candidatosFiltrados = useMemo(() => {
    if (!busqueda.trim()) return candidatos;
    const q = busqueda.toLowerCase();
    return candidatos.filter(
      u => u.nombreCompleto.toLowerCase().includes(q) || u.correo.toLowerCase().includes(q)
    );
  }, [candidatos, busqueda]);

  const toggleEspecialidad = (id: number, mode: 'asignar' | 'edit') => {
    const toggle = (ids: number[]) => ids.includes(id) ? ids.filter(e => e !== id) : [...ids, id];
    if (mode === 'asignar') setFormAsignar(p => ({ ...p, especialidadIds: toggle(p.especialidadIds) }));
    else                    setFormEdit(p   => ({ ...p, especialidadIds: toggle(p.especialidadIds) }));
  };

  const handleAsignar = async (): Promise<{ success: boolean; error?: string }> => {
    if (!miCentroId)          return { success: false, error: 'Tu cuenta no tiene un centro médico asignado.' };
    if (!formAsignar.usuarioId) return { success: false, error: 'Selecciona un usuario de la lista.' };
    if (formAsignar.rol === 'MEDICO' && formAsignar.especialidadIds.length === 0)
      return { success: false, error: 'Debes seleccionar al menos una especialidad para el médico.' };

    setIsSubmitting(true);
    try {
      const id = formAsignar.usuarioId;
      await updateRol({ id, rol: formAsignar.rol }).unwrap();
      await updateCentro({ id, centroId: miCentroId }).unwrap();
      
      if (formAsignar.rol === 'MEDICO') {
        await updateEspecialidades({ id, especialidadIds: formAsignar.especialidadIds }).unwrap();
      }
      
      refetchStaff();
      setFormAsignar({ usuarioId: null, rol: 'SECRETARIA', especialidadIds: [] });
      setBusqueda('');
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.data?.error || 'Error al asignar el usuario' };
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenEdit = (u: IUsuario) => {
    setEditingUser(u);
    setFormEdit({
      nombreCompleto: u.nombreCompleto,
      correo:         u.correo,
      especialidadIds: u.especialidades?.map(e => e.id) ?? [],
    });
    setShowModal(true);
  };

  const handleGuardarEdit = async (): Promise<{ success: boolean; error?: string }> => {
    if (!editingUser) return { success: false };
    setIsSubmitting(true);
    try {
      await patchUsuario({ id: editingUser.id, nombreCompleto: formEdit.nombreCompleto, correo: formEdit.correo }).unwrap();
      if (editingUser.rol === 'MEDICO') {
        await updateEspecialidades({ id: editingUser.id, especialidadIds: formEdit.especialidadIds }).unwrap();
      }
      refetchStaff();
      setShowModal(false);
      setEditingUser(null);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.data?.error || 'Error al actualizar' };
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEliminar = async (id: number): Promise<{ success: boolean; error?: string }> => {
    try {
      await eliminarUsuario(id).unwrap();
      refetchStaff();
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.data?.error || 'Error al eliminar el usuario' };
    }
  };

  return {
    staffDelCentro, 
    candidatosFiltrados, 
    especialidades: especialidades ?? [],
    loadingS, 
    isSubmitting, 
    busqueda, 
    setBusqueda,
    formAsignar, 
    setFormAsignar, 
    formEdit, 
    setFormEdit,
    editingUser, 
    showModal, 
    setShowModal, 
    toggleEspecialidad,
    handleAsignar, 
    handleOpenEdit, 
    handleGuardarEdit, 
    handleEliminar
  };
};