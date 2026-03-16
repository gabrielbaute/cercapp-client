import { ref, reactive, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../store/auth.store';
import { PlanService } from '../../api/services/plan.service';
import { PaymentUserService } from '../../api/services/payment-user.service';
import type { components } from '../../api/v1/schema';

type PaymentCreate = components["schemas"]["PaymentCreate"]; //
type InvestmentPlan = components["schemas"]["InvestmentPlanResponse"]; //
type PaymentMethod = components["schemas"]["PaymentMethod"]; //

export default function useCreatePayment() {
  const router = useRouter();
  const authStore = useAuthStore();

  const isLoading = ref(false);
  const isLoadingPlans = ref(true);
  const errorMessage = ref('');
  
  const activePlans = ref<InvestmentPlan[]>([]);

  // Extraemos el ID real del usuario/empresa logueado
  const currentUserId = computed(() => {
    return authStore.user?.id || authStore.company?.id || '';
  });

  // Fecha actual en formato YYYY-MM-DD para el input type="date"
  const today = new Date().toISOString().split('T')[0];

  const form = reactive({
    investment_plan_id: '',
    payment_method: 'TRANSFERENCIA' as PaymentMethod, //
    divisa_amount: 0,
    transaction_id: '',
    payment_date: today
  });

  const loadPlans = async () => {
    try {
      const data = await PlanService.getMyPlans(); //
      // Filtramos para que solo pueda pagar a planes activos
      activePlans.value = (data.investment_plans || []).filter(p => p.status === 'ACTIVE'); //
      
      // Auto-seleccionar si solo tiene un plan activo (Mejora de UX)
      if (activePlans.value.length === 1) {
        form.investment_plan_id = activePlans.value[0].id;
      }
    } catch (error) {
      console.error("Error al cargar planes para el pago:", error);
      errorMessage.value = "No se pudieron cargar tus planes activos. Recarga la página.";
    } finally {
      isLoadingPlans.value = false;
    }
  };

  const submitPayment = async () => {
    if (!form.investment_plan_id || form.divisa_amount <= 0 || !form.transaction_id || !form.payment_date) {
      errorMessage.value = "Por favor completa todos los campos correctamente. El monto debe ser mayor a 0.";
      return;
    }

    if (!currentUserId.value) {
      errorMessage.value = "Error de sesión. No se pudo identificar al usuario.";
      return;
    }

    isLoading.value = true;
    errorMessage.value = '';

    try {
      const payload: PaymentCreate = { //
        user_id: currentUserId.value, // Usamos nuestra variable computada
        investment_plan_id: form.investment_plan_id,
        payment_method: form.payment_method,
        divisa_amount: form.divisa_amount,
        transaction_id: form.transaction_id,
        payment_date: form.payment_date
      };

      // Nota: Si implementamos la separación por roles, aquí validarías authStore.isCompany
      await PaymentUserService.createMyPayment(payload); //
      
      router.push({ name: 'MyPayments' });
    } catch (error: any) {
      console.error("Error al registrar pago:", error);
      errorMessage.value = error?.data?.detail?.[0]?.msg || "Ocurrió un error al registrar el pago en el servidor.";
    } finally {
      isLoading.value = false;
    }
  };

  onMounted(() => {
    loadPlans();
  });

  return {
    form,
    activePlans,
    isLoading,
    isLoadingPlans,
    errorMessage,
    submitPayment
  };
}