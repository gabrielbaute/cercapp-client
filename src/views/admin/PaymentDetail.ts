import { ref, reactive, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { PaymentAdminService } from '../../api/services/payment-admin.service';
import type { components } from '../../api/v1/schema';

type PaymentResponse = components["schemas"]["PaymentResponse"];

export default function usePaymentDetail() {
  const route = useRoute();
  const paymentId = route.params.id as string;

  const payment = ref<PaymentResponse | null>(null);
  const isLoading = ref(true);
  const isActionLoading = ref(false);
  
  // Estado para controlar ambos modales: Confirmación y Edición
  const modal = reactive({ 
    show: false, 
    edit: false, 
    title: '', 
    message: '', 
    type: 'info' as 'info' | 'warning' | 'danger', 
    action: null as (() => Promise<void>) | null 
  });

  const loadPayment = async () => {
    isLoading.value = true;
    try {
      // Obtenemos los pagos y buscamos el específico
      const data = await PaymentAdminService.getAllPayments(0, 1000);
      payment.value = data.payments.find(p => p.id === paymentId) || null;
    } catch (error) { 
      console.error("Error cargando pago:", error); 
    } finally { 
      isLoading.value = false; 
    }
  };

  // Centralizador de acciones administrativas (Aceptar, Rechazar, Reembolsar, Eliminar)
  const handleStatusAction = (type: 'accept' | 'reject' | 'refund' | 'delete') => {
    const configs = {
      accept: { title: 'Aprobar Pago', type: 'info', fn: () => PaymentAdminService.acceptPayment(paymentId) },
      reject: { title: 'Rechazar Pago', type: 'warning', fn: () => PaymentAdminService.rejectPayment(paymentId) },
      refund: { title: 'Reembolsar Pago', type: 'danger', fn: () => PaymentAdminService.refundPayment(paymentId) },
      delete: { title: 'Eliminar Registro', type: 'danger', fn: () => PaymentAdminService.deletePayment(paymentId) }
    };
    
    const config = configs[type];
    modal.title = config.title;
    modal.message = `¿Deseas proceder con la acción de "${config.title}" para esta transacción?`;
    modal.type = config.type as any;
    modal.show = true;
    modal.action = async () => { 
      await config.fn(); 
      if(type === 'delete') window.history.back(); // Si se elimina, regresamos
    };
  };

  // Función para guardar los cambios del formulario de edición
  const onUpdateSave = async (formData: any) => {
    isActionLoading.value = true;
    try {
      await PaymentAdminService.updatePayment(paymentId, formData);
      modal.edit = false;
      await loadPayment(); // Recargamos para ver los cambios
    } catch (error) { 
      alert("Error al actualizar los datos del pago."); 
    } finally { 
      isActionLoading.value = false; 
    }
  };

  const executeAction = async () => {
    if (!modal.action) return;
    isActionLoading.value = true;
    try { 
      await modal.action(); 
      modal.show = false; 
      await loadPayment(); 
    } catch (error) { 
      alert("La operación no pudo completarse."); 
    } finally { 
      isActionLoading.value = false; 
    }
  };

  onMounted(loadPayment);

  return { payment, isLoading, isActionLoading, modal, handleStatusAction, executeAction, onUpdateSave };
}