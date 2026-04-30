import { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { centroMedicoService } from '../services/centroMedicoService';
import type { ICentroMedico } from '../models/ICentroMedico';

export const useCentrosMedicos = () => {
  const { getAccessTokenSilently } = useAuth0();
  const [centros, setCentros] = useState<ICentroMedico[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCentros = async () => {
      try {
        setIsLoading(true);
        // 1. Conseguimos la llave
        const token = await getAccessTokenSilently();
        // 2. Le pedimos los datos al Modelo
        const data = await centroMedicoService.obtenerTodos(token);
        // 3. Guardamos los datos para la Vista
        setCentros(data);
      } catch (err: any) {
        setError(err.message || 'Error desconocido al cargar centros');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCentros();
  }, [getAccessTokenSilently]);

  // Esto es lo único que la Vista verá
  return { centros, isLoading, error };
};