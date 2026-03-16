import { ref, reactive, computed, onMounted } from 'vue';
import { useAuthStore } from '../../store/auth.store';
import { PaymentUserService } from '../../api/services/payment-user.service';
import { PaymentCompanyService } from '../../api/services/payment-company.service';
import type { components } from '../../api/v1/schema';

type Payment = components["schemas"]["PaymentResponse"] | components["schemas"]["PaymentCompanyResponse"];

export default function useMyPayments() {
  const authStore = useAuthStore();
  
  const payments = ref<Payment[]>([]);
  const isLoading = ref(true);
  const isActionLoading = ref(false); // Para el spinner del modal
  const errorMessage = ref('');

  // Filtro seleccionado por el usuario. 'ACTIVE' será nuestro estado por defecto (Todos menos CANCELLED)
  const currentFilter = ref('ACTIVE'); 

  // Estado reactivo para el modal de confirmación
  const modal = reactive({
    show: false,
    title: '',
    message: '',
    type: 'danger' as 'danger' | 'warning' | 'info',
    paymentIdToCancel: '' as string | null
  });

  // Computed que filtra la lista en vivo según lo que seleccione el usuario
  const filteredPayments = computed(() => {
    if (currentFilter.value === 'ACTIVE') {
      return payments.value.filter(p => p.status !== 'CANCELLED');
    }
    if (currentFilter.value === 'ALL') {
      return payments.value;
    }
    // Filtrado estricto por estado (PENDING, COMPLETED, REJECTED, CANCELLED, REFUNDED)
    return payments.value.filter(p => p.status === currentFilter.value); 
  });

  const loadPayments = async () => {
    isLoading.value = true;
    errorMessage.value = '';
    
    try {
      if (authStore.isCompany) {
        const data = await PaymentCompanyService.getMyCompanyPayments();
        payments.value = data.payments_companies || [];
      } else {
        const data = await PaymentUserService.getMyPayments();
        payments.value = data.payments || [];
      }
    } catch (error) {
      console.error("Error cargando pagos:", error);
      errorMessage.value = "No se pudo cargar tu historial de pagos.";
    } finally {
      isLoading.value = false;
    }
  };

  // 1. Abre el modal y guarda el ID del pago
  const confirmCancelPayment = (paymentId: string) => {
    modal.title = 'Anular Reporte de Pago';
    modal.message = '¿Estás seguro de que deseas anular este reporte de pago? Esta acción no se puede deshacer.';
    modal.type = 'danger';
    modal.paymentIdToCancel = paymentId;
    modal.show = true;
  };

  // 2. Ejecuta la acción cuando el usuario confirma en el modal
  const executeCancelPayment = async () => {
    if (!modal.paymentIdToCancel) return;
    
    isActionLoading.value = true;
    try {
      if (authStore.isCompany) {
        await PaymentCompanyService.cancelMyCompanyPayment(modal.paymentIdToCancel);
      } else {
        await PaymentUserService.cancelMyPayment(modal.paymentIdToCancel);
      }
      
      // Si fue exitoso, cerramos el modal y recargamos la lista
      modal.show = false;
      modal.paymentIdToCancel = null;
      await loadPayments();
      
    } catch (error: any) {
      console.error("Error al cancelar el pago:", error);
      alert(error?.data?.detail?.[0]?.msg || "No se pudo cancelar el pago. Es posible que ya haya sido procesado.");
    } finally {
      isActionLoading.value = false;
    }
  };

  onMounted(() => {
    loadPayments();
  });

  return {
    payments,
    filteredPayments,
    currentFilter,
    isLoading,
    isActionLoading,
    errorMessage,
    modal,
    confirmCancelPayment,
    executeCancelPayment
  };
}