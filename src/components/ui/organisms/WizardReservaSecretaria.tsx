import { useMemo, useState, type FormEvent } from 'react';
import { useCrearReservaMutation } from '../../../services/reservasApi';
import { useGetUsuariosStaffQuery } from '../../../services/usuariosApi';
import type { IUsuario } from '../../../models/types';
import Button from '../Button';
import Input from '../Input';
import Modal from '../Modal';
import BuscadorPacienteRut from '../molecules/BuscadorPacienteRut';
import { normalizeRutForBackend } from '../../../utils/formatters';
import { validations } from '../../../utils/validations';

interface WizardReservaSecretariaProps {
  isOpen: boolean;
  centroId: number;
  onClose: () => void;
  onSuccess?: (message: string) => void;
}

const TIPOS_RESERVA = [
  { value: 'CONSULTA_MEDICA', label: 'Consulta médica' },
  { value: 'EXAMEN_IMAGENOLOGIA', label: 'Examen de imageneología' },
  { value: 'PROCEDIMIENTO_QUIROFANO', label: 'Procedimiento de quirófano' },
] as const;

export default function WizardReservaSecretaria({ isOpen, centroId, onClose, onSuccess }: WizardReservaSecretariaProps) {
  const [tipoReserva, setTipoReserva] = useState<(typeof TIPOS_RESERVA)[number]['value']>('CONSULTA_MEDICA');
  const [especialidadId, setEspecialidadId] = useState('');
  const [medicoId, setMedicoId] = useState('');
  const [pacienteRut, setPacienteRut] = useState('');
  const [pacienteNombre, setPacienteNombre] = useState('');
  const [pacienteCorreo, setPacienteCorreo] = useState('');
  
  // Estados temporales para las nuevas opciones de exámenes/procedimientos
  const [servicioAdicionalId, setServicioAdicionalId] = useState('');
  const [salaId, setSalaId] = useState('');
  
  const [fechaHora, setFechaHora] = useState('');
  const [error, setError] = useState('');
  const [pacienteExiste, setPacienteExiste] = useState<boolean | null>(null);
  const [rutValidado, setRutValidado] = useState(false);

  const { data: usuarios = [] } = useGetUsuariosStaffQuery();
  const [crearReserva, { isLoading: creandoReserva }] = useCrearReservaMutation();

  const minDateTime = useMemo(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }, []);

  const medicosDelCentro = useMemo<IUsuario[]>(() => {
    return usuarios.filter((u) => u.rol === 'MEDICO' && u.centroMedico?.id === centroId);
  }, [usuarios, centroId]);

  const especialidadesDisponibles = useMemo(() => {
    const map = new Map<number, string>();
    medicosDelCentro.forEach((medico) => {
      medico.especialidades?.forEach((esp) => map.set(esp.id, esp.nombre));
    });
    return Array.from(map.entries()).map(([id, nombre]) => ({ id, nombre }));
  }, [medicosDelCentro]);

  const doctoresFiltrados = useMemo(() => {
    if (!especialidadId) return medicosDelCentro;
    return medicosDelCentro.filter((medico) => medico.especialidades?.some((esp) => esp.id === Number(especialidadId)));
  }, [medicosDelCentro, especialidadId]);

  const resetForm = () => {
    setPacienteRut('');
    setPacienteNombre('');
    setPacienteCorreo('');
    setTipoReserva('CONSULTA_MEDICA');
    setEspecialidadId('');
    setMedicoId('');
    setServicioAdicionalId('');
    setSalaId('');
    setFechaHora('');
    setError('');
    setRutValidado(false);
    setPacienteExiste(null);
  };

  const handlePacienteValidado = (data: { rut: string; nombre: string; correo: string; existe: boolean }) => {
    setPacienteRut(data.rut);
    setPacienteNombre(data.nombre);
    setPacienteCorreo(data.correo);
    setPacienteExiste(data.existe);
    setRutValidado(true);
    setError('');
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!rutValidado) {
      setError('Debe validar el RUT antes de continuar.');
      return;
    }
    if (!fechaHora || !tipoReserva) {
      setError('Complete tipo de reserva y horario.');
      return;
    }

    if (new Date(fechaHora) < new Date()) {
      setError('La fecha y hora de la reserva no puede estar en el pasado.');
      return;
    }
    
    // Validación condicional: Solo exigir médico si es consulta
    if (tipoReserva === 'CONSULTA_MEDICA' && !medicoId) {
      setError('Seleccione un médico disponible.');
      return;
    }

    if (pacienteExiste === false) {
      const nameErr = validations.fullName(pacienteNombre) || (!pacienteNombre.trim() ? 'El nombre es requerido' : null);
      const emailErr = validations.email(pacienteCorreo) || (!pacienteCorreo.trim() ? 'El correo es requerido' : null);
      if (nameErr || emailErr) {
        setError('Por favor, corrija los errores en los datos del paciente (nombre o correo inválidos).');
        return;
      }
    }

    try {
      const medicoIdParaReserva = tipoReserva === 'CONSULTA_MEDICA' ? Number(medicoId || 0) : 0;

      await crearReserva({
        pacienteRut: normalizeRutForBackend(pacienteRut),
        pacienteNombreCompleto: pacienteNombre || undefined,
        pacienteCorreo: pacienteCorreo || undefined,
        medicoId: medicoIdParaReserva,
        centroId,
        fechaHora,
        tipoReserva,
        origen: 'PRESENCIAL',
      }).unwrap();

      onSuccess?.('Reserva creada correctamente.');
      onClose();
      resetForm();
    } catch (err: any) {
      setError(err?.data?.error || 'No fue posible crear la reserva.');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        onClose();
        resetForm();
      }}
      title="Wizard de reserva para secretaria"
      subtitle="Valide el RUT, complete los datos y confirme la reserva."
      maxWidth="lg"
      footer={(
        <div className="flex gap-3">
          <Button variant="outline" type="button" onClick={() => { onClose(); resetForm(); }} className="flex-1">Cancelar</Button>
          <Button type="submit" form="wizard-reserva-secretaria" className="flex-1" isLoading={creandoReserva}>Confirmar reserva</Button>
        </div>
      )}
    >
      <form id="wizard-reserva-secretaria" onSubmit={handleSubmit} className="space-y-5">
        <BuscadorPacienteRut onPacienteValidado={handlePacienteValidado} />
        {error && <p className="text-sm text-red-600">{error}</p>}

        {rutValidado && (
          <div className="space-y-4 rounded-2xl border border-slate-200 p-4 bg-white">
            
            {/* 1. SELECTOR PRINCIPAL (Renderizado Dinámico) */}
            <div>
              <label className="block text-sm font-medium text-on-surface ml-1 mb-1">Tipo de reserva *</label>
              <select value={tipoReserva} onChange={(e) => {
                  setTipoReserva(e.target.value as any);
                  setEspecialidadId('');
                  setMedicoId('');
                  setServicioAdicionalId('');
                  setSalaId('');
                }} 
                className="w-full rounded-2xl bg-surface-container-high px-4 py-3.5 text-sm outline-none focus:ring-2 focus:ring-primary">
                {TIPOS_RESERVA.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
              </select>
            </div>

            {/* 2. RENDERIZADO CONDICIONAL: CONSULTA MÉDICA */}
            {tipoReserva === 'CONSULTA_MEDICA' && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-on-surface ml-1 mb-1">Especialidad</label>
                    <select value={especialidadId} onChange={(e) => setEspecialidadId(e.target.value)} className="w-full rounded-2xl bg-surface-container-high px-4 py-3.5 text-sm outline-none focus:ring-2 focus:ring-primary">
                      <option value="">Todas</option>
                      {especialidadesDisponibles.map((esp) => <option key={esp.id} value={esp.id}>{esp.nombre}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-on-surface ml-1 mb-1">Médico *</label>
                    <select value={medicoId} onChange={(e) => setMedicoId(e.target.value)} className="w-full rounded-2xl bg-surface-container-high px-4 py-3.5 text-sm outline-none focus:ring-2 focus:ring-primary">
                      <option value="">Seleccione un médico disponible</option>
                      {doctoresFiltrados.map((medico) => (
                        <option key={medico.id} value={medico.id}>{medico.nombreCompleto} — {medico.especialidades?.[0]?.nombre || 'General'}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </>
            )}

            {/* 3. RENDERIZADO CONDICIONAL: EXÁMENES */}
            {tipoReserva === 'EXAMEN_IMAGENOLOGIA' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-on-surface ml-1 mb-1">Tipo de Examen *</label>
                  <select value={servicioAdicionalId} onChange={(e) => setServicioAdicionalId(e.target.value)} className="w-full rounded-2xl bg-surface-container-high px-4 py-3.5 text-sm outline-none focus:ring-2 focus:ring-primary">
                    <option value="">Seleccione un examen...</option>
                    <option value="RX">Radiografía (Rayos X)</option>
                    <option value="ECO">Ecografía</option>
                    <option value="TAC">Scanner (TAC)</option>
                    <option value="RM">Resonancia Magnética</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-on-surface ml-1 mb-1">Sala / Máquina</label>
                  <select value={salaId} onChange={(e) => setSalaId(e.target.value)} className="w-full rounded-2xl bg-surface-container-high px-4 py-3.5 text-sm outline-none focus:ring-2 focus:ring-primary">
                    <option value="">Asignación automática</option>
                    <option value="SALA_1">Sala Rayos X - Piso 1</option>
                    <option value="SALA_2">Sala Scanner - Piso -1</option>
                  </select>
                </div>
              </div>
            )}

            {/* 4. RENDERIZADO CONDICIONAL: QUIRÓFANO */}
            {tipoReserva === 'PROCEDIMIENTO_QUIROFANO' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-on-surface ml-1 mb-1">Procedimiento a realizar *</label>
                  <select value={servicioAdicionalId} onChange={(e) => setServicioAdicionalId(e.target.value)} className="w-full rounded-2xl bg-surface-container-high px-4 py-3.5 text-sm outline-none focus:ring-2 focus:ring-primary">
                    <option value="">Seleccione intervención...</option>
                    <option value="CIR_AMB">Cirugía Ambulatoria</option>
                    <option value="ENDOSCOPIA">Endoscopia / Colonoscopia</option>
                    <option value="CIR_MAYOR">Cirugía Mayor</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-on-surface ml-1 mb-1">Pabellón *</label>
                  <select value={salaId} onChange={(e) => setSalaId(e.target.value)} className="w-full rounded-2xl bg-surface-container-high px-4 py-3.5 text-sm outline-none focus:ring-2 focus:ring-primary">
                    <option value="">Seleccione pabellón...</option>
                    <option value="PAB_A">Pabellón A (Ambulatorio)</option>
                    <option value="PAB_B">Pabellón B (Alta Complejidad)</option>
                  </select>
                </div>
              </div>
            )}

            {/* 5. FECHA Y HORA (Aplica para todos) */}
            <Input label="Fecha y hora *" type="datetime-local" min={minDateTime} value={fechaHora} onChange={(e) => setFechaHora(e.target.value)} />
          </div>
        )}
      </form>
    </Modal>
  );
}