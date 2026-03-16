import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { AuthService } from '../../api/services/auth.service';

export function useResetPassword() {
  const route = useRoute(); // Para leer la URL
  const router = useRouter(); // Para navegar

  const token = ref('');
  const newPassword = ref('');
  const confirmPassword = ref(''); // Extra solo para UI
  
  const isLoading = ref(false);
  const errorMessage = ref('');
  const successMessage = ref('');

  // Al cargar la pantalla, extraemos el token de la URL
  onMounted(() => {
    const queryToken = route.query.token as string;
    if (queryToken) {
      token.value = queryToken;
    } else {
      errorMessage.value = 'Enlace inválido. Faltan los parámetros de seguridad (Token).';
    }
  });

  const submitReset = async () => {
    if (!token.value) {
      errorMessage.value = 'No se puede procesar la solicitud sin un token de seguridad.';
      return;
    }

    if (!newPassword.value || !confirmPassword.value) {
      errorMessage.value = 'Por favor, completa ambas contraseñas.';
      return;
    }

    if (newPassword.value !== confirmPassword.value) {
      errorMessage.value = 'Las contraseñas no coinciden.';
      return;
    }

    if (newPassword.value.length < 8) {
      errorMessage.value = 'La contraseña debe tener al menos 8 caracteres.';
      return;
    }

    isLoading.value = true;
    errorMessage.value = '';
    successMessage.value = '';

    try {
      // Llamamos a la API con la nueva contraseña y el token
      await AuthService.resetPassword({
        token: token.value,
        new_password: newPassword.value
      });

      successMessage.value = '¡Tu contraseña ha sido actualizada exitosamente!';
      
      setTimeout(() => {
        router.push({ name: 'Login' });
      }, 2500);

    } catch (error: any) {
      console.error("Error al restablecer:", error);
      errorMessage.value = error?.data?.detail?.[0]?.msg || 'El enlace ha expirado o no es válido. Solicita uno nuevo.';
    } finally {
      isLoading.value = false;
    }
  };

  return {
    token,
    newPassword,
    confirmPassword,
    isLoading,
    errorMessage,
    successMessage,
    submitReset
  };
}