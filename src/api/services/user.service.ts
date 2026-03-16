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
};