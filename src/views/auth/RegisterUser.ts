import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { AuthService } from '../../api/services/auth.service';
import type { components } from '../../api/v1/schema';

type UserCreate = components["schemas"]["UserCreate"];
type DocumentType = components["schemas"]["DocumentType"];

export function useRegisterUser() {
  const router = useRouter();

  // ESTADO DEL FLUJO: Formulario -> KYC
  const currentStep = ref<'FORM' | 'KYC'>('FORM');
  
  const isLoading = ref(false);
  const errorMessage = ref('');
  const successMessage = ref('');

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
    nationality: '', 
    country_residence: '', 
    password: ''
  });

  // PASO 1: Validamos el formulario y avanzamos al KYC
  const validateAndProceed = () => {
    if (!form.first_name || !form.last_name || !form.email || !form.password || !form.document_number || !form.birth_date || !form.nationality || !form.country_residence) {
      errorMessage.value = 'Por favor, completa todos los campos obligatorios del perfil.';
      return;
    }

    if (form.password.length < 8) {
      errorMessage.value = 'La contraseña debe tener al menos 8 caracteres.';
      return;
    }

    // Si todo está correcto, ocultamos el formulario y mostramos el KYC
    errorMessage.value = '';
    currentStep.value = 'KYC';
  };

  // PASO 2: Envío final a la API (Recibe el estatus dinámico desde el componente KYC)
  const submitRegister = async (finalStatus: 'ACTIVE' | 'PENDING_KYC') => {
    isLoading.value = true;
    errorMessage.value = '';
    successMessage.value = '';

    try {
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
        status: finalStatus // 'ACTIVE' si pasó el KYC, 'PENDING_KYC' si falló o lo omitió
      };

      await AuthService.registerUser(payload);
      
      successMessage.value = finalStatus === 'ACTIVE' 
        ? '¡Registro y verificación biométrica exitosos! Redirigiendo...'
        : 'Perfil creado. Tu verificación biométrica quedó pendiente.';
      
      setTimeout(() => {
        router.push({ name: 'Login' });
      }, 2500);

    } catch (error: any) {
      console.error("Error en registro:", error);
      errorMessage.value = error?.data?.detail?.[0]?.msg || 'Ocurrió un error al registrar el usuario en el servidor.';
      currentStep.value = 'FORM'; // Lo devolvemos al formulario por si hubo error de API (ej. Email duplicado)
    } finally {
      isLoading.value = false;
    }
  };

  return {
    form,
    currentStep,
    isLoading,
    errorMessage,
    successMessage,
    validateAndProceed,
    submitRegister
  };
}