import client from "../client";
import type { components } from "../v1/schema";

// Extraemos el tipo para la actualización
export type CompanyUpdate = components["schemas"]["CompanyUpdate"]; //
export type CompanyResponse = components["schemas"]["CompanyResponse"]; // Lo exportamos para usarlo en la UI

export const CompanyService = {
  // ==========================================
  // RUTAS DE LA COMPAÑÍA AUTENTICADA (Mi Empresa)
  // ==========================================

  async getMyCompanyProfile() {
    const { data, error } = await client.GET("/api/v1/companies/me"); //
    if (error) throw error;
    return data;
  },

  async updateMyCompanyProfile(updateData: CompanyUpdate) {
    const { data, error } = await client.PATCH("/api/v1/companies/me", { //
      body: updateData,
    });
    if (error) throw error;
    return data;
  },

  async deactivateMyCompanyAccount() {
    const { data, error } = await client.DELETE("/api/v1/companies/me"); //
    if (error) throw error;
    return data;
  },

  async listMyUsers() {
    const { data, error } = await client.GET("/api/v1/companies/me/users"); //
    if (error) throw error;
    return data;
  },
};