import client from "../client";
import type { components } from "../v1/schema";

export type PaymentCompanyCreate = components["schemas"]["PaymentCompanyCreate"]; //
export type PaymentCompanyResponse = components["schemas"]["PaymentCompanyResponse"]; //

export const PaymentCompanyService = {
  // ==========================================
  // RUTAS DE LA EMPRESA AUTENTICADA
  // ==========================================

  async getMyCompanyPayments() {
    const { data, error } = await client.GET("/api/v1/payments/companies/me"); //
    if (error) throw error;
    return data;
  },

  async createMyCompanyPayment(paymentData: PaymentCompanyCreate) {
    const { data, error } = await client.POST("/api/v1/payments/companies/me", { //
      body: paymentData,
    });
    if (error) throw error;
    return data;
  },

  async getMyCompanyPaymentById(paymentId: string) {
    const { data, error } = await client.GET("/api/v1/payments/companies/me/{payment_id}", { //
      params: { path: { payment_id: paymentId } },
    });
    if (error) throw error;
    return data;
  },

  async cancelMyCompanyPayment(paymentId: string) {
    const { data, error } = await client.PATCH("/api/v1/payments/companies/me/{payment_id}/cancel", { //
      params: { path: { payment_id: paymentId } },
    });
    if (error) throw error;
    return data;
  },

  // ==========================================
  // RUTAS DE ADMINISTRADOR
  // ==========================================

  async listAllCompanyPayments() {
    const { data, error } = await client.GET("/api/v1/payments/companies/"); //
    if (error) throw error;
    return data;
  },

  async acceptPayment(paymentId: string) {
    const { data, error } = await client.PATCH("/api/v1/payments/companies/{payment_id}/accept", { //
      params: { path: { payment_id: paymentId } },
    });
    if (error) throw error;
    return data;
  },

  async rejectPayment(paymentId: string) {
    const { data, error } = await client.PATCH("/api/v1/payments/companies/{payment_id}/reject", { //
      params: { path: { payment_id: paymentId } },
    });
    if (error) throw error;
    return data;
  },

  async refundPayment(paymentId: string) {
    const { data, error } = await client.PATCH("/api/v1/payments/companies/{payment_id}/refund", { //
      params: { path: { payment_id: paymentId } },
    });
    if (error) throw error;
    return data;
  },

  async deletePayment(paymentId: string) {
    const { data, error } = await client.DELETE("/api/v1/payments/companies/{payment_id}", { //
      params: { path: { payment_id: paymentId } },
    });
    if (error) throw error;
    return data;
  }
};