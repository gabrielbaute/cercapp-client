import client from '../client';
import type { components } from '../v1/schema';

type UserResponse = components["schemas"]["UserResponse"];
type UserListResponse = components["schemas"]["UserListResponse"];
type UserUpdate = components["schemas"]["UserUpdate"];

export const UserAdminService = {
  // Listar usuarios paginados
  async getAllUsers(skip = 0, limit = 100): Promise<UserListResponse> {
    const { data, error } = await client.GET("/api/v1/users/", {
      params: { query: { skip, limit } }
    });
    if (error) throw error;
    return data as UserListResponse;
  },

  // Obtener un usuario por ID
  async getUserById(userId: string): Promise<UserResponse> {
    const { data, error } = await client.GET("/api/v1/users/{user_id}", {
      params: { path: { user_id: userId } }
    });
    if (error) throw error;
    return data as UserResponse;
  },

  // Actualizar datos del usuario (Para Activar/Desactivar)
  async updateUser(userId: string, updateData: UserUpdate): Promise<UserResponse> {
    const { data, error } = await client.PATCH("/api/v1/users/{user_id}", {
      params: { path: { user_id: userId } },
      body: updateData
    });
    if (error) throw error;
    return data as UserResponse;
  },

  // Bloquear usuario (Toggle de seguridad)
  async blockUser(userId: string): Promise<UserResponse> {
    const { data, error } = await client.PATCH("/api/v1/users/{user_id}/block", {
      params: { path: { user_id: userId } }
    });
    if (error) throw error;
    return data as UserResponse;
  },

  // Eliminar usuario permanentemente
  async deleteUser(userId: string): Promise<void> {
    const { error } = await client.DELETE("/api/v1/users/{user_id}", {
      params: { path: { user_id: userId } }
    });
    if (error) throw error;
  }
};