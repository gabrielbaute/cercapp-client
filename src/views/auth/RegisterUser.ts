import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { AuthService } from '../../api/services/auth.service';
import type { components } from '../../api/v1/schema';

// Importamos el tipo exacto para estar blindados
type UserCreate = components["schemas"]["UserCreate"];
type DocumentType = components["schemas"]["DocumentType"];

export function useRegisterUser() {
  const router = useRouter();

  // Estados de la UI
  const isLoading = ref(false);
  const errorMessage = ref('');
  const successMessage = ref('');

  // Formulario reactivo ampliado para KYC Riguroso
  const form = reactive({
    first_name: '',
    middle_name: '',
    last_name: '',
    last_name_2: '',
    birth_date: '',
    document_type: 'V' as DocumentType,
    document_number: '',
    phone_number: '',
    email: '',
    nationality: '', // Agregado
    country_residence: '', // Agregado
    password: ''
  });

  const submitRegister = async () => {
    // Validación básica rápida (Actualizada con KYC)
    if (!form.first_name || !form.last_name || !form.email || !form.password || !form.document_number || !form.birth_date || !form.nationality || !form.country_residence) {
      errorMessage.value = 'Por favor, completa todos los campos obligatorios del perfil.';
      return;
    }

    if (form.password.length < 8) {
      errorMessage.value = 'La contraseña debe tener al menos 8 caracteres.';
      return;
    }

    isLoading.value = true;
    errorMessage.value = '';
    successMessage.value = '';

    try {
      // Construimos el payload tipado, omitiendo strings vacíos en campos opcionales
      const payload: UserCreate = {
        first_name: form.first_name,
        middle_name: form.middle_name || undefined,
        last_name: form.last_name,
        last_name_2: form.last_name_2 || undefined,
        birth_date: form.birth_date,
        document_type: form.document_type,
        document_number: form.document_number,
        phone_number: form.phone_number || undefined,
        email: form.email,
        nationality: form.nationality,
        country_residence: form.country_residence,
        password: form.password,
        user_type: 'USER',
        status: 'ACTIVE'
      };

      await AuthService.registerUser(payload);
      
      successMessage.value = '¡Registro exitoso! Redirigiendo al inicio de sesión...';
      
      // Esperamos 2 segundos para que el usuario lea el mensaje y lo enviamos al login
      setTimeout(() => {
        router.push({ name: 'Login' });
      }, 2000);

    } catch (error: any) {
      console.error("Error en registro:", error);
      errorMessage.value = error?.data?.detail?.[0]?.msg || 'Ocurrió un error al registrar el usuario. Revisa los datos ingresados.';
    } finally {
      isLoading.value = false;
    }
  };

  return {
    form,
    isLoading,
    errorMessage,
    successMessage,
    submitRegister
  };
}