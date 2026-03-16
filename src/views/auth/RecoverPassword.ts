import { ref } from 'vue';
import { AuthService } from '../../api/services/auth.service';

export function useRecoverPassword() {
  const email = ref('');
  const isLoading = ref(false);
  const errorMessage = ref('');
  const successMessage = ref('');

  const submitRecover = async () => {
    if (!email.value) {
      errorMessage.value = 'Por favor, ingresa tu correo electrónico.';
      return;
    }

    isLoading.value = true;
    errorMessage.value = '';
    successMessage.value = '';

    try {
      // Llamada al endpoint de recuperar contraseña
      await AuthService.recoverPassword({ email: email.value });
      
      // Mensaje genérico de éxito por razones de seguridad (evita la enumeración de usuarios)
      successMessage.value = 'Si el correo está registrado, en breve recibirás las instrucciones para restablecer tu contraseña.';
      email.value = ''; // Limpiamos el campo
    } catch (error: any) {
      console.error("Error al solicitar recuperación:", error);
      errorMessage.value = 'Ocurrió un error al intentar enviar el correo. Inténtalo más tarde.';
    } finally {
      isLoading.value = false;
    }
  };

  return {
    email,
    isLoading,
    errorMessage,
    successMessage,
    submitRecover
  };
}