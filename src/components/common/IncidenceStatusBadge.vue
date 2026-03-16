<script lang="ts">
import { defineComponent, computed } from 'vue';

export default defineComponent({
  name: 'IncidenceStatusBadge',
  props: { status: { type: String, required: true } },
  setup(props) {
    const statusConfig = computed(() => {
      switch (props.status) {
        case 'PENDING': return { label: 'Abierta', classes: 'bg-amber-100 text-amber-700 border-amber-200' };
        case 'IN_PROGRESS': return { label: 'En Revisión', classes: 'bg-blue-100 text-blue-700 border-blue-200' };
        case 'RESOLVED': return { label: 'Resuelta', classes: 'bg-green-100 text-green-700 border-green-200' };
        case 'CANCELLED': return { label: 'Cancelada', classes: 'bg-slate-100 text-slate-700 border-slate-200' };
        default: return { label: props.status, classes: 'bg-gray-100 text-gray-700 border-gray-200' };
      }
    });
    return { statusConfig };
  }
});
</script>

<template>
  <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border tracking-wider inline-block" :class="statusConfig.classes">
    {{ statusConfig.label }}
  </span>
</template>