import { computed, onMounted, shallowRef, watch, nextTick } from 'vue';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

export function useAdminDailyPaymentsChart(props: { payments: any[] }) {
  const canvasRef = shallowRef<HTMLCanvasElement | null>(null);
  const chartInstance = shallowRef<Chart | null>(null);

  const chartData = computed(() => {
    const safePayments = Array.isArray(props.payments) ? props.payments : [];
    
    // 1. Agrupamos los pagos exactos por fecha (YYYY-MM-DD)
    const groupedByDate: Record<string, number> = {};
    safePayments.forEach(p => {
      // Usamos la fecha efectiva, de pago o de creación
      const rawDate = p.effective_date || p.payment_date || p.created_at;
      if (!rawDate) return;
      
      const dateStr = new Date(rawDate).toISOString().split('T')[0];
      if (!groupedByDate[dateStr]) groupedByDate[dateStr] = 0;
      groupedByDate[dateStr] += Number(p.divisa_amount || 0);
    });

    // 2. Generamos los últimos 30 días estrictos (para que haya ceros en los días sin pagos)
    const labels: string[] = [];
    const dataPoints: number[] = [];
    const today = new Date();

    for (let i = 29; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      
      // Formato DD/MM para la etiqueta
      labels.push(`${d.getDate()}/${d.getMonth() + 1}`);
      // Si hubo pago ese día lo ponemos, si no, un rotundo 0
      dataPoints.push(groupedByDate[dateStr] || 0);
    }

    return {
      labels,
      datasets: [{
        label: 'Ingresos Diarios ($)',
        data: dataPoints,
        borderColor: '#002442', // cercapp-navy
        backgroundColor: 'rgba(0, 36, 66, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 3,
        pointHoverRadius: 6,
        pointBackgroundColor: '#B69E60' // cercapp-gold
      }]
    };
  });

  const renderChart = async () => {
    await nextTick();
    if (!canvasRef.value) return;
    
    if (chartInstance.value) chartInstance.value.destroy();

    const rawData = JSON.parse(JSON.stringify(chartData.value));

    chartInstance.value = new Chart(canvasRef.value, {
      type: 'line',
      data: rawData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        layout: { padding: { top: 10, bottom: 10, left: 0, right: 10 } },
        plugins: { 
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (context) => `$ ${(context.parsed.y || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}`
            }
          }
        },
        scales: {
          y: { 
            beginAtZero: true, 
            grid: { color: '#f1f5f9' },
            ticks: { callback: (value) => `$${value}` }
          },
          x: { 
            grid: { display: false },
            ticks: { maxTicksLimit: 10 } // Para que no se amontonen las 30 fechas
          }
        }
      }
    });
  };

  onMounted(() => renderChart());
  watch(() => props.payments, () => renderChart(), { deep: true });

  return { canvasRef };
}