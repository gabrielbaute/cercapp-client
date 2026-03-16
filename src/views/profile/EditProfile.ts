import { ref, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../store/auth.store';
import { UserService } from '../../api/services/user.service';
import { CompanyService } from '../../api/services/company.service';
import type { components } from '../../api/v1/schema';

type UserUpdate = components["schemas"]["UserUpdate"];
type CompanyUpdate = components["schemas"]["CompanyUpdate"];

export default function useEditProfile() {
  const router = useRouter();
  const authStore = useAuthStore();

  const isLoading = ref(false);
  const errorMessage = ref('');

  // Formulario unificado expandido con todos los campos
  const form = reactive({
    // Comunes
    phone_number: '',
    address: '',
    
    // Específicos Usuario Natural
    first_name: '',
    middle_name: '',
    last_name: '',
    second_last_name: '',
    birth_date: '',
    nationality: '',
    country_of_residence: '',
    
    // Específicos Empresa
    business_name: '',
    website: '', 
    industry: '' 
  });

  const immutableData = reactive({
    email: '',
    document_type: '',
    document_number: ''
  });

  const loadCurrentData = () => {
    if (authStore.isCompany && authStore.company) {
      form.phone_number = authStore.company.phone_number || '';
      form.address = (authStore.company as any).address || ''; 
      form.business_name = authStore.company.business_name || '';
      form.website = (authStore.company as any).website || '';
      
      immutableData.email = authStore.company.email;
      immutableData.document_type = authStore.company.document_type;
      immutableData.document_number = authStore.company.document_number;
    } else if (authStore.user) {
      form.phone_number = authStore.user.phone_number || '';
      form.address = (authStore.user as any).address || '';
      
      // Nombres y apellidos
      form.first_name = authStore.user.first_name || '';
      form.middle_name = (authStore.user as any).middle_name || '';
      form.last_name = authStore.user.last_name || '';
      form.second_last_name = (authStore.user as any).second_last_name || '';
      
      // Demográficos
      form.birth_date = authStore.user.birth_date || '';
      form.nationality = (authStore.user as any).nationality || '';
      form.country_of_residence = (authStore.user as any).country_of_residence || '';
      
      immutableData.email = authStore.user.email;
      immutableData.document_type = authStore.user.document_type;
      immutableData.document_number = authStore.user.document_number;
    }
  };

  const submitUpdate = async () => {
    isLoading.value = true;
    errorMessage.value = '';

    try {
      if (authStore.isCompany) {
        const payload: CompanyUpdate = {
          business_name: form.business_name,
          phone_number: form.phone_number || null,
          // (Si tu CompanyUpdate acepta address o website, van aquí)
        };
        await CompanyService.updateMyCompanyProfile(payload);
      } else {
        const payload: UserUpdate = {
          first_name: form.first_name,
          middle_name: form.middle_name || null,
          last_name: form.last_name,
          second_last_name: form.second_last_name || null,
          birth_date: form.birth_date,
          nationality: form.nationality || null,
          country_of_residence: form.country_of_residence || null,
          phone_number: form.phone_number || null,
        };
        await UserService.updateMyProfile(payload);
      }

      await authStore.fetchProfile();
      router.push({ name: 'Profile' });
    } catch (error: any) {
      console.error("Error al actualizar perfil:", error);
      errorMessage.value = error?.data?.detail?.[0]?.msg || "No se pudieron guardar los cambios.";
    } finally {
      isLoading.value = false;
    }
  };

  onMounted(() => {
    loadCurrentData();
  });

  return {
    authStore,
    form,
    immutableData,
    isLoading,
    errorMessage,
    submitUpdate
  };
}