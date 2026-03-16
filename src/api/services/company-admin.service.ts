import client from '../client';
import type { components } from '../v1/schema';

// Extraemos el tipo para la actualización
export type CompanyUpdate = components["schemas"]["CompanyUpdate"]; //
export type CompanyResponse = components["schemas"]["CompanyResponse"]; // Lo exportamos para usarlo en la UI

export const CompanyAdminService = {
  // ==========================================
  // RUTAS DE ADMINISTRADOR
  // ==========================================

  async listAllCompanies() {
    const { data, error } = await client.GET("/api/v1/companies/"); //
    if (error) throw error;
    return data;
  },

  async getCompanyById(companyId: string) {
    const { data, error } = await client.GET("/api/v1/companies/{company_id}", { //
      params: {
        path: { company_id: companyId },
      },
    });
    if (error) throw error;
    return data;
  },

  async listCompanyUsersAdmin(companyId: string) {
    const { data, error } = await client.GET("/api/v1/companies/{company_id}/users", { //
      params: {
        path: { company_id: companyId },
      },
    });
    if (error) throw error;
    return data;
  },

  async blockCompany(companyId: string) {
    const { data, error } = await client.PATCH("/api/v1/companies/{company_id}/block", { //
      params: {
        path: { company_id: companyId },
      },
    });
    if (error) throw error;
    return data;
  },

  async hardDeleteCompany(companyId: string) {
    const { data, error } = await client.DELETE("/api/v1/companies/{company_id}", { //
      params: {
        path: { company_id: companyId },
      },
    });
    if (error) throw error;
    return data; // Retorna null/undefined por el status 204
  }
};