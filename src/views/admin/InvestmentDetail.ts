import { ref, reactive, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { InvestmentAdminService } from '../../api/services/investment-admin.service';
import { PaymentAdminService } from '../../api/services/payment-admin.service';
import { InterestService } from '../../api/services/interest.service'; // NUEVO
import type { components } from '../../api/v1/schema';

type InvestmentPlan = components["schemas"]["InvestmentPlanResponse"];
type Payment = components["schemas"]["PaymentResponse"];
type Interest = components["schemas"]["InterestResponse"]; // NUEVO

export default function useInvestmentDetail() {
  const route = useRoute();
  const planId = route.params.id as string;

  const plan = ref<InvestmentPlan | null>(null);
  const payments = ref<Payment[]>([]);
  const interests = ref<Interest[]>([]); // NUEVO
  const selectedPayment = ref<any>(null);
  
  const isLoading = ref(true);
  const isActionLoading = ref(false);
  const errorMessage = ref('');

  // ESTADOS PARA LAS PESTAÑAS (TABS) INDEPENDIENTES
  const activeChartTab = ref<'PAYMENTS' | 'INTERESTS'>('PAYMENTS');
  const activeTableTab = ref<'PAYMENTS' | 'INTERESTS'>('PAYMENTS');

  const modal = reactive({
    show: false, editPlan: false, editPayment: false,
    title: '', message: '', type: 'info' as any, action: null as any
  });

  const loadData = async () => {
    isLoading.value = true;
    try {
      // Cargamos el Plan, los Pagos y los Intereses en paralelo
      const [pData, payData, intData] = await Promise.all([
        InvestmentAdminService.getPlanById(planId),
        PaymentAdminService.getPaymentsByPlanId(planId),
        InterestService.getPlanInterests(planId)
      ]);
      plan.value = pData;
      payments.value = payData.payments || [];
      interests.value = intData.interests || [];
    } catch (e) { 
      errorMessage.value = "Error de sincronización con el servidor."; 
    } finally { 
      isLoading.value = false; 
    }
  };

  // --- ACCIONES DEL PLAN ---
  const onSavePlan = async (formData: any) => {
    isActionLoading.value = true;
    try {
      await InvestmentAdminService.updatePlan(planId, formData);
      modal.editPlan = false;
      await loadData();
    } catch (e) { alert("Error al editar plan"); }
    finally { isActionLoading.value = false; }
  };

  const handleBlockPlan = () => {
    const isBlocked = plan.value?.status === 'BLOCKED';
    modal.title = isBlocked ? 'Activar Plan' : 'Bloquear Plan';
    modal.type = 'warning';
    modal.show = true;
    modal.action = async () => { await InvestmentAdminService.blockPlan(planId); };
  };

  // --- ACCIONES DE PAGOS ---
  const handlePaymentAction = (payment: any, type: string) => {
    if (type === 'edit') { selectedPayment.value = payment; modal.editPayment = true; return; }
    
    const actions: any = {
      accept: { title: 'Aprobar', fn: () => PaymentAdminService.acceptPayment(payment.id) },
      reject: { title: 'Rechazar', fn: () => PaymentAdminService.rejectPayment(payment.id) },
      refund: { title: 'Reembolsar', fn: () => PaymentAdminService.refundPayment(payment.id) },
      delete: { title: 'Eliminar', fn: () => PaymentAdminService.deletePayment(payment.id) }
    };
    
    const config = actions[type];
    modal.title = config.title;
    modal.message = `¿Confirmas esta acción sobre el pago de $${payment.divisa_amount}?`;
    modal.type = config.type || 'danger';
    modal.show = true;
    modal.action = async () => { await config.fn(); };
  };

  const onSavePayment = async (formData: any) => {
    isActionLoading.value = true;
    try {
      await PaymentAdminService.updatePayment(selectedPayment.value.id, formData);
      modal.editPayment = false;
      await loadData();
    } catch (e) { alert("Error al actualizar pago"); }
    finally { isActionLoading.value = false; }
  };

  // --- EJECUCIÓN GENÉRICA ---
  const executeAction = async () => {
    isActionLoading.value = true;
    try { await modal.action(); modal.show = false; await loadData(); }
    catch (e) { alert("Error en la operación"); }
    finally { isActionLoading.value = false; }
  };

  onMounted(loadData);

  return { 
    plan, payments, interests, activeChartTab, activeTableTab, 
    isLoading, isActionLoading, errorMessage, modal, selectedPayment,
    onSavePlan, onSavePayment, handleBlockPlan, handlePaymentAction, executeAction 
  };
}