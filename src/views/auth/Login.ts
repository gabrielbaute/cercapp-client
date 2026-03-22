import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../store/auth.store';

export function useLogin() {
  const authStore = useAuthStore();
  const router = useRouter();

  // Variables reactivas (Estado local de la pantalla)
  const email = ref('');
  const password = ref('');
  const isLoading = ref(false);
  const errorMessage = ref('');

  const submitLogin = async () => {
    // Validación básica de UI
    if (!email.value || !password.value) {
      errorMessage.value = 'Por favor, completa todos los campos.';
      return;
    }

    isLoading.value = true;
    errorMessage.value = '';

    try {
      // Llamamos a la acción del store (que a su vez llama a la API)
      await authStore.login({ email: email.value, password: password.value });
      
      // Si fue exitoso, el router nos lleva al dashboard
      setTimeout(() => {
        // Redirección inteligente basada en el rol
        if (authStore.isAdmin) {
          router.push({ name: 'AdminDashboard' });
        } else if (authStore.isCompany) {
          router.push({ name: 'CompanyUsers' }); // O el dashboard que le corresponda a la empresa
        } else {
          router.push({ name: 'Dashboard' }); // El dashboard del usuario normal
        }
      }, 1500);
    } catch (error: any) {
      console.error("Error en login:", error);
      errorMessage.value = 'Credenciales inválidas o error de conexión.';
    } finally {
      isLoading.value = false;
    }
  };

  return {
    email,
    password,
    isLoading,
    errorMessage,
    submitLogin
  };
}