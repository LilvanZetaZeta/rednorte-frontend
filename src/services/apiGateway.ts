import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { supabase } from '../config/supabaseClient';

export const apiGateway = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:8080/api', // Apunta al API Gateway en Localhost
    prepareHeaders: async (headers) => {
      // Extraemos el JWT de Supabase automáticamente en cada petición
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.access_token) {
        headers.set('Authorization', `Bearer ${session.access_token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Reservas', 'Pacientes'], // Para invalidar caché automáticamente
  endpoints: () => ({}), // Los endpoints se inyectan en archivos separados
});