import client from "../client";
import type { components } from "../v1/schema";

// Extraemos los tipos necesarios para la creación y actualización de planes
export type InvestmentPlanCreate = components["schemas"]["InvestmentPlanCreate"];
export type InvestmentPlanUpdate = components["schemas"]["InvestmentPlanUpdate"];
export type InvestmentPlanResponse = components["schemas"]["InvestmentPlanResponse"];

export const PlanService = {
  // ==========================================
  // RUTAS DEL USUARIO AUTENTICADO (Mis Planes)
  // ==========================================

  async getMyPlans() {
    const { data, error } = await client.GET("/api/v1/plans/me");
    if (error) throw error;
    return data;
  },

  async createMyPlan(planData: InvestmentPlanCreate) {
    const { data, error } = await client.POST("/api/v1/plans/me", {
      body: planData,
    });
    if (error) throw error;
    return data;
  },

  async getMyPlanById(planId: string) {
    const { data, error } = await client.GET("/api/v1/plans/me/{plan_id}", {
      params: {
        path: { plan_id: planId },
      },
    });
    if (error) throw error;
    return data;
  },

  async updateMyPlan(planId: string, updateData: InvestmentPlanUpdate) {
    const { data, error } = await client.PATCH("/api/v1/plans/me/{plan_id}", {
      params: {
        path: { plan_id: planId },
      },
      body: updateData,
    });
    if (error) throw error;
    return data;
  },

  async deactivateMyPlan(planId: string) {
    const { data, error } = await client.PATCH("/api/v1/plans/me/{plan_id}/deactivate", {
      params: {
        path: { plan_id: planId },
      },
    });
    if (error) throw error;
    return data;
  },

  // ==========================================
  // RUTAS DE ADMINISTRADOR
  // ==========================================

  async listAllPlans() {
    const { data, error } = await client.GET("/api/v1/plans/");
    if (error) throw error;
    return data;
  },

  async blockUserPlan(planId: string) {
    const { data, error } = await client.PATCH("/api/v1/plans/{plan_id}/block", {
      params: {
        path: { plan_id: planId },
      },
    });
    if (error) throw error;
    return data;
  },

  async deleteUserPlan(planId: string) {
    const { data, error } = await client.DELETE("/api/v1/plans/{plan_id}", {
      params: {
        path: { plan_id: planId },
      },
    });
    if (error) throw error;
    return data; // Retorna 204 No Content
  }
};