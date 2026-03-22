import { ref, reactive, watch, onMounted, shallowRef } from 'vue';
import Chart from 'chart.js/auto';
import { 
  CalculadoraInteresCompuesto, 
  FRECUENCIA, 
  UNIDAD_TIEMPO, 
  type FrecuenciaType, 
  type UnidadTiempoType, 
  type RegistroHistorial 
} from '../../utils/calculator';

export default function useCalculator() {
  // Instanciamos la lógica matemática
  const calculadora = new CalculadoraInteresCompuesto();

  // Referencias al DOM y Chart.js (shallowRef evita problemas de reactividad con Vue 3)
  const chartCanvas = ref<HTMLCanvasElement | null>(null);
  const chartInstance = shallowRef<Chart | null>(null);

  // Estado Reactivo del Formulario
  const form = reactive({
    montoInicial: 1000,
    aportePeriodico: 100,
    tasaAnual: 7, // 7% o 9%
    unidadTiempo: UNIDAD_TIEMPO.ANIOS as UnidadTiempoType,
    duracion: 5,
    frecuencia: FRECUENCIA.MENSUAL as FrecuenciaType,
    tipoCalculo: 'capitalizacion' // 'simple' o 'capitalizacion'
  });

  const resultados = ref<RegistroHistorial[]>([]);
  const isCalculated = ref(false);

  // Lógica reactiva: Si cambia la unidad de tiempo, ajustamos la duración y el tipo de cálculo
  watch(() => form.unidadTiempo, (nuevaUnidad) => {
    if (nuevaUnidad === UNIDAD_TIEMPO.MESES) {
      form.duracion = 12;
      form.tipoCalculo = 'simple'; // La capitalización anual no aplica en meses estricto
    } else {
      form.duracion = 5;
    }
  });

  const calcular = () => {
    try {
      const tasaDecimal = form.tasaAnual / 100;
      
      if (form.tipoCalculo === 'simple') {
        resultados.value = calculadora.simularCrecimientoPorPeriodo(
          form.montoInicial, form.aportePeriodico, tasaDecimal, form.duracion, form.unidadTiempo, form.frecuencia
        );
      } else {
        resultados.value = calculadora.simularCrecimientoConCapitalizacion(
          form.montoInicial, form.aportePeriodico, tasaDecimal, form.duracion, form.unidadTiempo, form.frecuencia
        );
      }

      isCalculated.value = true;
      
      // Le damos un respiro al DOM para que el v-show muestre el canvas antes de dibujar
      setTimeout(() => {
        dibujarGrafico();
      }, 50);
      
    } catch (error) {
      console.error("Error al calcular", error);
      alert("Revisa los datos ingresados.");
    }
  };

  const dibujarGrafico = () => {
    if (!chartCanvas.value) return;

    // Destruir gráfico anterior si existe (evita sobreposiciones)
    if (chartInstance.value) {
      chartInstance.value.destroy();
    }

    const labels = resultados.value.map(r => r.etiqueta || `P${r.periodo}`);
    const dataAcumulado = resultados.value.map(r => r.acumulado);

    chartInstance.value = new Chart(chartCanvas.value, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: 'Crecimiento de la Inversión ($)',
          data: dataAcumulado,
          borderColor: '#002442', // cercapp-navy
          backgroundColor: 'rgba(0, 36, 66, 0.1)',
          fill: true,
          tension: 0.4 // Curva suave
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'top' }
        }
      }
    });
  };

  const limpiar = () => {
    isCalculated.value = false;
    resultados.value = [];
    if (chartInstance.value) chartInstance.value.destroy();
  };

  // Calcular por defecto al montar la vista
  onMounted(() => {
    calcular();
  });

  return {
    form,
    resultados,
    isCalculated,
    chartCanvas,
    calcular,
    limpiar,
    // Exportamos las constantes para que el template las pueda usar
    FRECUENCIA,
    UNIDAD_TIEMPO
  };
}