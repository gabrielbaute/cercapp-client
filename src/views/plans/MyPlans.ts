import { ref, onMounted } from 'vue';
import { PlanService } from '../../api/services/plan.service';
import type { components } from '../../api/v1/schema';

type InvestmentPlan = components["schemas"]["InvestmentPlanResponse"]; //

export default function useMyPlans() {
  const planes = ref<InvestmentPlan[]>([]);
  const isLoading = ref(true);
  const errorMessage = ref('');

  const cargarPlanes = async () => {
    isLoading.value = true;
    try {
      const data = await PlanService.getMyPlans(); //
      
      // Añadimos un console.log por seguridad para ver exactamente qué nos devuelve el backend
      console.log("Respuesta de la API:", data); 
      
      planes.value = data.investment_plans || []; //
    } catch (error) {
      console.error("Error al cargar planes:", error);
      errorMessage.value = "No se pudieron cargar tus planes de inversión.";
    } finally {
      isLoading.value = false;
    }
  };

  onMounted(() => {
    cargarPlanes();
  });

  return {
    planes,
    isLoading,
    errorMessage
  };
}