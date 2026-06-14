import { apiGateway } from './apiGateway';

export interface OfertaReasignacion {
    id: number;
    cupo_id: number;
    paciente_candidato_id: number;
    estado: 'PENDIENTE' | 'ACEPTADA' | 'RECHAZADA' | 'EXPIRADA';
    tiempo_limite: string;
}

export const reasignacionesApi = apiGateway.injectEndpoints({
    endpoints: (builder) => ({
        
        // GET: Obtener ofertas pendientes
        obtenerOfertas: builder.query<OfertaReasignacion[], string | number>({
            query: (pacienteId) => `/reasignaciones/paciente/${pacienteId}`,
            providesTags: ['Reasignaciones'],
        }),

        // PATCH: Responder a la oferta
        responderOferta: builder.mutation<OfertaReasignacion, { ofertaId: number; estado: 'ACEPTADA' | 'RECHAZADA' }>({
            query: ({ ofertaId, estado }) => ({
                url: `/reasignaciones/${ofertaId}`,
                method: 'PATCH',
                body: { estado },
            }),
            // Invalida la caché para que el frontend (la alerta) desaparezca sola al responder
            invalidatesTags: ['Reasignaciones'],
        }),
        
    }),
    overrideExisting: false,
});

export const { 
    useObtenerOfertasQuery, 
    useResponderOfertaMutation 
} = reasignacionesApi;