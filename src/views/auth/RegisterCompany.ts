import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { AuthService } from '../../api/services/auth.service';
import type { components } from '../../api/v1/schema';

// Importamos los tipos
type CompanyCreate = components["schemas"]["CompanyCreate"];
type DocumentType = components["schemas"]["DocumentType"];

export function useRegisterCompany() {
  const router = useRouter();

  const isLoading = ref(false);
  const errorMessage = ref('');
  const successMessage = ref('');

  // Formulario reactivo adaptado a la Empresa
  const form = reactive({
    business_name: '',
    document_type: 'J' as DocumentType, // Por defecto 'J' de Jurídico
    document_number: '',
    email: '',
    phone_number: '',
    password: ''
  });

  const submitRegister = async () => {
    // Validación de campos principales
    if (!form.business_name || !form.document_number || !form.email || !form.password) {
      errorMessage.value = 'Por favor, completa los campos obligatorios (*).';
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
      const payload: CompanyCreate = {
        business_name: form.business_name,
        document_type: form.document_type,
        document_number: form.document_number,
        email: form.email,
        phone_number: form.phone_number || null, // Opcional en el backend
        user_type: 'COMPANY',
        status: 'ACTIVE',
        password: form.password,
      };

      await AuthService.registerCompany(payload);
      
      successMessage.value = '¡Empresa registrada con éxito! Redirigiendo...';
      
      setTimeout(() => {
        router.push({ name: 'Login' });
      }, 2000);

    } catch (error: any) {
      console.error("Error en registro corporativo:", error);
      errorMessage.value = error?.data?.detail?.[0]?.msg || 'Ocurrió un error al registrar la empresa. Verifica los datos.';
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