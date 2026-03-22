import { ref, reactive, onMounted } from 'vue';
import { UserAdminService } from '../../api/services/user-admin.service';
import { InvestmentAdminService } from '../../api/services/investment-admin.service';
import { PaymentAdminService } from '../../api/services/payment-admin.service';
import { InterestAdminService } from '../../api/services/interest-admin.service';
import type { components } from '../../api/v1/schema';

type PaymentAdminResponse = components["schemas"]["PaymentAdminResponse"];

export function useAdminDashboard() {
  const isLoading = ref(false);
  const successMessage = ref('');
  const errorMessage = ref('');

  // Estadísticas Mejoradas (Mes actual vs Histórico)
  const stats = reactive({
    totalUsers: 0,
    usersThisMonth: 0,
    totalPlans: 0,
    plansThisMonth: 0,
    totalCapital: 0,
    capitalThisMonth: 0,
    pendingPayments: 0
  });

  // Pagos filtrados para la gráfica (Últimos 30 días)
  const recentApprovedPayments = ref<PaymentAdminResponse[]>([]);

  // Estado del Modal
  const isCalcModalOpen = ref(false);
  const isCalculating = ref(false);
  
  const calcForm = reactive({
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1
  });

  const loadStats = async () => {
    isLoading.value = true;
    try {
      // Pedimos un lote grande (1000) para poder calcular las fechas localmente.
      // A futuro, lo ideal sería que el backend tenga un endpoint /api/v1/stats, pero esto funciona perfecto por ahora.
      const [usersRes, plansRes, paymentsRes] = await Promise.all([
        UserAdminService.getAllUsers(0, 1000),
        InvestmentAdminService.getAllPlans(0, 1000),
        PaymentAdminService.getAllPayments(0, 1000)
      ]);

      const now = new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();

      // 1. USUARIOS
      const allUsers = usersRes.users || [];
      stats.totalUsers = usersRes.count || 0;
      stats.usersThisMonth = allUsers.filter(u => {
        const d = new Date(u.register_date);
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
      }).length;

      // 2. PLANES
      const allPlans = plansRes.investment_plans || [];
      stats.totalPlans = plansRes.count || 0;
      stats.plansThisMonth = allPlans.filter(p => {
        const d = new Date(p.created_at);
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
      }).length;

      // 3. PAGOS Y CAPITALES
      const allPayments = paymentsRes.payments || [];
      stats.pendingPayments = allPayments.filter(p => p.status === 'PENDING').length;
      
      // Filtramos solo los completados para el capital
      const completedPayments = allPayments.filter(p => p.status === 'COMPLETED');
      
      // Capital Histórico
      stats.totalCapital = completedPayments.reduce((acc, curr) => acc + Number(curr.divisa_amount || 0), 0);
      
      // Capital del Mes Actual
      stats.capitalThisMonth = completedPayments.filter(p => {
        const d = new Date(p.effective_date || p.payment_date || p.created_at);
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
      }).reduce((acc, curr) => acc + Number(curr.divisa_amount || 0), 0);

      // 4. DATOS PARA LA GRÁFICA (Últimos 30 días exactos, no solo el mes actual)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      recentApprovedPayments.value = completedPayments.filter(p => {
        const d = new Date(p.effective_date || p.payment_date || p.created_at);
        return d >= thirtyDaysAgo;
      });

    } catch (error) {
      console.error("Error cargando estadísticas del dashboard:", error);
    } finally {
      isLoading.value = false;
    }
  };

  const openCalculationModal = () => {
    isCalcModalOpen.value = true;
    errorMessage.value = '';
    successMessage.value = '';
  };

  const closeCalculationModal = () => {
    if (isCalculating.value) return;
    isCalcModalOpen.value = false;
  };

  const triggerCalculation = async () => {
    isCalculating.value = true;
    errorMessage.value = '';
    successMessage.value = '';

    try {
      const response = await InterestAdminService.forceManualCalculation(calcForm.year, calcForm.month);
      successMessage.value = `¡Cálculo finalizado exitosamente! Se procesaron los intereses del periodo ${calcForm.month}/${calcForm.year}.`;
      setTimeout(() => {
        closeCalculationModal();
        successMessage.value = '';
      }, 3000);
    } catch (error: any) {
      errorMessage.value = error?.data?.detail || "Ocurrió un error crítico al forzar el cálculo.";
    } finally {
      isCalculating.value = false;
    }
  };

  onMounted(() => {
    loadStats();
  });

  return {
    isLoading,
    stats,
    recentApprovedPayments,
    isCalcModalOpen,
    isCalculating,
    calcForm,
    successMessage,
    errorMessage,
    openCalculationModal,
    closeCalculationModal,
    triggerCalculation
  };
}