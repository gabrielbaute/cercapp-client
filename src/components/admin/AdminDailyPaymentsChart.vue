<script lang="ts">
import { defineComponent } from 'vue';
import { useAdminDailyPaymentsChart } from './AdminDailyPaymentsChart';

export default defineComponent({
  name: 'AdminDailyPaymentsChart',
  props: {
    payments: { type: Array as () => any[], required: true }
  },
  setup(props) {
    return { ...useAdminDailyPaymentsChart(props) };
  }
});
</script>

<template>
  <div class="w-full h-full relative">
    <canvas ref="canvasRef"></canvas>
  </div>
</template>