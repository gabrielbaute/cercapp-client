<script lang="ts">
import { defineComponent } from 'vue';
import { usePaymentHistoryChart } from './PaymentHistoryChart';

export default defineComponent({
  name: 'PaymentHistoryChart',
  props: {
    payments: { 
      type: Array as () => any[], 
      required: true 
    },
    title: { 
      type: String, 
      default: 'Histórico' 
    }
  },
  setup(props) {
    return { ...usePaymentHistoryChart(props) };
  }
});
</script>

<template>
  <div class="w-full h-full min-h-[300px] p-4 flex flex-col">
    
    <h4 class="text-xs font-bold text-slate-400 uppercase mb-4 shrink-0 tracking-wider">
      {{ title }}
    </h4>
    
    <div class="flex-grow relative w-full h-full">
      <canvas ref="canvasRef"></canvas>
    </div>

  </div>
</template>