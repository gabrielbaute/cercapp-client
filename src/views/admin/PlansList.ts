import { ref, reactive, onMounted, computed } from 'vue';
import { InvestmentAdminService } from '../../api/services/investment-admin.service';
import type { components } from '../../api/v1/schema';

type InvestmentPlanAdminResponse = components["schemas"]["InvestmentPlanAdminResponse"];

export default function usePlansList() {
  const plans = ref<InvestmentPlanAdminResponse[]>([]);
  const isLoading = ref(true);
  const isActionLoading = ref(false);
  const errorMessage = ref('');
  
  // ESTADOS DE FILTROS
  const filters = reactive({
    email: '',
    type: '',   // 'PREMIUM' | 'STANDART'
    status: '', // 'ACTIVE' | 'INACTIVE' | 'BLOCKED'
    expiringThisMonth: false
  });

  const pagination = reactive({ page: 1, limit: 50, total: 0 });

  const modal = reactive({
    show: false, edit: false, title: '', message: '', type: 'info' as any,
    selectedPlan: null as InvestmentPlanAdminResponse | null,
    action: null as (() => Promise<void>) | null
  });

  const fetchPlans = async () => {
    isLoading.value = true;
    errorMessage.value = '';
    try {
      const skip = (pagination.page - 1) * pagination.limit;
      // IMPORTANTE: Asegúrate de que el service use "/api/v1/investment-plans/"
      const data = await InvestmentAdminService.getAllPlans(skip, pagination.limit);
      plans.value = data.investment_plans || [];
      pagination.total = data.count || 0;
    } catch (error) {
      errorMessage.value = "No se pudieron cargar los planes de inversión.";
    } finally {
      isLoading.value = false;
    }
  };

  // LÓGICA DE FILTRADO COMBINADO
  const filteredPlans = computed(() => {
    return plans.value.filter(plan => {
      // 1. Filtro por Email
      const matchesEmail = !filters.email || 
        plan.user_email?.toLowerCase().includes(filters.email.toLowerCase());

      // 2. Filtro por Tipo
      const matchesType = !filters.type || plan.investment_type === filters.type;

      // 3. Filtro por Estado
      const matchesStatus = !filters.status || plan.status === filters.status;

      // 4. Filtro por Vencimiento (Mes Actual)
      let matchesExpiry = true;
      if (filters.expiringThisMonth) {
        if (!plan.maturity_date) matchesExpiry = false;
        else {
          const mDate = new Date(plan.maturity_date);
          const now = new Date();
          matchesExpiry = mDate.getMonth() === now.getMonth() && mDate.getFullYear() === now.getFullYear();
        }
      }

      return matchesEmail && matchesType && matchesStatus && matchesExpiry;
    });
  });

  const handleEdit = (plan: InvestmentPlanAdminResponse) => {
    modal.selectedPlan = plan;
    modal.edit = true;
  };

  const onSaveEdit = async (formData: any) => {
    if (!modal.selectedPlan) return;
    isActionLoading.value = true;
    try {
      await InvestmentAdminService.updatePlan(modal.selectedPlan.id, formData);
      modal.edit = false;
      await fetchPlans();
    } catch (e) { alert("Error al actualizar"); }
    finally { isActionLoading.value = false; }
  };

  onMounted(fetchPlans);

  return {
    plans, filteredPlans, filters, isLoading, isActionLoading, errorMessage, pagination,
    modal, fetchPlans, handleEdit, onSaveEdit
  };
}