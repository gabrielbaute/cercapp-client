import { ref, reactive, onMounted, computed } from 'vue';
import { PaymentAdminService } from '../../api/services/payment-admin.service';
import type { components } from '../../api/v1/schema';

type PaymentAdminResponse = components["schemas"]["PaymentAdminResponse"];

export default function usePaymentsList() {
  const payments = ref<PaymentAdminResponse[]>([]);
  const isLoading = ref(true);
  const isActionLoading = ref(false);
  const errorMessage = ref('');

  // ESTADOS DE FILTROS AVANZADOS
  const filters = reactive({
    email: '',
    status: '', // 'PENDING' | 'COMPLETED' | 'REJECTED' | 'REFUNDED'
    method: '', // 'TRANSFERENCIA', 'PAGO_MOVIL', 'ZELLE', 'BINANCE', etc.
    thisMonth: false
  });

  const pagination = reactive({ page: 1, limit: 100, total: 0 });

  const modal = reactive({
    show: false,
    editPayment: false,
    title: '',
    message: '',
    type: 'info' as any,
    action: null as (() => Promise<void>) | null
  });

  const selectedPayment = ref<PaymentAdminResponse | null>(null);

  const fetchPayments = async () => {
    isLoading.value = true;
    errorMessage.value = '';
    try {
      const skip = (pagination.page - 1) * pagination.limit;
      const data = await PaymentAdminService.getAllPayments(skip, pagination.limit);
      payments.value = data.payments || [];
      pagination.total = data.count || 0;
    } catch (error) {
      errorMessage.value = "Error al cargar el historial global de transacciones.";
    } finally {
      isLoading.value = false;
    }
  };

  // LÓGICA DE FILTRADO COMBINADO
  const filteredPayments = computed(() => {
    return payments.value.filter(payment => {
      // 1. Filtro por Email del Usuario
      const matchesEmail = !filters.email || 
        payment.user_email?.toLowerCase().includes(filters.email.toLowerCase());

      // 2. Filtro por Estatus
      const matchesStatus = !filters.status || payment.status === filters.status;

      // 3. Filtro por Método de Pago
      const matchesMethod = !filters.method || payment.payment_method === filters.method;

      // 4. Filtro por Mes Actual (Basado en la fecha declarada del pago)
      let matchesMonth = true;
      if (filters.thisMonth) {
        const pDate = new Date(payment.payment_date);
        const now = new Date();
        matchesMonth = pDate.getMonth() === now.getMonth() && pDate.getFullYear() === now.getFullYear();
      }

      return matchesEmail && matchesStatus && matchesMethod && matchesMonth;
    });
  });

  // --- ACCIONES DE GESTIÓN RÁPIDA ---
  const handlePaymentAction = (payment: PaymentAdminResponse, type: string) => {
    if (type === 'edit') {
      selectedPayment.value = payment;
      modal.editPayment = true;
      return;
    }

    const configs: Record<string, any> = {
      accept: { title: 'Aprobar Pago', type: 'info', fn: () => PaymentAdminService.acceptPayment(payment.id) },
      reject: { title: 'Rechazar Pago', type: 'warning', fn: () => PaymentAdminService.rejectPayment(payment.id) },
      refund: { title: 'Reembolsar', type: 'danger', fn: () => PaymentAdminService.refundPayment(payment.id) },
      delete: { title: 'Eliminar Registro', type: 'danger', fn: () => PaymentAdminService.deletePayment(payment.id) }
    };

    const config = configs[type];
    if (!config) return;

    modal.title = config.title;
    modal.message = `¿Confirmas la acción "${config.title}" para el pago de $${payment.divisa_amount} de ${payment.user_first_name}?`;
    modal.type = config.type;
    modal.show = true;
    modal.action = async () => { await config.fn(); };
  };

  const onSavePayment = async (formData: any) => {
    if (!selectedPayment.value) return;
    isActionLoading.value = true;
    try {
      await PaymentAdminService.updatePayment(selectedPayment.value.id, formData);
      modal.editPayment = false;
      await fetchPayments();
    } catch (e) { alert("Error al guardar los cambios del pago."); }
    finally { isActionLoading.value = false; }
  };

  const executeAction = async () => {
    if (!modal.action) return;
    isActionLoading.value = true;
    try {
      await modal.action();
      modal.show = false;
      await fetchPayments();
    } catch (e) { alert("No se pudo completar la operación."); }
    finally { isActionLoading.value = false; }
  };

  // PAGINACIÓN
  const totalPages = computed(() => Math.ceil(pagination.total / pagination.limit));

  const changePage = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages.value) {
      pagination.page = newPage;
      fetchPayments();
    }
  };

  onMounted(fetchPayments);

  return {
    totalPages, changePage, pagination,
    payments, filteredPayments, filters, isLoading, isActionLoading, errorMessage,
    modal, selectedPayment, fetchPayments, handlePaymentAction, onSavePayment, executeAction
  };
}