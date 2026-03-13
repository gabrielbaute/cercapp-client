import client from "../client";
import type { components } from "../v1/schema";

// 1. Extraemos los tipos de entrada desde el schema generado
type UserLogin = components["schemas"]["UserLogin"]; //
type UserCreate = components["schemas"]["UserCreate"]; //
type CompanyCreate = components["schemas"]["CompanyCreate"]; //
type RecoverPasswordBody = components["schemas"]["Body_recover_password_api_v1_auth_recover_password_post"]; //
type PasswordResetConfirm = components["schemas"]["PasswordResetConfirm"]; //

export const AuthService = {
  
  async login(credentials: UserLogin) {
    const { data, error } = await client.POST("/api/v1/auth/login", { //
      body: credentials,
    });
    if (error) throw error;
    return data; 
  },

  async registerUser(userData: UserCreate) {
    const { data, error } = await client.POST("/api/v1/auth/register/user", { //
      body: userData,
    });
    if (error) throw error;
    return data;
  },

  async registerCompany(companyData: CompanyCreate) {
    const { data, error } = await client.POST("/api/v1/auth/register/company", { //
      body: companyData,
    });
    if (error) throw error;
    return data;
  },

  async recoverPassword(payload: RecoverPasswordBody) {
    const { data, error } = await client.POST("/api/v1/auth/recover-password", { //
      body: payload,
    });
    if (error) throw error;
    return data;
  },

  async resetPassword(payload: PasswordResetConfirm) {
    const { data, error } = await client.POST("/api/v1/auth/reset-password", { //
      body: payload,
    });
    if (error) throw error;
    return data;
  }
};