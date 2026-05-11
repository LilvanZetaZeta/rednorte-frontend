import { useState } from 'react';
import { useGetResumenQuery } from '../services/metricasApi';


export const useSecretariaVM = () => {
  const [rutBusqueda, setRutBusqueda] = useState('');
  
  const { data: resumen, isLoading: loadingMetricas } = useGetResumenQuery();

  // Por ahora usaremos las métricas del resumen
  const stats = [
    { label: 'Citas Totales', value: resumen?.totalReservas || 0, icon: 'calendar_today', sub: 'hoy' },
    { label: 'Pendientes Check-in', value: resumen?.reservasVigentes || 0, icon: 'hourglass_empty', sub: 'requiere acción' },
    { label: 'En Lista de Espera', value: 15, icon: 'list_alt', sub: 'pacientes' }, // Valor ejemplo basado en mockup
    { label: 'Cupos Disponibles', value: 12, icon: 'event_available', sub: 'en 5 médicos' }
  ];

  const handleCheckIn = () => {
    if (!rutBusqueda) return alert("Ingrese un RUT para procesar");
    console.log(`Procesando ingreso para: ${rutBusqueda}`);

    // Aquí iría la llamada a un PATCH en reservasApi para cambiar el estado a "ATENDIDO"

    alert(`Check-in exitoso para el paciente ${rutBusqueda}`);
    setRutBusqueda('');
  };

  return {
    stats,
    loadingMetricas,
    rutBusqueda,
    setRutBusqueda,
    handleCheckIn
  };
};