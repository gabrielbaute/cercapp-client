<script lang="ts">
import { defineComponent, computed, onMounted, ref, watch } from 'vue';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

export default defineComponent({
  name: 'PaymentHistoryChart',
  props: {
    payments: { type: Array as () => any[], required: true },
    title: { type: String, default: 'Histórico' }
  },
  setup(props) {
    const canvasRef = ref<HTMLCanvasElement | null>(null);
    let chartInstance: Chart | null = null;

    const chartData = computed(() => {
      // Filtrado de pagos completados
      const completed = [...props.payments]
        .filter(p => p.status === 'COMPLETED')
        .sort((a, b) => new Date(a.payment_date).getTime() - new Date(b.payment_date).getTime());

      const grouped = completed.reduce((acc: any, curr) => {
        const date = new Date(curr.payment_date);
        const label = `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
        acc[label] = (acc[label] || 0) + Number(curr.divisa_amount);
        return acc;
      }, {});

      return {
        labels: Object.keys(grouped),
        datasets: [{
          label: 'Monto Acumulado ($)',
          data: Object.values(grouped),
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
      if (chartInstance) chartInstance.destroy();

      chartInstance = new Chart(canvasRef.value, {
        type: 'line',
        data: chartData.value,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          // --- AJUSTE DE "AIRE" (PADDING) ---
          layout: {
            padding: {
              top: 10,
              bottom: 25, // Espacio extra para las etiquetas del eje X
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
    watch(() => props.payments, renderChart, { deep: true });

    return { canvasRef };
  }
});
</script>

<template>
  <div class="w-full h-full min-h-[300px] p-4"> <h4 class="text-xs font-bold text-slate-400 uppercase mb-4">{{ title }}</h4>
    <canvas ref="canvasRef"></canvas>
  </div>
</template>