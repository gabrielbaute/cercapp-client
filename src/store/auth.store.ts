import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { AuthService } from '../api/services/auth.service';
import { UserService } from '../api/services/user.service';
import { CompanyService } from '../api/services/company.service';
import type { components } from '../api/v1/schema';

// Importamos los tipos para que TypeScript nos ayude
type UserLogin = components["schemas"]["UserLogin"]; //
type UserResponse = components["schemas"]["UserResponse"]; //
type CompanyResponse = components["schemas"]["CompanyResponse"]; //

export const useAuthStore = defineStore('auth', () => {
  // ==========================================
  // 1. STATE (Tus variables privadas en Flutter)
  // ==========================================
  const token = ref<string | null>(localStorage.getItem('token'));
  const user = ref<UserResponse | null>(null);
  const company = ref<CompanyResponse | null>(null);
  
  // ==========================================
  // 2. GETTERS (Tus getters calculados)
  // ==========================================
  const isAuthenticated = computed(() => !!token.value);
  const isCompany = computed(() => !!company.value || user.value?.user_type === 'COMPANY'); //
  const isAdmin = computed(() => user.value?.user_type === 'ADMIN'); //

  // ==========================================
  // 3. ACTIONS (Tus métodos de ChangeNotifier)
  // ==========================================
  
  async function login(credentials: UserLogin) {
    // 1. Llamamos al servicio (Data Layer)
    const data = await AuthService.login(credentials);
    
    // 2. Guardamos el token en memoria y en almacenamiento persistente
    token.value = data.access_token; //
    localStorage.setItem('token', data.access_token); //

    // 3. Cargamos el perfil inmediatamente después de loguear
    await fetchProfile();
  }

  async function fetchProfile() {
    if (!token.value) return;

    try {
      // Como el login es unificado, no sabemos a priori si es User o Company.
      // Intentamos primero buscar como Usuario:
      const userData = await UserService.getMyProfile();
      user.value = userData;
      company.value = null; // Limpiamos por si acaso
    } catch (error: any) {
      // Si da un error (ej. 404 No encontrado o 403), asumimos que podría ser una Empresa
      try {
        const companyData = await CompanyService.getMyCompanyProfile();
        company.value = companyData;
        user.value = null;
      } catch (companyError) {
        // Si ambos fallan, el token es inválido o expiró
        console.error("No se pudo cargar el perfil del usuario ni de la empresa.");
        logout();
      }
    }
  }

  function logout() {
    token.value = null;
    user.value = null;
    company.value = null;
    localStorage.removeItem('token');
  }

  // Exponemos lo que queremos que las pantallas puedan leer/ejecutar
  return { 
    token, 
    user, 
    company, 
    isAuthenticated, 
    isCompany, 
    isAdmin, 
    login, 
    logout, 
    fetchProfile 
  };
});