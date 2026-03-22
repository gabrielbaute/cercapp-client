import client from '../client';
import type { components } from '../v1/schema';

// Extraemos los tipos para usarlos en las vistas
export type InterestResponse = components["schemas"]["InterestResponse"];
export type InterestListResponse = components["schemas"]["InterestListResponse"];

export const InterestService = {
  /**
   * Obtiene el historial completo de intereses devengados de un plan específico.
   * Solo accesible por el dueño del plan o un Administrador.
   */
  async getPlanInterests(planId: string): Promise<InterestListResponse> {
    const { data, error } = await client.GET("/api/v1/interests/plan/{plan_id}", {
      params: {
        path: { plan_id: planId }
      }
    });
    
    if (error) throw error;
    return data as InterestListResponse;
  }
};