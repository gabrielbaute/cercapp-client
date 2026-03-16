import { ref, onMounted, computed, shallowRef, nextTick } from 'vue';
import { useAuthStore } from '../../store/auth.store';
import { PlanService } from '../../api/services/plan.service';
import { PaymentUserService } from '../../api/services/payment-user.service';
import { PaymentCompanyService } from '../../api/services/payment-company.service';
import Chart from 'chart.js/auto';
import type { components } from '../../api/v1/schema';

type InvestmentPlan = components["schemas"]["InvestmentPlanResponse"];
type Payment = components["schemas"]["PaymentResponse"] | components["schemas"]["PaymentCompanyResponse"];

export default function useDashboard() {
  const authStore = useAuthStore();

  const isLoading = ref(true);
  const errorMessage = ref('');
  const planes = ref<InvestmentPlan[]>([]);
  const pagos = ref<Payment[]>([]);

  // Referencias para la gráfica
  const chartCanvas = ref<HTMLCanvasElement | null>(null);
  const chartInstance = shallowRef<Chart | null>(null);

  const planesActivos = computed(() => {
    return planes.value.filter(p => p.status === 'ACTIVE').length;
  });

  const capitalInvertido = computed(() => {
    return pagos.value
      .filter(p => p.status === 'COMPLETED')
      .reduce((total, pago) => total + parseFloat(String(pago.divisa_amount)), 0);
  });

  // Función para dibujar la evolución del capital
  const drawChart = () => {
    if (!chartCanvas.value) return;
    if (chartInstance.value) chartInstance.value.destroy(); // Destruimos el previo para evitar bugs visuales

    // Filtramos pagos completados y los ordenamos cronológicamente
    const completedPayments = pagos.value
      .filter(p => p.status === 'COMPLETED')
      .sort((a, b) => new Date(a.payment_date).getTime() - new Date(b.payment_date).getTime());

    if (completedPayments.length === 0) return;

    const labels: string[] = [];
    const cumulativeData: number[] = [];
    let currentTotal = 0;

    // Calculamos el acumulado paso a paso
    completedPayments.forEach(pago => {
      currentTotal += parseFloat(String(pago.divisa_amount));
      labels.push(pago.payment_date);
      cumulativeData.push(currentTotal);
    });

    chartInstance.value = new Chart(chartCanvas.value, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Capital Acumulado ($)',
          data: cumulativeData,
          borderColor: '#B69E60', // Dorado Cercapp
          backgroundColor: 'rgba(182, 158, 96, 0.1)',
          fill: true,
          tension: 0.3, 
          pointBackgroundColor: '#002442',
          pointBorderColor: '#fff',
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'top' },
          tooltip: {
            callbacks: {
              label: (context) => `$ ${context.parsed.y.toFixed(2)}`
            }
          }
        },
        scales: {
          y: { beginAtZero: true }
        }
      }
    });
  };

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

      // nextTick asegura que el DOM existe antes de intentar inyectar la gráfica
      await nextTick();
      drawChart();

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
    capitalInvertido,
    chartCanvas
  };
}