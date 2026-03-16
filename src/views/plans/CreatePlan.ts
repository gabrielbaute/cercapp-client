import { ref, reactive, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../store/auth.store';
import { PlanService } from '../../api/services/plan.service';
import type { components } from '../../api/v1/schema';

type InvestmentPlanCreate = components["schemas"]["InvestmentPlanCreate"]; //
type InvestmentType = components["schemas"]["InvestmentType"]; //
type PaymentsPeriod = components["schemas"]["PaymentsPeriod"]; //

export default function useCreatePlan() {
  const router = useRouter();
  const authStore = useAuthStore();

  const isLoading = ref(false);
  const errorMessage = ref('');

  // Determinamos de quién es el ID (Usuario natural o Empresa)
  const currentUserId = computed(() => {
    return authStore.user?.id || authStore.company?.id || '';
  });

  // Formulario reactivo con valores por defecto
  const form = reactive({
    plan_name: '',
    investment_type: 'STANDARD' as InvestmentType, //
    capitalization_period: 1, // Por defecto 1 año
    payments_period: 'MENSUAL' as PaymentsPeriod //
  });

  const submitPlan = async () => {
    if (!form.plan_name) {
      errorMessage.value = "Debes asignarle un nombre a tu plan.";
      return;
    }

    if (!currentUserId.value) {
      errorMessage.value = "Error de sesión. No se pudo identificar al usuario.";
      return;
    }

    isLoading.value = true;
    errorMessage.value = '';

    try {
      // Construimos el payload exacto que pide el backend
      const payload: InvestmentPlanCreate = {
        user_id: currentUserId.value, //
        plan_name: form.plan_name, //
        investment_type: form.investment_type, //
        status: 'ACTIVE', // Lo forzamos a activo al crearlo
        capitalization_period: form.capitalization_period, //
        payments_period: form.payments_period //
      };

      await PlanService.createMyPlan(payload); //
      
      // Si es exitoso, volvemos a la lista de planes
      router.push({ name: 'MyPlans' });
    } catch (error: any) {
      console.error("Error al crear el plan:", error);
      errorMessage.value = error?.data?.detail?.[0]?.msg || "No se pudo crear el plan de inversión.";
    } finally {
      isLoading.value = false;
    }
  };

  return {
    form,
    isLoading,
    errorMessage,
    submitPlan
  };
}