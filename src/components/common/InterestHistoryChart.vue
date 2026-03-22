<script lang="ts">
import { defineComponent } from 'vue';
import { useInterestHistoryChart } from './InterestHistoryChart';

export default defineComponent({
  name: 'InterestHistoryChart',
  props: {
    interests: { 
      type: Array as () => any[], 
      required: true 
    },
    title: { 
      type: String, 
      default: 'Histórico de Rendimientos' 
    }
  },
  setup(props) {
    return { ...useInterestHistoryChart(props) };
  }
});
</script>

<template>
  <div class="w-full h-full min-h-[300px] p-4 flex flex-col">
    
    <h4 class="text-xs font-bold text-cercapp-gold uppercase mb-4 shrink-0 tracking-wider">
      {{ title }}
    </h4>
    
    <div v-if="chartError" class="flex-grow flex items-center justify-center bg-red-50 rounded-lg border border-red-100 p-4 text-red-600 text-sm font-bold">
      {{ chartError }} (Abre la consola F12 para más detalles)
    </div>

    <div v-else class="flex-grow relative w-full h-full">
      <canvas ref="canvasRef"></canvas>
    </div>

  </div>
</template>