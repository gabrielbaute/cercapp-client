import { ref, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { UserService } from '../../api/services/user.service';
import { useAuthStore } from '../../store/auth.store';
import type { components } from '../../api/v1/schema';

type UserResponse = components["schemas"]["UserResponse"];

export function useSettings() {
  const router = useRouter();
  const authStore = useAuthStore();
  
  const user = ref<UserResponse | null>(null);
  const isLoading = ref(true);
  const isActionLoading = ref(false);
  const errorMessage = ref('');

  // Control de Modales
  const modals = reactive({
    email: false,
    password: false,
    deactivate: false
  });

  const fetchProfile = async () => {
    isLoading.value = true;
    errorMessage.value = '';
    try {
      const data = await UserService.getMyProfile();
      user.value = data;
    } catch (error) {
      errorMessage.value = "No pudimos cargar tu configuración en este momento.";
    } finally {
      isLoading.value = false;
    }
  };

  // --- ACCIONES DE ACTUALIZACIÓN ---
  const updateEmail = async (newEmail: string) => {
    isActionLoading.value = true;
    try {
      await UserService.updateMyProfile({ email: newEmail });
      modals.email = false;
      await fetchProfile(); // Refrescamos para ver el nuevo correo
    } catch (error) {
      alert("Error al actualizar el correo electrónico.");
    } finally {
      isActionLoading.value = false;
    }
  };

  const updatePassword = async (newPassword: string) => {
    isActionLoading.value = true;
    try {
      await UserService.updateMyProfile({ password: newPassword } as any); // Asumiendo que el endpoint lo soporta
      modals.password = false;
      alert("Contraseña actualizada exitosamente.");
    } catch (error) {
      alert("Error al actualizar la contraseña.");
    } finally {
      isActionLoading.value = false;
    }
  };

  // --- ZONA DE PELIGRO ---
  const confirmDeactivate = () => {
    modals.deactivate = true;
  };

  const executeDeactivation = async () => {
    isActionLoading.value = true;
    try {
      await UserService.deactivateMyAccount();
      modals.deactivate = false;
      
      // Limpiamos sesión y redirigimos
      authStore.logout();
      router.push({ name: 'Login' });
    } catch (error) {
      alert("No se pudo desactivar la cuenta. Contacta a soporte.");
    } finally {
      isActionLoading.value = false;
    }
  };

  onMounted(fetchProfile);

  return {
    user, isLoading, isActionLoading, errorMessage, modals,
    updateEmail, updatePassword, confirmDeactivate, executeDeactivation
  };
}