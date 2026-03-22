import { ref, reactive, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from '../../store/auth.store';
import { PaymentUserService } from '../../api/services/payment-user.service';
import { PaymentCompanyService } from '../../api/services/payment-company.service';
import { PlanService } from '../../api/services/plan.service';
import type { components } from '../../api/v1/schema';

// Tipos de la API
type Payment = components["schemas"]["PaymentResponse"] | components["schemas"]["PaymentCompanyResponse"];
type InvestmentPlan = components["schemas"]["InvestmentPlanResponse"];

export default function usePaymentDetail() {
  const route = useRoute();
  const authStore = useAuthStore();
  
  const paymentId = route.params.id as string;
  
  const payment = ref<Payment | null>(null);
  const associatedPlan = ref<InvestmentPlan | null>(null);
  
  const isLoading = ref(true);
  const isCancelling = ref(false);
  const errorMessage = ref('');

  // NUEVO: Estado reactivo para el modal de confirmación
  const modal = reactive({
    show: false,
    title: '',
    message: '',
    type: 'danger' as 'danger' | 'warning' | 'info'
  });

  // Clases CSS dinámicas para el estado del pago
  const statusClasses = computed(() => {
    if (!payment.value) return '';
    switch (payment.value.status) {
      case 'COMPLETED': return 'bg-green-100 text-green-700'; 
      case 'PENDING': return 'bg-yellow-100 text-yellow-700'; 
      case 'REJECTED': return 'bg-red-100 text-red-700'; 
      case 'REFUNDED': return 'bg-purple-100 text-purple-700'; 
      case 'CANCELED': return 'bg-gray-100 text-gray-700'; 
      default: return 'bg-blue-100 text-blue-700';
    }
  });

  const loadPaymentDetails = async () => {
    isLoading.value = true;
    errorMessage.value = '';

    try {
      // 1. Cargar el Pago
      if (authStore.isCompany) {
        payment.value = await PaymentCompanyService.getMyCompanyPaymentById(paymentId);
      } else {
        payment.value = await PaymentUserService.getMyPaymentById(paymentId);
      }

      // 2. Cargar el nombre del Plan asociado (Type Guard para TypeScript)
      if (payment.value && 'investment_plan_id' in payment.value && payment.value.investment_plan_id) {
        try {
          // Hacemos un casting seguro a string ya que validamos que existe
          associatedPlan.value = await PlanService.getMyPlanById(payment.value.investment_plan_id as string); 
        } catch (planError) {
          console.warn("No se pudo cargar el nombre del plan asociado.", planError);
        }
      }

    } catch (error) {
      console.error("Error al cargar detalle del pago:", error);
      errorMessage.value = "No se pudo cargar la información del pago.";
    } finally {
      isLoading.value = false;
    }
  };

  // 1. Abrir Modal de Confirmación
  const confirmCancelPayment = () => {
    modal.title = 'Anular Reporte de Pago';
    modal.message = '¿Estás seguro de que deseas anular este reporte de pago? Esta acción no se puede deshacer.';
    modal.type = 'danger';
    modal.show = true;
  };

  // 2. Ejecutar la cancelación confirmada
  const executeCancelPayment = async () => {
    isCancelling.value = true;
    try {
      if (authStore.isCompany) {
        await PaymentCompanyService.cancelMyCompanyPayment(paymentId); 
      } else {
        await PaymentUserService.cancelMyPayment(paymentId); 
      }
      
      // Refrescamos los datos para que la UI muestre el estado "CANCELLED"
      await loadPaymentDetails(); 
      
      // Ocultamos el modal tras el éxito
      modal.show = false;
    } catch (error: any) {
      console.error("Error al cancelar:", error);
      alert(error?.data?.detail?.[0]?.msg || "No se pudo anular el pago.");
    } finally {
      isCancelling.value = false;
    }
  };

  onMounted(() => {
    loadPaymentDetails();
  });

  return {
    payment,
    associatedPlan,
    isLoading,
    isCancelling,
    errorMessage,
    statusClasses,
    modal,
    confirmCancelPayment,
    executeCancelPayment
  };
}