import client from "../client";
import type { components } from "../v1/schema";

export type IncidenceResponse = components["schemas"]["IncidenceResponse"]; //
export type IncidenceStatus = components["schemas"]["IncidenceStatus"]; //

export const IncidenceService = {
  // ==========================================
  // RUTAS DEL USUARIO AUTENTICADO
  // ==========================================

  async getMyUserIncidences() {
    const { data, error } = await client.GET("/api/v1/incidences/users/me"); //
    if (error) throw error;
    return data;
  },

  /**
   * Crea una incidencia de usuario.
   * Nota: Recibe un string y un archivo opcional nativo de JS (File | Blob)
   */
  async createUserIncidence(content: string, file?: File | Blob) {
    // 1. Instanciamos el FormData nativo del navegador
    const formData = new FormData();
    
    // 2. Agregamos el contenido de texto (obligatorio)
    formData.append("content", content);
    
    // 3. Si hay un archivo, lo adjuntamos
    if (file) {
      formData.append("file", file);
    }

    const { data, error } = await client.POST("/api/v1/incidences/users/me", { //
      // Cast a 'any' o al tipo esperado para saltar la validación estricta 
      // de TS que espera un 'string' en lugar de un File/FormData
      body: formData as any,
    });
    if (error) throw error;
    return data;
  },

  async cancelUserIncidence(incidenceId: string) {
    const { data, error } = await client.PATCH("/api/v1/incidences/users/me/{incidence_id}/cancel", { //
      params: { path: { incidence_id: incidenceId } },
    });
    if (error) throw error;
    return data;
  },

  // ==========================================
  // RUTAS DE LA EMPRESA AUTENTICADA
  // ==========================================

  async getMyCompanyIncidences() {
    const { data, error } = await client.GET("/api/v1/incidences/companies/me"); //
    if (error) throw error;
    return data;
  },

  async createCompanyIncidence(content: string, file?: File | Blob) {
    const formData = new FormData();
    formData.append("content", content);
    if (file) formData.append("file", file);

    const { data, error } = await client.POST("/api/v1/incidences/companies/me", { //
      body: formData as any,
    });
    if (error) throw error;
    return data;
  },

  async cancelCompanyIncidence(incidenceId: string) {
    const { data, error } = await client.PATCH("/api/v1/incidences/companies/me/{incidence_id}/cancel", { //
      params: { path: { incidence_id: incidenceId } },
    });
    if (error) throw error;
    return data;
  }
};