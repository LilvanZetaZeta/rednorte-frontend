import type { ICentroMedico } from '../models/ICentroMedico';


const API_URL = 'http://localhost:8080/api';

export const centroMedicoService = {
  obtenerTodos: async (token: string): Promise<ICentroMedico[]> => {
    const response = await fetch(`${API_URL}/centros-medicos`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Error del servidor: ${response.status}`);
    }

    return response.json();
  }
};