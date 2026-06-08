import { useState } from 'react';
import { Search, Stethoscope, Calendar, FileText, Loader2, AlertCircle, User } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { formatRut, normalizeRutForBackend } from '../utils/formatters';
import { useLazyGetUsuarioPorRutQuery } from '../services/usuariosApi';
import { useLazyObtenerHistorialPorPacienteQuery } from '../services/reservasApi';
import type { IUsuario, IHistorialCita } from '../models/types';

export default function BuscarHistorialDoctor() {
  const [rut, setRut] = useState('');
  const [errorBusqueda, setErrorBusqueda] = useState<string | null>(null);
  const [pacienteInfo, setPacienteInfo] = useState<IUsuario | null>(null);
  const [historialCitas, setHistorialCitas] = useState<IHistorialCita[]>([]);

  const [triggerGetUsuarioPorRut, { isFetching: buscandoUsuario }] = useLazyGetUsuarioPorRutQuery();
  const [triggerObtenerHistorial, { isFetching: cargandoHistorial }] = useLazyObtenerHistorialPorPacienteQuery();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorBusqueda(null);
    setPacienteInfo(null);
    setHistorialCitas([]);

    const rutNormalizado = normalizeRutForBackend(rut);
    if (!rutNormalizado) {
      setErrorBusqueda('Por favor ingresa un RUT válido.');
      return;
    }

    try {
      // 1. Buscar el usuario por su RUT
      const usuario = await triggerGetUsuarioPorRut(rutNormalizado).unwrap();
      if (!usuario) {
        setErrorBusqueda('Paciente no encontrado en el sistema.');
        return;
      }
      setPacienteInfo(usuario);

      // 2. Obtener el historial clínico del paciente
      const historial = await triggerObtenerHistorial(usuario.id).unwrap();
      setHistorialCitas(historial || []);
    } catch (err: any) {
      console.error(err);
      if (err?.status === 404) {
        setErrorBusqueda('No se encontró ningún paciente con el RUT ingresado.');
      } else {
        setErrorBusqueda(
          err?.data?.error || err?.data?.message || 'Error al buscar la ficha clínica del paciente.'
        );
      }
    }
  };

  const cargando = buscandoUsuario || cargandoHistorial;

  return (
    <div className="space-y-8 animate-in fade-in duration-700 max-w-5xl mx-auto pb-10">
      {/* CABECERA */}
      <section className="border-b border-outline-variant pb-6">
        <h1 className="font-h1 text-h1 text-on-background mb-1">Búsqueda de Ficha Clínica</h1>
        <p className="text-on-surface-variant font-medium">Consulte el historial completo de atenciones y evoluciones médicas por RUT de paciente.</p>
      </section>

      {/* BLOQUE DE BÚSQUEDA */}
      <div className="bg-surface-container-lowest border border-outline-variant p-6 rounded-3xl shadow-sm space-y-4">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4 items-end">
          <Input
            label="RUT del Paciente *"
            value={rut}
            onChange={(e) => setRut(formatRut(e.target.value))}
            placeholder="12.345.678-9"
            className="w-full sm:flex-1"
            disabled={cargando}
          />
          <Button
            type="submit"
            isLoading={cargando}
            disabled={!rut || cargando}
            icon={<Search size={18} />}
            className="w-full sm:w-auto h-[46px]"
          >
            Buscar Paciente
          </Button>
        </form>

        {/* Mensaje de Error de Búsqueda */}
        {errorBusqueda && (
          <div className="p-4 flex gap-3 text-sm text-error bg-error-container/30 border border-error/20 rounded-2xl font-medium items-center animate-in fade-in duration-300">
            <AlertCircle className="w-5 h-5 shrink-0 text-error" />
            <span>{errorBusqueda}</span>
          </div>
        )}
      </div>

      {/* Cargador */}
      {cargando && (
        <div className="py-20 text-center text-primary font-medium flex flex-col items-center gap-3">
          <Loader2 className="w-12 h-12 animate-spin" />
          <span>Buscando paciente y cargando historial clínico...</span>
        </div>
      )}

      {/* Resultados de la Búsqueda */}
      {!cargando && pacienteInfo && (
        <div className="space-y-6 animate-in fade-in duration-500">
          {/* Ficha básica del paciente */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-surface-container-lowest p-6 rounded-3xl border border-outline-variant gap-4 shadow-sm">
            <div className="flex gap-4 items-center">
              <div className="w-14 h-14 rounded-2xl bg-primary-container text-on-primary-container flex items-center justify-center shadow-sm">
                <User size={28} />
              </div>
              <div>
                <h3 className="font-bold text-lg text-on-surface">{pacienteInfo.nombreCompleto}</h3>
                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-xs text-on-surface-variant font-medium">
                  <span>RUT: {pacienteInfo.rut}</span>
                  <span className="hidden sm:inline">•</span>
                  <span>Correo: {pacienteInfo.correo}</span>
                </div>
              </div>
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-primary bg-primary/10 px-3 py-1.5 rounded-full border border-primary/20">
              Paciente Registrado
            </span>
          </div>

          {/* Listado de Historial */}
          <div className="space-y-4">
            <h4 className="font-bold text-on-surface flex items-center gap-2 text-sm uppercase tracking-wider">
              <FileText size={18} className="text-primary" /> Historial de Atenciones ({historialCitas.length})
            </h4>

            {historialCitas.length === 0 ? (
              <div className="p-16 text-center border-2 border-dashed border-outline-variant bg-surface-container-lowest rounded-3xl text-on-surface-variant/60">
                <Stethoscope className="w-16 h-16 mx-auto mb-3 opacity-20" />
                <p className="font-bold text-sm">Sin historial de atenciones</p>
                <p className="text-xs mt-1">El paciente no registra atenciones previas ni evoluciones clínicas en el sistema.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {historialCitas.map((cita) => (
                  <div key={cita.id} className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 shadow-sm space-y-4 hover:shadow-md transition-all">
                    <div className="flex justify-between items-start flex-wrap gap-2">
                      <div>
                        <h5 className="font-bold text-on-surface text-base">
                          Atendido por Dr. {cita.medico.nombreCompleto}
                        </h5>
                        <p className="text-sm text-on-surface-variant font-medium mt-0.5">
                          {cita.medico.especialidades?.[0]?.nombre || 'Médico General'} · {cita.medico.centroMedico?.nombreSucursal || 'Centro RedNorte'}
                        </p>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-on-surface-variant font-medium bg-surface-container p-2.5 rounded-xl border border-outline-variant/30">
                        <Calendar size={14} className="text-primary" />
                        <span>
                          {new Date(cita.fechaAtencion).toLocaleDateString('es-CL', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                    </div>

                    {cita.procedimientoRealizado && (
                      <div className="inline-block text-[10px] font-bold uppercase tracking-wider text-secondary bg-secondary-container px-2 py-1 rounded-md">
                        Procedimiento: {cita.procedimientoRealizado.replace(/_/g, ' ')}
                      </div>
                    )}

                    <div className="bg-surface-container-high/40 p-5 rounded-2xl border border-outline-variant/30 space-y-2">
                      <span className="text-[10px] font-bold text-primary uppercase tracking-wide block">Evolución Clínica</span>
                      <p className="text-sm text-on-surface leading-relaxed whitespace-pre-line font-medium">
                        {cita.observaciones}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
