import { ref, computed, onMounted } from 'vue';
import { useAuthStore } from '../../store/auth.store';
import { IncidenceService } from '../../api/services/incidence.service';
import type { components } from '../../api/v1/schema';

type Incidence = components["schemas"]["IncidenceResponse"];

export default function useMyIncidences() {
  const authStore = useAuthStore();
  
  const incidences = ref<Incidence[]>([]);
  const isLoading = ref(true);
  const errorMessage = ref('');

  const currentFilter = ref('ACTIVE'); 

  const filteredIncidences = computed(() => {
    if (currentFilter.value === 'ACTIVE') {
      return incidences.value.filter(i => i.status !== 'CANCELLED' && i.status !== 'RESOLVED');
    }
    if (currentFilter.value === 'ALL') {
      return incidences.value;
    }
    return incidences.value.filter(i => i.status === currentFilter.value); 
  });

  const loadIncidences = async () => {
    isLoading.value = true;
    try {
      if (authStore.isCompany) {
        const data = await IncidenceService.getMyCompanyIncidences();
        incidences.value = data.incidences_companies || [];
      } else {
        const data = await IncidenceService.getMyUserIncidences();
        incidences.value = data.incidences || [];
      }
    } catch (error) {
      console.error("Error cargando incidencias:", error);
      errorMessage.value = "No se pudo cargar tu historial de soporte.";
    } finally {
      isLoading.value = false;
    }
  };

  const cancelIncidence = async (incidenceId: string) => {
    const confirmacion = window.confirm("¿Seguro que deseas cancelar este ticket de soporte?");
    if (!confirmacion) return;

    try {
      if (authStore.isCompany) {
        await IncidenceService.cancelCompanyIncidence(incidenceId);
      } else {
        await IncidenceService.cancelUserIncidence(incidenceId);
      }
      await loadIncidences();
    } catch (error: any) {
      console.error("Error al cancelar:", error);
      alert("No se pudo cancelar el ticket.");
    }
  };

  onMounted(() => {
    loadIncidences();
  });

  return {
    incidences,
    filteredIncidences,
    currentFilter,
    isLoading,
    errorMessage,
    cancelIncidence
  };
}