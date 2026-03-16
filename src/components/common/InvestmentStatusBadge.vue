<script lang="ts">
import { defineComponent, computed } from 'vue';

export default defineComponent({
  name: 'InvestmentStatusBadge',
  props: {
    status: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const statusConfig = computed(() => {
      switch (props.status) {
        case 'ACTIVE':
          return { label: 'Activo', classes: 'bg-green-100 text-green-700 border-green-200' };
        case 'BLOCKED':
          return { label: 'Bloqueado', classes: 'bg-red-100 text-red-700 border-red-200' };
        case 'INACTIVE':
          return { label: 'Inactivo', classes: 'bg-slate-100 text-slate-600 border-slate-200' };
        default:
          return { label: props.status, classes: 'bg-gray-100 text-gray-700 border-gray-200' };
      }
    });

    return { statusConfig };
  }
});
</script>

<template>
  <span 
    class="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border"
    :class="statusConfig.classes"
  >
    {{ statusConfig.label }}
  </span>
</template>