import { ref, reactive, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { PlanService } from '../../api/services/plan.service';
import type { components } from '../../api/v1/schema';

type InvestmentPlanUpdate = components["schemas"]["InvestmentPlanUpdate"]; //
type InvestmentType = components["schemas"]["InvestmentType"]; //
type PaymentsPeriod = components["schemas"]["PaymentsPeriod"]; //
type PlanStatus = components["schemas"]["InvestmentPlanStatus"]; //

export default function useEditPlan() {
  const route = useRoute();
  const router = useRouter();
  
  const planId = route.params.id as string;
  
  const isLoading = ref(true);
  const isSaving = ref(false);
  const errorMessage = ref('');

  // Estado original para saber si realmente se cambió algo
  const originalStatus = ref<PlanStatus>('ACTIVE');

  const form = reactive({
    plan_name: '',
    investment_type: 'STANDARD' as InvestmentType,
    capitalization_period: 1,
    payments_period: 'MENSUAL' as PaymentsPeriod,
    status: 'ACTIVE' as PlanStatus
  });

  const loadPlan = async () => {
    isLoading.value = true;
    try {
      const data = await PlanService.getMyPlanById(planId); //
      
      // Rellenamos el formulario con los datos existentes
      form.plan_name = data.plan_name;
      form.investment_type = data.investment_type;
      form.capitalization_period = data.capitalization_period;
      form.payments_period = data.payments_period;
      form.status = data.status;
      
      originalStatus.value = data.status;

      // Si un administrador bloqueó el plan, no dejamos que el usuario lo edite
      if (data.status === 'BLOCKED') {
        errorMessage.value = "Este plan ha sido bloqueado por administración y no puede ser modificado.";
      }
    } catch (error) {
      console.error("Error al cargar el plan para edición:", error);
      errorMessage.value = "No se pudo cargar la información del plan.";
    } finally {
      isLoading.value = false;
    }
  };

  const submitUpdate = async () => {
    if (!form.plan_name) {
      errorMessage.value = "El nombre del plan no puede estar vacío.";
      return;
    }

    if (originalStatus.value === 'BLOCKED') return;

    isSaving.value = true;
    errorMessage.value = '';

    try {
      const payload: InvestmentPlanUpdate = { //
        plan_name: form.plan_name,
        investment_type: form.investment_type,
        capitalization_period: form.capitalization_period,
        payments_period: form.payments_period,
        status: form.status
      };

      // Si tu backend tiene un método PATCH en el servicio, lo llamamos
      await PlanService.updateMyPlan(planId, payload); 
      
      // Volvemos al detalle del plan
      router.push({ name: 'PlanDetail', params: { id: planId } });
    } catch (error: any) {
      console.error("Error al actualizar:", error);
      // Aquí atrapamos el error del backend si intenta desactivar con pagos pendientes
      errorMessage.value = error?.data?.detail?.[0]?.msg 
        || error?.data?.detail // A veces FastAPI manda el error directo en string si es un HTTPException
        || "No se pudo actualizar el plan. Verifica los datos o contacta a soporte.";
    } finally {
      isSaving.value = false;
    }
  };

  onMounted(() => {
    loadPlan();
  });

  return {
    planId,
    form,
    isLoading,
    isSaving,
    errorMessage,
    originalStatus,
    submitUpdate
  };
}