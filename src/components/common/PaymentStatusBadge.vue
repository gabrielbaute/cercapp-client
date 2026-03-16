<script lang="ts">
import { defineComponent, computed } from 'vue';

export default defineComponent({
  name: 'PaymentStatusBadge',
  props: {
    status: {
      type: String, // 'PENDING', 'COMPLETED', 'REJECTED', 'REFUNDED'
      required: true
    }
  },
  setup(props) {
    const statusConfig = computed(() => {
      switch (props.status) {
        case 'COMPLETED':
          return { label: 'Completado', classes: 'bg-green-100 text-green-700 border-green-200' };
        case 'PENDING':
          return { label: 'Pendiente', classes: 'bg-amber-100 text-amber-700 border-amber-200' };
        case 'REJECTED':
          return { label: 'Rechazado', classes: 'bg-red-100 text-red-700 border-red-200' };
        case 'REFUNDED':
          return { label: 'Reembolsado', classes: 'bg-blue-100 text-blue-700 border-blue-200' };
        default:
          return { label: props.status, classes: 'bg-slate-100 text-slate-700 border-slate-200' };
      }
    });

    return { statusConfig };
  }
});
</script>

<template>
  <span 
    class="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border tracking-wider inline-block"
    :class="statusConfig.classes"
  >
    {{ statusConfig.label }}
  </span>
</template>