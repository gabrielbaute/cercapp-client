import client from '../client';
import type { components } from '../v1/schema';

export type IncidenceAdminResponse = components["schemas"]["IncidenceAdminResponse"];
export type IncidenceAdminListResponse = components["schemas"]["IncidenceAdminListResponse"];
export type ProcessIncidenceBody = components["schemas"]["Body_process_incidence_api_v1_incidences__incidence_id__process_patch"];

export const IncidencesAdminService = {
  /**
   * Obtiene la lista de todas las incidencias (Paginado)
   */
  async listAllIncidences(skip = 0, limit = 100): Promise<IncidenceAdminListResponse> {
    const { data, error } = await client.GET("/api/v1/incidences/", {
      params: { query: { skip, limit } }
    });
    if (error) throw error;
    return data as IncidenceAdminListResponse;
  },

  /**
   * Obtiene el detalle completo de una incidencia
   */
  async getIncidenceById(incidenceId: string): Promise<IncidenceAdminResponse> {
    const { data, error } = await client.GET("/api/v1/incidences/{incidence_id}", {
      params: { path: { incidence_id: incidenceId } }
    });
    if (error) throw error;
    return data as IncidenceAdminResponse;
  },

  /**
   * Procesa y cierra una incidencia (Requiere comentario del admin)
   */
  async processIncidence(incidenceId: string, processData: ProcessIncidenceBody): Promise<IncidenceAdminResponse> {
    const { data, error } = await client.PATCH("/api/v1/incidences/{incidence_id}/process", {
      params: { path: { incidence_id: incidenceId } },
      body: processData,
    });
    if (error) throw error;
    return data as IncidenceAdminResponse;
  }
};