import { computed, onMounted, ref, watch } from 'vue';
import { Chart, registerables } from 'chart.js';

// Registramos los componentes de Chart.js globalmente
Chart.register(...registerables);

export function usePaymentHistoryChart(props: { payments: any[], title: string }) {
  const canvasRef = ref<HTMLCanvasElement | null>(null);
  let chartInstance: Chart | null = null;

  const chartData = computed(() => {
    // Filtrado de pagos completados y ordenamiento cronológico
    const completed = [...props.payments]
      .filter(p => p.status === 'COMPLETED')
      .sort((a, b) => new Date(a.effective_date).getTime() - new Date(b.effective_date).getTime());

    // Agrupación por Mes y Año
    const grouped = completed.reduce((acc: Record<string, number>, curr) => {
      const date = new Date(curr.effective_date);
      const label = `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
      acc[label] = (acc[label] || 0) + Number(curr.divisa_amount);
      return acc;
    }, {});

    return {
      labels: Object.keys(grouped),
      datasets: [{
        label: 'Monto Acumulado ($)',
        // Type casting explícito para evitar el error TS2322
        data: Object.values(grouped).map(v => Number(v)) as number[],
        borderColor: '#1e293b', // cercapp-navy
        backgroundColor: 'rgba(30, 41, 59, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: '#fbbf24' // cercapp-gold
      }]
    };
  });

  const renderChart = () => {
    if (!canvasRef.value) return;
    
    // Destruimos la instancia previa para evitar superposición al re-renderizar
    if (chartInstance) chartInstance.destroy();

    chartInstance = new Chart(canvasRef.value, {
      type: 'line',
      data: chartData.value,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        layout: {
          padding: {
            top: 10,
            bottom: 25, 
            left: 10,
            right: 10
          }
        },
        plugins: { legend: { display: false } },
        scales: {
          y: { beginAtZero: true, grid: { color: '#f1f5f9' } },
          x: { grid: { display: false } }
        }
      }
    });
  };

  onMounted(renderChart);
  
  // Si los datos cambian reactivamente, volvemos a dibujar
  watch(() => props.payments, renderChart, { deep: true });

  return { canvasRef };
}