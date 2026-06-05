import { Stethoscope } from 'lucide-react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { useObtenerHistorialPorReservaQuery } from '../../services/reservasApi';

interface HistorialDetalleModalProps {
  reservaId: number;
  onClose: () => void;
}

export default function HistorialDetalleModal({ reservaId, onClose }: HistorialDetalleModalProps) {
  const { data: historial, isLoading, error } = useObtenerHistorialPorReservaQuery(reservaId);

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title="Detalle de Atención Médica"
      maxWidth="md"
      footer={<Button onClick={onClose} className="w-full">Cerrar</Button>}
    >
      {isLoading ? (
        <div className="py-8 text-center text-primary font-medium animate-pulse">
          Cargando observaciones médicas...
        </div>
      ) : error ? (
        <div className="p-4 text-center text-red-600 bg-red-50 border border-red-100 rounded-2xl font-medium">
          No se encontraron comentarios para esta cita o hubo un error al cargarlos.
        </div>
      ) : historial ? (
        <div className="space-y-6">
          <div className="flex items-center gap-4 bg-surface-container-low p-4 rounded-2xl border border-outline-variant animate-fade-in">
            <div className="w-12 h-12 rounded-2xl bg-secondary-container flex items-center justify-center text-secondary">
              <Stethoscope className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-on-surface">Dr. {historial.medico.nombreCompleto}</h4>
              <p className="text-sm text-on-surface-variant font-medium">
                {historial.medico.especialidades?.[0]?.nombre || 'Médico General'}
              </p>
              <p className="text-xs text-on-surface-variant/70 mt-0.5 font-medium">
                {historial.medico.centroMedico?.nombreSucursal || 'Centro Médico RedNorte'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm animate-fade-in">
            <div className="bg-surface-container-high p-3 rounded-xl border border-surface-variant">
              <span className="text-xs text-on-surface-variant block uppercase tracking-wider mb-1 font-semibold">Fecha de Atención</span>
              <span className="font-medium text-on-surface">
                {new Date(historial.fechaAtencion).toLocaleString('es-CL')}
              </span>
            </div>
            {historial.procedimientoRealizado && (
              <div className="bg-surface-container-high p-3 rounded-xl border border-surface-variant">
                <span className="text-xs text-on-surface-variant block uppercase tracking-wider mb-1 font-semibold">Procedimiento</span>
                <span className="font-medium text-on-surface">
                  {historial.procedimientoRealizado.replace(/_/g, ' ')}
                </span>
              </div>
            )}
          </div>

          <div className="bg-primary-container/20 border border-primary/10 rounded-2xl p-5 space-y-2 animate-fade-in">
            <h5 className="font-bold text-primary text-sm uppercase tracking-wide">Observaciones Clínicas</h5>
            <p className="text-on-surface leading-relaxed text-sm whitespace-pre-line font-medium">
              {historial.observaciones}
            </p>
          </div>
        </div>
      ) : null}
    </Modal>
  );
}
