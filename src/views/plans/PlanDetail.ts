import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { PlanService } from '../../api/services/plan.service';
import { PaymentUserService } from '../../api/services/payment-user.service';
import { InterestService } from '../../api/services/interest.service'; // NUEVO
import type { components } from '../../api/v1/schema';

type InvestmentPlan = components["schemas"]["InvestmentPlanResponse"];
type Payment = components["schemas"]["PaymentResponse"];
type Interest = components["schemas"]["InterestResponse"]; // NUEVO

export default function usePlanDetail() {
  const route = useRoute();
  const planId = route.params.id as string;
  
  const plan = ref<InvestmentPlan | null>(null);
  const payments = ref<Payment[]>([]);
  const interests = ref<Interest[]>([]); // NUEVO
  
  const isLoading = ref(true);
  const errorMessage = ref('');

  // ESTADO PARA LAS PESTAÑAS (TABS)
  const activeTab = ref<'PAYMENTS' | 'INTERESTS'>('PAYMENTS');

  // Computado: Calcula el total de capital invertido
  const totalInvested = computed(() => {
    return payments.value
      .filter(p => p.status === 'COMPLETED')
      .reduce((sum, p) => sum + parseFloat(String(p.divisa_amount)), 0);
  });

  // Computado: Calcula el total de intereses ganados
  const totalInterests = computed(() => {
    return interests.value.reduce((sum, i) => sum + parseFloat(String(i.interes_periodo)), 0);
  });

  const loadPlanDetails = async () => {
    isLoading.value = true;
    errorMessage.value = '';

    try {
      // 1. Cargamos el Plan
      plan.value = await PlanService.getMyPlanById(planId);

      // 2. Cargamos los Pagos (Solo usuarios, eliminado lógica de empresas)
      const userPaymentsData = await PaymentUserService.getMyPlanPayments(planId);
      payments.value = userPaymentsData.payments || [];

      // 3. Cargamos los Intereses Generados
      const interestsData = await InterestService.getPlanInterests(planId);
      interests.value = interestsData.interests || [];

    } catch (error) {
      console.error("Error al cargar detalle del plan:", error);
      errorMessage.value = "No se pudo cargar la información financiera del plan.";
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
    interests,
    activeTab,
    totalInvested,
    totalInterests,
    isLoading,
    errorMessage
  };
}