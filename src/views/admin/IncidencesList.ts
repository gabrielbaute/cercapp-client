import { ref, reactive, computed, onMounted } from 'vue';
import { IncidencesAdminService } from '../../api/services/incidences-admin.service';
import type { components } from '../../api/v1/schema';

type IncidenceAdminResponse = components["schemas"]["IncidenceAdminResponse"];

export default function useIncidencesList() {
  const incidences = ref<IncidenceAdminResponse[]>([]);
  const isLoading = ref(true);
  const errorMessage = ref('');

  const pagination = reactive({ page: 1, limit: 50, total: 0 });
  const totalPages = computed(() => Math.ceil(pagination.total / pagination.limit));

  const filters = reactive({
    status: '',
    email: ''
  });

  const fetchIncidences = async () => {
    isLoading.value = true;
    errorMessage.value = '';
    try {
      const skip = (pagination.page - 1) * pagination.limit;
      const data: any = await IncidencesAdminService.listAllIncidences(skip, pagination.limit);
      
      console.log("Respuesta cruda de incidencias:", data); // Para auditar en F12

      // Lógica a prueba de balas: Soporta array directo o el objeto con count
      if (Array.isArray(data)) {
        incidences.value = data;
        pagination.total = data.length;
      } else {
        incidences.value = data?.incidences || [];
        pagination.total = data?.count || 0;
      }

    } catch (error) {
      errorMessage.value = "Error de sincronización con la base de datos de soporte.";
      console.error(error);
    } finally {
      isLoading.value = false;
    }
  };

  const filteredIncidences = computed(() => {
    return incidences.value.filter(inc => {
      const matchStatus = !filters.status || inc.status === filters.status;
      const matchEmail = !filters.email || inc.user_email?.toLowerCase().includes(filters.email.toLowerCase());
      return matchStatus && matchEmail;
    });
  });

  const changePage = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages.value) {
      pagination.page = newPage;
      fetchIncidences();
    }
  };

  onMounted(fetchIncidences);

  return {
    incidences, filteredIncidences, filters, isLoading, errorMessage,
    pagination, totalPages, changePage, fetchIncidences
  };
}