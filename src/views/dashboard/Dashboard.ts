import { ref, onMounted, computed } from 'vue';
import { useAuthStore } from '../../store/auth.store';
import { PlanService } from '../../api/services/plan.service';
import { PaymentUserService } from '../../api/services/payment-user.service';
import { PaymentCompanyService } from '../../api/services/payment-company.service';
import type { components } from '../../api/v1/schema';

type InvestmentPlan = components["schemas"]["InvestmentPlanResponse"];
type Payment = components["schemas"]["PaymentResponse"] | components["schemas"]["PaymentCompanyResponse"];

export default function useDashboard() {
  const authStore = useAuthStore();

  const isLoading = ref(true);
  const errorMessage = ref('');
  const planes = ref<InvestmentPlan[]>([]);
  const pagos = ref<Payment[]>([]);

  // Computed properties para las tarjetas de resumen
  const planesActivos = computed(() => {
    return planes.value.filter(p => p.status === 'ACTIVE').length;
  });

  const capitalInvertido = computed(() => {
    return pagos.value
      .filter(p => p.status === 'COMPLETED')
      .reduce((total, pago) => total + parseFloat(String(pago.divisa_amount)), 0);
  });

  const cargarDashboard = async () => {
    isLoading.value = true;
    errorMessage.value = '';

    try {
      if (authStore.isCompany) {
        const [planesData, pagosData] = await Promise.all([
          PlanService.getMyPlans(),
          PaymentCompanyService.getMyCompanyPayments()
        ]);
        planes.value = planesData.investment_plans || [];
        pagos.value = pagosData.payments_companies || [];
      } else {
        const [planesData, pagosData] = await Promise.all([
          PlanService.getMyPlans(),
          PaymentUserService.getMyPayments()
        ]);
        planes.value = planesData.investment_plans || [];
        pagos.value = pagosData.payments || [];
      }
    } catch (error) {
      console.error("Error al cargar el dashboard:", error);
      errorMessage.value = 'No pudimos cargar tu información reciente. Intenta refrescar la página.';
    } finally {
      isLoading.value = false;
    }
  };

  onMounted(() => {
    cargarDashboard();
  });

  return {
    authStore,
    isLoading,
    errorMessage,
    planes,
    pagos,
    planesActivos,
    capitalInvertido
  };
}