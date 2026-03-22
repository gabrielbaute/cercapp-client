import client from '../client';
import type { components } from '../v1/schema';

export type InterestAdminResponse = components["schemas"]["InterestAdminResponse"];
export type InterestAdminListResponse = components["schemas"]["InterestAdminListResponse"];
export type InterestUpdate = components["schemas"]["InterestUpdate"];

export const InterestAdminService = {
  /**
   * Lista todos los registros de intereses generados en la plataforma.
   */
  async getAllInterests(): Promise<InterestAdminListResponse> {
    const { data, error } = await client.GET("/api/v1/interests/");
    
    if (error) throw error;
    return data as InterestAdminListResponse;
  },

  /**
   * Modifica manualmente un registro de interés contable.
   * Útil para correcciones de auditoría.
   */
  async updateInterestRecord(recordId: string, updateData: InterestUpdate): Promise<InterestAdminResponse> {
    const { data, error } = await client.PATCH("/api/v1/interests/{record_id}", {
      params: {
        path: { record_id: recordId }
      },
      body: updateData
    });
    
    if (error) throw error;
    return data as InterestAdminResponse;
  },

  /**
   * Fuerza el cálculo manual de intereses. 
   * Ideal como respaldo si la tarea programada falla en el servidor.
   */
  async forceManualCalculation(year: number, month: number) {
    const { data, error } = await client.POST("/api/v1/interests/calculate/manual", {
      query: { year, month }
    } as any);
    
    if (error) throw error;
    return data;
  }
};