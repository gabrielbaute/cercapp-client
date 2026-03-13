import client from "../client";
import type { components } from "../v1/schema";

// Extraemos los tipos
export type PaymentCreate = components["schemas"]["PaymentCreate"]; //
export type PaymentResponse = components["schemas"]["PaymentResponse"]; // Lo exportamos para usarlo en la UI

export const PaymentUserService = {
  // ==========================================
  // RUTAS DEL USUARIO AUTENTICADO
  // ==========================================

  async getMyPayments() {
    const { data, error } = await client.GET("/api/v1/payments/users/me"); //
    if (error) throw error;
    return data;
  },

  async createMyPayment(paymentData: PaymentCreate) {
    const { data, error } = await client.POST("/api/v1/payments/users/me", { //
      body: paymentData,
    });
    if (error) throw error;
    return data;
  },

  async getMyPlanPayments(planId: string) {
    const { data, error } = await client.GET("/api/v1/payments/users/me/plan/{plan_id}", { //
      params: { path: { plan_id: planId } },
    });
    if (error) throw error;
    return data;
  },

  async getMyPaymentById(paymentId: string) {
    const { data, error } = await client.GET("/api/v1/payments/users/me/{payment_id}", { //
      params: { path: { payment_id: paymentId } },
    });
    if (error) throw error;
    return data;
  },

  async cancelMyPayment(paymentId: string) {
    const { data, error } = await client.PATCH("/api/v1/payments/users/me/{payment_id}/cancel", { //
      params: { path: { payment_id: paymentId } },
    });
    if (error) throw error;
    return data;
  },

  // ==========================================
  // RUTAS DE ADMINISTRADOR
  // ==========================================

  async listAllUserPayments() {
    const { data, error } = await client.GET("/api/v1/payments/users/"); //
    if (error) throw error;
    return data;
  },

  async acceptPayment(paymentId: string) {
    const { data, error } = await client.PATCH("/api/v1/payments/users/{payment_id}/accept", { //
      params: { path: { payment_id: paymentId } },
    });
    if (error) throw error;
    return data;
  },

  async rejectPayment(paymentId: string) {
    const { data, error } = await client.PATCH("/api/v1/payments/users/{payment_id}/reject", { //
      params: { path: { payment_id: paymentId } },
    });
    if (error) throw error;
    return data;
  },

  async refundPayment(paymentId: string) {
    const { data, error } = await client.PATCH("/api/v1/payments/users/{payment_id}/refund", { //
      params: { path: { payment_id: paymentId } },
    });
    if (error) throw error;
    return data;
  },

  async deletePayment(paymentId: string) {
    const { data, error } = await client.DELETE("/api/v1/payments/users/{payment_id}", { //
      params: { path: { payment_id: paymentId } },
    });
    if (error) throw error;
    return data;
  }
};