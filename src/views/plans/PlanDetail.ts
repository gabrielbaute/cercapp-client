import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from '../../store/auth.store';
import { PlanService } from '../../api/services/plan.service';
import { PaymentUserService } from '../../api/services/payment-user.service';
import { PaymentCompanyService } from '../../api/services/payment-company.service';
import type { components } from '../../api/v1/schema';

type InvestmentPlan = components["schemas"]["InvestmentPlanResponse"]; //
type Payment = components["schemas"]["PaymentResponse"] | components["schemas"]["PaymentCompanyResponse"]; //

export default function usePlanDetail() {
  const route = useRoute();
  const authStore = useAuthStore();
  
  const planId = route.params.id as string; // Obtenemos el ID de la URL
  
  const plan = ref<InvestmentPlan | null>(null);
  const payments = ref<Payment[]>([]);
  
  const isLoading = ref(true);
  const errorMessage = ref('');

  // Computado: Calcula el total de capital invertido sumando pagos COMPLETADOS
  const totalInvested = computed(() => {
    return payments.value
      .filter(p => p.status === 'COMPLETED') //
      .reduce((sum, p) => sum + parseFloat(String(p.divisa_amount)), 0); //
  });

  const loadPlanDetails = async () => {
    isLoading.value = true;
    errorMessage.value = '';

    try {
      // 1. Cargamos el Plan
      const planData = await PlanService.getMyPlanById(planId);
      plan.value = planData;

      // 2. Cargamos los Pagos de este Plan
      if (authStore.isCompany) {
        // Workaround para empresas: Traer todos y filtrar en frontend
        const companyPaymentsData = await PaymentCompanyService.getMyCompanyPayments(); //
        // Filtramos buscando un campo que los relacione. OJO: El PaymentCompanyResponse no trae investment_plan_id en el OpenAPI explícitamente!
        // Asumiendo que sí existe a nivel de BD, o mostrando todos provisionalmente.
        // Si tu backend no lo vincula, aquí te mostrará todos los pagos de la empresa.
        payments.value = companyPaymentsData.payments_companies || []; //
      } else {
        // Usuarios naturales tienen endpoint directo
        const userPaymentsData = await PaymentUserService.getMyPlanPayments(planId);
        payments.value = userPaymentsData.payments || []; //
      }

    } catch (error) {
      console.error("Error al cargar detalle del plan:", error);
      errorMessage.value = "No se pudo cargar la información del plan.";
    } finally {
      isLoading.value = false;
    }
  };

  onMounted(() => {
    loadPlanDetails();
  });

  return {
    plan,
    payments,
    totalInvested,
    isLoading,
    errorMessage
  };
}