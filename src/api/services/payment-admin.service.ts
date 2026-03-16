import client from '../client';
import type { components } from '../v1/schema';

type PaymentResponse = components["schemas"]["PaymentResponse"];
type PaymentAdminListResponse = components["schemas"]["PaymentAdminListResponse"];
type PaymentListResponse = components["schemas"]["PaymentListResponse"];

export const PaymentAdminService = {
  /**
   * Lista todos los pagos del sistema (Paginado)
   * GET /api/v1/payments/user/
   */
  async getAllPayments(skip = 0, limit = 100): Promise<PaymentAdminListResponse> {
    const { data, error } = await client.GET("/api/v1/payments/users/", {
      params: { query: { skip, limit } }
    });
    if (error) throw error;
    return data;
  },

  /**
   * Lista pagos de un usuario específico
   * GET /api/v1/payments/user/{user_id}
   */
  async getPaymentsByUserId(userId: string): Promise<PaymentAdminListResponse> {
    const { data, error } = await client.GET("/api/v1/payments/users/{user_id}", {
      params: { path: { user_id: userId } }
    });
    if (error) throw error;
    return data;
  },

  /**
   * Lista pagos de un plan específico
   * GET /api/v1/payments/user/{investment_plan_id}
   */
  async getPaymentsByPlanId(planId: string): Promise<PaymentListResponse> {
    const { data, error } = await client.GET("/api/v1/payments/users/{investment_plan_id}/plan", {
      params: { path: { investment_plan_id: planId } }
    });
    if (error) throw error;
    return data;
  },


  /**
   * Obtener un pago específico por su ID
   * PATCH /api/v1/payments/users/{payment_id}
   */
  async updatePayment(paymentId: string, updateData: components["schemas"]["PaymentUpdate"]): Promise<PaymentResponse> {
    const { data, error } = await client.PATCH("/api/v1/payments/users/{payment_id}", {
      params: { path: { payment_id: paymentId } },
      body: updateData
    });
    if (error) throw error;
    return data as PaymentResponse;
  },

  /**
   * Aprobar pago (Status -> COMPLETED)
   * PATCH /api/v1/payments/user/{payment_id}/accept
   */
  async acceptPayment(paymentId: string): Promise<PaymentResponse> {
    const { data, error } = await client.PATCH("/api/v1/payments/users/{payment_id}/accept", {
      params: { path: { payment_id: paymentId } }
    });
    if (error) throw error;
    return data;
  },

  /**
   * Rechazar pago
   * PATCH /api/v1/payments/user/{payment_id}/reject
   */
  async rejectPayment(paymentId: string): Promise<PaymentResponse> {
    const { data, error } = await client.PATCH("/api/v1/payments/users/{payment_id}/reject", {
      params: { path: { payment_id: paymentId } }
    });
    if (error) throw error;
    return data;
  },

  /**
   * Reembolsar pago
   * PATCH /api/v1/payments/user/{payment_id}/refund
   */
  async refundPayment(paymentId: string): Promise<PaymentResponse> {
    const { data, error } = await client.PATCH("/api/v1/payments/users/{payment_id}/refund", {
      params: { path: { payment_id: paymentId } }
    });
    if (error) throw error;
    return data;
  },

  /**
   * Eliminar registro de pago
   * DELETE /api/v1/payments/user/{payment_id}
   */
  async deletePayment(paymentId: string): Promise<void> {
    const { error } = await client.DELETE("/api/v1/payments/users/{payment_id}", {
      params: { path: { payment_id: paymentId } }
    });
    if (error) throw error;
  }
};