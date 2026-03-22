import { ref, reactive, computed, onMounted } from 'vue';
import { useAuthStore } from '../../store/auth.store';
import { IncidenceService } from '../../api/services/incidence.service';
import type { components } from '../../api/v1/schema';

type Incidence = components["schemas"]["IncidenceResponse"];

export default function useMyIncidences() {
  const authStore = useAuthStore();
  
  const incidences = ref<Incidence[]>([]);
  const isLoading = ref(true);
  const isActionLoading = ref(false); // Para el spinner del modal
  const errorMessage = ref('');

  const currentFilter = ref('ACTIVE'); 

  // NUEVO: Estado reactivo para el modal de confirmación
  const modal = reactive({
    show: false,
    title: '',
    message: '',
    type: 'warning' as 'danger' | 'warning' | 'info',
    incidenceIdToCancel: '' as string | null
  });

  const filteredIncidences = computed(() => {
    if (currentFilter.value === 'ACTIVE') {
      return incidences.value.filter(i => i.status !== 'CANCELED' && i.status !== 'RESOLVED');
    }
    if (currentFilter.value === 'ALL') {
      return incidences.value;
    }
    return incidences.value.filter(i => i.status === currentFilter.value); 
  });

  const loadIncidences = async () => {
    isLoading.value = true;
    errorMessage.value = '';
    try {
      if (authStore.isCompany) {
        const data: any = await IncidenceService.getMyCompanyIncidences();
        // Solución al TS Error: Buscamos incidencias bajo el nombre correcto
        incidences.value = data.incidences_companies || data.incidences || [];
      } else {
        const data: any = await IncidenceService.getMyUserIncidences();
        incidences.value = data.incidences || [];
      }
    } catch (error) {
      console.error("Error cargando incidencias:", error);
      errorMessage.value = "No se pudo cargar tu historial de soporte.";
    } finally {
      isLoading.value = false;
    }
  };

  // 1. Abrir Modal de Confirmación
  const confirmCancelIncidence = (incidenceId: string) => {
    modal.title = 'Cancelar Ticket';
    modal.message = '¿Seguro que deseas cancelar este ticket de soporte? Si el problema persiste, deberás crear uno nuevo.';
    modal.type = 'warning';
    modal.incidenceIdToCancel = incidenceId;
    modal.show = true;
  };

  // 2. Ejecutar la cancelación
  const executeCancelIncidence = async () => {
    if (!modal.incidenceIdToCancel) return;
    
    isActionLoading.value = true;
    try {
      if (authStore.isCompany) {
        await IncidenceService.cancelCompanyIncidence(modal.incidenceIdToCancel);
      } else {
        await IncidenceService.cancelUserIncidence(modal.incidenceIdToCancel);
      }
      
      modal.show = false;
      modal.incidenceIdToCancel = null;
      await loadIncidences();
    } catch (error: any) {
      console.error("Error al cancelar:", error);
      alert("No se pudo cancelar el ticket.");
    } finally {
      isActionLoading.value = false;
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
    isActionLoading,
    errorMessage,
    modal,
    confirmCancelIncidence,
    executeCancelIncidence
  };
}