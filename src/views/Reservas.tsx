import { useAuth0 } from '@auth0/auth0-react';
import { useCentrosMedicos } from '../viewmodels/useCentrosMedicos';

export default function Reservas() {
  const { user } = useAuth0();
  

  const { centros, isLoading, error } = useCentrosMedicos();

  return (
    <div>
      <h2>Panel de Paciente: {user?.name}</h2>
      <p>Selecciona una sucursal para agendar tu cita:</p>

      {/* Manejo de estados visuales delegados por el ViewModel */}
      {isLoading && <p>Cargando sucursales disponibles...</p>}
      
      {error && (
        <div style={{ color: 'red', background: '#ffebee', padding: '1rem', borderRadius: '8px' }}>
          Error de conexión: {error}
        </div>
      )}

      {/* Renderizado de datos */}
      {!isLoading && !error && (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {centros.map((centro) => (
            <li 
              key={centro.id} 
              style={{ background: '#f5f5f5', margin: '0.5rem 0', padding: '1rem', borderRadius: '4px', borderLeft: '4px solid #3498db' }}
            >
              <strong>{centro.nombreSucursal}</strong>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}