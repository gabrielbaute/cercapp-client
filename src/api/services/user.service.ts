import client from "../client";
import type { components } from "../v1/schema";

// Extraemos los tipos necesarios desde tu schema
export type UserUpdate = components["schemas"]["UserUpdate"]; //
export type UserResponse = components["schemas"]["UserResponse"]; // Lo exportamos para usarlo en la UI

export const UserService = {
  // ==========================================
  // RUTAS DEL USUARIO AUTENTICADO (Mi Perfil)
  // ==========================================

  async getMyProfile() {
    const { data, error } = await client.GET("/api/v1/users/me"); //
    if (error) throw error;
    return data;
  },

  async updateMyProfile(updateData: UserUpdate) {
    const { data, error } = await client.PATCH("/api/v1/users/me", { //
      body: updateData,
    });
    if (error) throw error;
    return data;
  },

  async deactivateMyAccount() {
    const { data, error } = await client.DELETE("/api/v1/users/me"); //
    if (error) throw error;
    return data;
  },

  // ==========================================
  // RUTAS DE ADMINISTRADOR
  // ==========================================

  async listAllUsers() {
    const { data, error } = await client.GET("/api/v1/users/"); //
    if (error) throw error;
    return data;
  },

  async getUserById(userId: string) {
    // Fíjate cómo openapi-fetch maneja las variables en la URL (path parameters)
    const { data, error } = await client.GET("/api/v1/users/{user_id}", { //
      params: {
        path: { user_id: userId },
      },
    });
    if (error) throw error;
    return data;
  },

  async blockUser(userId: string) {
    const { data, error } = await client.PATCH("/api/v1/users/{user_id}/block", { //
      params: {
        path: { user_id: userId },
      },
    });
    if (error) throw error;
    return data;
  },

  async hardDeleteUser(userId: string) {
    const { data, error } = await client.DELETE("/api/v1/users/{user_id}", { //
      params: {
        path: { user_id: userId },
      },
    });
    if (error) throw error;
    return data; // Aquí retornará null o undefined porque el backend devuelve 204 (No Content)
  }
};