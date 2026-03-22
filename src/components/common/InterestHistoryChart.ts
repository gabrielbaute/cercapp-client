import { computed, onMounted, shallowRef, watch, nextTick } from 'vue';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

const MONTHS = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

// Función de seguridad para evitar que valores nulos o con comas rompan la gráfica
const parseMontoSeguro = (val: any): number => {
  if (val === null || val === undefined) return 0;
  if (typeof val === 'number') return val;
  const parsed = Number(String(val).replace(',', '.'));
  return isNaN(parsed) ? 0 : parsed;
};

export function useInterestHistoryChart(props: { interests: any[], title: string }) {
  const canvasRef = shallowRef<HTMLCanvasElement | null>(null);
  
  // CRÍTICO: Debe ser shallowRef para que Vue no intente rastrear el interior de Chart.js
  const chartInstance = shallowRef<Chart | null>(null);
  const chartError = shallowRef<string | null>(null);

  const chartData = computed(() => {
    try {
      // 1. Protección contra undefined
      const safeInterests = Array.isArray(props.interests) ? [...props.interests] : [];
      if (safeInterests.length === 0) return null;

      // 2. Ordenamiento cronológico seguro
      const sortedInterests = safeInterests.sort((a, b) => {
        const anioA = parseMontoSeguro(a.periodo_anio);
        const anioB = parseMontoSeguro(b.periodo_anio);
        if (anioA !== anioB) return anioA - anioB;
        return parseMontoSeguro(a.periodo_mes) - parseMontoSeguro(b.periodo_mes);
      });

      // 3. Extracción de etiquetas y cálculo de Acumulado
      const labels: string[] = [];
      const dataPoints: number[] = [];
      let acumuladoTotal = 0;

      sortedInterests.forEach(i => {
        const mesIndex = parseMontoSeguro(i.periodo_mes) - 1;
        labels.push(`${MONTHS[mesIndex] || 'Mes'} ${i.periodo_anio || ''}`);
        
        // Sumamos el interés del periodo al acumulado histórico
        acumuladoTotal += parseMontoSeguro(i.interes_periodo);
        dataPoints.push(acumuladoTotal);
      });

      return {
        labels,
        datasets: [{
          label: 'Interés Acumulado ($)',
          data: dataPoints,
          borderColor: '#B69E60', // cercapp-gold
          backgroundColor: 'rgba(182, 158, 96, 0.1)',
          fill: true,
          tension: 0.4,
          pointRadius: 4,
          pointBackgroundColor: '#002442' // cercapp-navy
        }]
      };
    } catch (error: any) {
      console.error("Error procesando datos para la gráfica:", error);
      chartError.value = "Error al procesar los datos.";
      return null;
    }
  });

  const renderChart = async () => {
    // nextTick garantiza que el <canvas> ya existe en el DOM tras el v-if del Tab
    await nextTick();
    if (!canvasRef.value || !chartData.value) return;
    
    try {
      if (chartInstance.value) chartInstance.value.destroy();

      // Clonamos la data para quitarle el Proxy reactivo de Vue (Evita colapsos de Chart.js)
      const rawData = JSON.parse(JSON.stringify(chartData.value));

      chartInstance.value = new Chart(canvasRef.value, {
        type: 'line',
        data: rawData,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          layout: { padding: { top: 10, bottom: 25, left: 10, right: 10 } },
          plugins: { 
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: (context) => `$ ${(context.parsed.y || 0).toFixed(2)}`
              }
            }
          },
          scales: {
            y: { beginAtZero: true, grid: { color: '#f1f5f9' } },
            x: { grid: { display: false } }
          }
        }
      });
      chartError.value = null; // Limpiamos errores si se renderizó bien
    } catch (error: any) {
      console.error("Error de renderizado Chart.js:", error);
      chartError.value = "Error al dibujar la gráfica.";
    }
  };

  onMounted(() => {
    renderChart();
  });
  
  watch(() => props.interests, () => {
    renderChart();
  }, { deep: true });

  return { canvasRef, chartError };
}