import client from "../client";

export const HealthService = {
  /**
   * Verifica que la API y la Base de Datos están funcionando.
   */
  async checkHealth() {
    const { data, error } = await client.GET("/api/v1/check/health");
    if (error) throw error;
    return data;
  },

  /**
   * Obtiene información del servidor y el entorno.
   */
  async getServerInfo() {
    const { data, error } = await client.GET("/api/v1/check/server-info");
    if (error) throw error;
    return data;
  }
};