import { ref, reactive, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { UserAdminService } from '../../api/services/user-admin.service';
import { InvestmentAdminService } from '../../api/services/investment-admin.service';
import { PaymentAdminService } from '../../api/services/payment-admin.service';
import type { components } from '../../api/v1/schema';

type UserResponse = components["schemas"]["UserResponse"];
type InvestmentPlanResponse = components["schemas"]["InvestmentPlanResponse"];
type PaymentAdminResponse = components["schemas"]["PaymentAdminResponse"];

export default function useUserDetail() {
  const route = useRoute();
  const router = useRouter(); 
  const userId = route.params.id as string;

  const user = ref<UserResponse | null>(null);
  const plans = ref<InvestmentPlanResponse[]>([]);
  const payments = ref<PaymentAdminResponse[]>([]);
  
  const isLoading = ref(true);
  const isActionLoading = ref(false);
  const errorMessage = ref('');

  const selectedPayment = ref<any>(null);

  const modal = reactive({
    show: false,
    editPayment: false,
    editUser: false, // Nuevo estado para el modal de usuario
    title: '',
    message: '',
    type: 'info' as 'danger' | 'warning' | 'info',
    action: null as (() => Promise<void>) | null
  });

  const loadAllUserData = async () => {
    isLoading.value = true;
    try {
      const [userReq, plansReq, paymentsReq] = await Promise.all([
        UserAdminService.getUserById(userId),
        InvestmentAdminService.getPlansByUserId(userId),
        PaymentAdminService.getPaymentsByUserId(userId)
      ]);

      user.value = userReq;
      plans.value = plansReq.investment_plans || [];
      payments.value = paymentsReq.payments || [];
    } catch (error: any) {
      errorMessage.value = "Error al consolidar la información financiera.";
    } finally {
      isLoading.value = false;
    }
  };

  // --- ACCIONES DE USUARIO ---
  
  // SOLUCIÓN: Si está bloqueado, lo reactivamos con updateUser. Si no, lo bloqueamos.
  const handleUserStatus = () => {
    if (!user.value) return;
    const isBlocked = user.value.status === 'BLOCKED';
    
    modal.title = isBlocked ? 'Reactivar Usuario' : 'Bloquear Usuario';
    modal.message = `¿Deseas ${isBlocked ? 'activar' : 'bloquear'} el acceso para ${user.value.first_name}?`;
    modal.type = isBlocked ? 'info' : 'warning';
    modal.show = true;
    modal.action = async () => { 
      if (isBlocked) {
        await UserAdminService.updateUser(userId, { status: 'ACTIVE' });
      } else {
        await UserAdminService.blockUser(userId); 
      }
    };
  };

  // NUEVA: GUARDAR EDICIÓN DE USUARIO
  const onSaveUser = async (formData: any) => {
    isActionLoading.value = true;
    try {
      await UserAdminService.updateUser(userId, formData);
      modal.editUser = false;
      await loadAllUserData(); // Refresca los datos en pantalla
    } catch (e) {
      alert("Error al actualizar los datos del usuario.");
    } finally {
      isActionLoading.value = false;
    }
  };

  const handleDeleteUser = () => {
    if (!user.value) return;
    modal.title = 'ELIMINAR USUARIO';
    modal.message = `¿Estás seguro de eliminar a ${user.value.first_name}? Esta acción borrará permanentemente su cuenta y todo su historial.`;
    modal.type = 'danger';
    modal.show = true;
    modal.action = async () => { 
      await UserAdminService.deleteUser(userId);
      router.push({ name: 'UsersList' }); 
    };
  };

  // --- ACCIONES DE PAGOS ---
  const handlePaymentAction = (payment: any, type: string) => {
    if (type === 'edit') {
      selectedPayment.value = payment;
      modal.editPayment = true;
      return;
    }

    const configs: any = {
      accept: { title: 'Aprobar Pago', type: 'info', fn: () => PaymentAdminService.acceptPayment(payment.id) },
      reject: { title: 'Rechazar Pago', type: 'warning', fn: () => PaymentAdminService.rejectPayment(payment.id) },
      refund: { title: 'Reembolsar', type: 'danger', fn: () => PaymentAdminService.refundPayment(payment.id) },
      delete: { title: 'Borrar Registro', type: 'danger', fn: () => PaymentAdminService.deletePayment(payment.id) }
    };

    const config = configs[type];
    modal.title = config.title;
    modal.message = `¿Confirmas esta acción para el pago de $${payment.divisa_amount}?`;
    modal.type = config.type;
    modal.show = true;
    modal.action = async () => { await config.fn(); };
  };

  const onSavePayment = async (formData: any) => {
    isActionLoading.value = true;
    try {
      await PaymentAdminService.updatePayment(selectedPayment.value.id, formData);
      modal.editPayment = false;
      await loadAllUserData();
    } catch (e) { alert("Error al actualizar pago"); }
    finally { isActionLoading.value = false; }
  };

  const executeAction = async () => {
    if (!modal.action) return;
    isActionLoading.value = true;
    try {
      await modal.action();
      modal.show = false;
      await loadAllUserData();
    } catch (e) { alert("Error en la operación"); }
    finally { isActionLoading.value = false; }
  };

  onMounted(loadAllUserData);

  return { 
    user, plans, payments, isLoading, isActionLoading, errorMessage, modal, selectedPayment,
    handleUserStatus, handleDeleteUser, handlePaymentAction, onSavePayment, onSaveUser, executeAction 
  };
}