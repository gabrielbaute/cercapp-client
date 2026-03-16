import client from '../client';
import type { components } from '../v1/schema';

type InvestmentPlanResponse = components["schemas"]["InvestmentPlanResponse"];
type InvestmentPlanAdminListResponse = components["schemas"]["InvestmentPlanAdminListResponse"];
type InvestmentPlanListResponse = components["schemas"]["InvestmentPlanListResponse"];
type InvestmentPlanUpdate = components["schemas"]["InvestmentPlanUpdate"];

export const InvestmentAdminService = {
  /**
   * Obtiene todos los planes del sistema (Paginado)
   * GET /api/v1/plans/
   */
  async getAllPlans(skip = 0, limit = 100): Promise<InvestmentPlanAdminListResponse> {
    const { data, error } = await client.GET("/api/v1/plans/", {
      params: { query: { skip, limit } }
    });
    if (error) throw error;
    return data;
  },

  /**
   * Obtiene los planes de un usuario específico
   * GET /api/v1/plans/{user_id}
   */
  async getPlansByUserId(userId: string): Promise<InvestmentPlanListResponse> {
    const { data, error } = await client.GET("/api/v1/plans/{user_id}", {
      params: { path: { user_id: userId } }
    });
    if (error) throw error;
    return data;
  },

  /** 
   * Obtener un plan específico por su ID
   * GET /api/v1/plans/{plan_id}
  **/
  async getPlanById(planId: string): Promise<InvestmentPlanResponse> {
    const { data, error } = await client.GET("/api/v1/plans/plan/{plan_id}", {
      params: { path: { plan_id: planId } }
    });
    if (error) throw error;
    return data;
  },

  /**
   * Actualiza configuración del plan
   * PATCH /api/v1/plans/{plan_id}
   */
  async updatePlan(planId: string, updateData: InvestmentPlanUpdate): Promise<InvestmentPlanResponse> {
    const { data, error } = await client.PATCH("/api/v1/plans/{plan_id}", {
      params: { path: { plan_id: planId } },
      body: updateData
    });
    if (error) throw error;
    return data;
  },

  /**
   * Bloquea un plan por irregularidades
   * PATCH /api/v1/plans/{plan_id}/block
   */
  async blockPlan(planId: string): Promise<InvestmentPlanResponse> {
    const { data, error } = await client.PATCH("/api/v1/plans/{plan_id}/block", {
      params: { path: { plan_id: planId } }
    });
    if (error) throw error;
    return data;
  },

  /**
   * Elimina un plan (Hard Delete)
   * DELETE /api/v1/plans/{plan_id}
   */
  async deletePlan(planId: string): Promise<void> {
    const { error } = await client.DELETE("/api/v1/plans/{plan_id}", {
      params: { path: { plan_id: planId } }
    });
    if (error) throw error;
  }
};