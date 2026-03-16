import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { CompanyAdminService } from '../../api/services/company-admin.service';
import type { components } from '../../api/v1/schema';

type CompanyResponse = components["schemas"]["CompanyResponse"];

export default function useCompanyDetail() {
  const route = useRoute();
  const companyId = route.params.id as string;

  const company = ref<CompanyResponse | null>(null);
  const users = ref<any[]>([]); // Lista de usuarios afiliados a la empresa
  const isLoading = ref(true);
  const errorMessage = ref('');

  const fetchCompanyData = async () => {
    isLoading.value = true;
    errorMessage.value = '';
    
    try {
      // Ejecutamos ambas peticiones en paralelo para mayor rapidez
      const [companyData, usersData]: [any, any] = await Promise.all([
        CompanyAdminService.getCompanyById(companyId),
        CompanyAdminService.listCompanyUsersAdmin(companyId)
      ]);

      company.value = companyData;
      
      // Adaptación a prueba de balas por si la API devuelve el array directo o un objeto con "users"
      users.value = Array.isArray(usersData) ? usersData : (usersData?.users || usersData?.items || []);

    } catch (error) {
      errorMessage.value = "Error al cargar el expediente de la empresa.";
      console.error(error);
    } finally {
      isLoading.value = false;
    }
  };

  onMounted(fetchCompanyData);

  return { company, users, isLoading, errorMessage };
}