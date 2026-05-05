import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { supabase } from '../config/supabaseClient';

export const apiGateway = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_GATEWAY_URL || 'http://localhost:8080/api', 
    prepareHeaders: async (headers) => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.access_token) {
        headers.set('Authorization', `Bearer ${session.access_token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Reservas', 'Pacientes', 'CentrosMedicos'],
  endpoints: () => ({}),
});