import { useMemo } from 'react';
import Button from '../Button';
import Input from '../Input';
import { formatRut } from '../../../utils/formatters';
import { useValidarPaciente } from '../../../hooks/useValidarPaciente';

interface BuscadorPacienteRutProps {
  onPacienteValidado?: (data: { rut: string; nombre: string; correo: string; existe: boolean }) => void;
}

export default function BuscadorPacienteRut({ onPacienteValidado }: BuscadorPacienteRutProps) {
  const {
    rut,
    setRut,
    nombre,
    setNombre,
    correo,
    setCorreo,
    error,
    validado,
    pacienteExiste,
    validandoRut,
    handleValidarRut,
  } = useValidarPaciente();

  const onValidar = async () => {
    const data = await handleValidarRut();
    if (data) onPacienteValidado?.(data);
  };

  const resumen = useMemo(() => {
    if (!validado) return null;
    if (pacienteExiste) {
      return {
        title: 'Paciente verificado',
        body: `Nombre: ${nombre || '—'} · Correo: ${correo || '—'}`,
      };
    }
    return {
      title: 'Paciente nuevo',
      body: 'Complete nombre y correo para registrar la reserva.',
    };
  }, [correo, nombre, pacienteExiste, validado]);

  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 space-y-4">
      <div>
        <label className="block text-sm font-medium text-on-surface ml-1 mb-1">Paso 1 — RUT del paciente *</label>
        <div className="flex gap-2">
          <Input
            value={rut}
            onChange={(e) => setRut(formatRut(e.target.value))}
            placeholder="12.345.678-9"
            className="flex-1"
          />
          <Button type="button" variant="secondary" onClick={onValidar} isLoading={validandoRut}>Validar</Button>
        </div>
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

        {resumen && (
          <div className="mt-3 rounded-xl border border-green-200 bg-green-50 p-3">
            <p className="text-sm font-semibold text-green-800">{resumen.title}</p>
            <p className="mt-1 text-sm text-green-700">{resumen.body}</p>
          </div>
        )}
      </div>

      {validado && pacienteExiste === false && (
        <div className="space-y-3 rounded-2xl border border-blue-100 bg-blue-50 p-4">
          <Input label="Nombre completo *" value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Nombre del paciente" />
          <Input label="Correo electrónico *" type="email" value={correo} onChange={(e) => setCorreo(e.target.value)} placeholder="paciente@correo.cl" />
        </div>
      )}
    </div>
  );
}
