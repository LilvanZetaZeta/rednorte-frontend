import { useState } from 'react';
import { useLazyGetUsuarioPorRutQuery } from '../services/usuariosApi';
import { normalizeRutForBackend } from '../utils/formatters';
import { validations } from '../utils/validations';

export const useValidarPaciente = () => {
  const [rut, setRut] = useState('');
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [error, setError] = useState('');
  const [validado, setValidado] = useState(false);
  const [pacienteExiste, setPacienteExiste] = useState<boolean | null>(null);

  const [triggerValidarRut, { isFetching: validandoRut }] = useLazyGetUsuarioPorRutQuery();

  const handleValidarRut = async () => {
    const rutNormalizado = normalizeRutForBackend(rut);

    if (!rutNormalizado) {
      setError('Ingrese un RUT válido para validar al paciente.');
      return;
    }

    const rutError = validations.rut(rutNormalizado);
    if (rutError) {
      setError(rutError);
      return;
    }

    try {
      const paciente = await triggerValidarRut(rutNormalizado).unwrap();
      setPacienteExiste(true);
      setValidado(true);
      setNombre(paciente.nombreCompleto || '');
      setCorreo(paciente.correo || '');
      setError('');
      return { rut: rutNormalizado, nombre: paciente.nombreCompleto || '', correo: paciente.correo || '', existe: true };
    } catch {
      setPacienteExiste(false);
      setValidado(true);
      setNombre('');
      setCorreo('');
      setError('Paciente no encontrado. Complete nombre y correo para registrar la reserva.');
      return { rut: rutNormalizado, nombre: '', correo: '', existe: false };
    }
  };

  return {
    rut,
    setRut,
    nombre,
    setNombre,
    correo,
    setCorreo,
    error,
    setError,
    validado,
    setValidado,
    pacienteExiste,
    setPacienteExiste,
    validandoRut,
    handleValidarRut,
  };
};
