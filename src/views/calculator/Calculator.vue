<script setup lang="ts">
import { ref, reactive, watch, onMounted, shallowRef } from 'vue';
import Chart from 'chart.js/auto';
import { CalculadoraInteresCompuesto, FRECUENCIA, UNIDAD_TIEMPO, type FrecuenciaType, type UnidadTiempoType, type RegistroHistorial } from '../../utils/calculator';

// Instanciamos la lógica matemática
const calculadora = new CalculadoraInteresCompuesto();

// Referencias al DOM
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
    form.tipoCalculo = 'simple'; // La capitalización anual no aplica en meses
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
    dibujarGrafico();
  } catch (error) {
    console.error("Error al calcular", error);
    alert("Revisa los datos ingresados.");
  }
};

const dibujarGrafico = () => {
  if (!chartCanvas.value) return;

  // Destruir gráfico anterior si existe (evita sobreposiciones de Chart.js)
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
        borderColor: '#002442', // Tu color navy corporativo
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
</script>

<template>
  <div class="space-y-6">
    
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-cercapp-navy">Calculadora de Inversión</h1>
        <p class="text-gray-500 mt-1">Proyecta tu futuro con interés compuesto.</p>
      </div>
    </div>

    <div class="bg-white p-6 rounded-2xl shadow-sm border border-cercapp-light">
      <form @submit.prevent="calcular" class="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Monto Inicial ($)</label>
            <input v-model.number="form.montoInicial" type="number" step="0.01" min="0" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cercapp-gold outline-none" required />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Aporte Periódico ($)</label>
            <input v-model.number="form.aportePeriodico" type="number" step="0.01" min="0" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cercapp-gold outline-none" required />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Frecuencia de Aportes</label>
            <select v-model="form.frecuencia" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cercapp-gold outline-none bg-white">
              <option :value="FRECUENCIA.ANUAL">Anual</option>
              <option :value="FRECUENCIA.SEMESTRAL">Semestral</option>
              <option :value="FRECUENCIA.TRIMESTRAL">Trimestral</option>
              <option :value="FRECUENCIA.MENSUAL">Mensual</option>
              <option :value="FRECUENCIA.QUINCENAL">Quincenal</option>
              <option :value="FRECUENCIA.SEMANAL">Semanal</option>
            </select>
          </div>
        </div>

        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Tasa de Interés Anual</label>
            <select v-model.number="form.tasaAnual" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cercapp-gold outline-none bg-white">
              <option :value="7">7% (Plan Estándar)</option>
              <option :value="9">9% (Plan Premium)</option>
            </select>
          </div>
          
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Proyectar por</label>
              <select v-model="form.unidadTiempo" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cercapp-gold outline-none bg-white">
                <option :value="UNIDAD_TIEMPO.MESES">Meses</option>
                <option :value="UNIDAD_TIEMPO.ANIOS">Años</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Duración</label>
              <input v-model.number="form.duracion" type="number" min="1" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cercapp-gold outline-none" required />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Tipo de Cálculo</label>
            <select v-model="form.tipoCalculo" :disabled="form.unidadTiempo === UNIDAD_TIEMPO.MESES" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cercapp-gold outline-none bg-white disabled:bg-gray-100">
              <option value="simple">Simple (Menos de un año)</option>
              <option value="capitalizacion">Compuesto (Capitalización anual)</option>
            </select>
          </div>
        </div>

        <div class="md:col-span-2 flex gap-3 mt-2">
          <button type="submit" class="bg-cercapp-navy hover:bg-blue-900 text-white font-semibold py-2 px-6 rounded-lg transition-colors">
            Calcular Proyección
          </button>
          <button type="button" @click="limpiar" class="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-6 rounded-lg transition-colors">
            Limpiar
          </button>
        </div>
      </form>
    </div>

    <div v-show="isCalculated" class="space-y-6">
      
      <div class="bg-white p-6 rounded-2xl shadow-sm border border-cercapp-light h-80">
        <canvas ref="chartCanvas"></canvas>
      </div>

      <div class="bg-white rounded-2xl shadow-sm border border-cercapp-light overflow-hidden">
        <div class="p-4 border-b border-cercapp-light bg-gray-50">
          <h3 class="font-bold text-cercapp-navy">Desglose de Crecimiento</h3>
        </div>
        <div class="overflow-x-auto max-h-96">
          <table class="w-full text-sm text-left text-gray-600">
            <thead class="text-xs text-gray-700 uppercase bg-gray-100 sticky top-0">
              <tr>
                <th class="px-6 py-3">Período</th>
                <th class="px-6 py-3">Aporte</th>
                <th class="px-6 py-3">Ganancia Acumulada</th>
                <th class="px-6 py-3 text-right text-cercapp-navy">Total Acumulado</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="fila in resultados" :key="fila.periodo" class="border-b hover:bg-gray-50">
                <td class="px-6 py-3 font-medium text-gray-900">{{ fila.etiqueta || fila.periodo }}</td>
                <td class="px-6 py-3">$ {{ fila.aporte.toFixed(2) }}</td>
                <td class="px-6 py-3 text-green-600">$ {{ fila.ganancia.toFixed(2) }}</td>
                <td class="px-6 py-3 text-right font-bold text-cercapp-navy">$ {{ fila.acumulado.toFixed(2) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>

  </div>
</template>