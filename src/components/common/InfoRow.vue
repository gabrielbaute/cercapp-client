<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'InfoRow',
  props: {
    label: { type: String, required: true },
    value: { type: [String, Number], default: 'N/A' }
  }
});
</script>

<template>
  <div class="flex flex-col py-2 border-b border-slate-50 last:border-0">
    <span class="text-[10px] uppercase font-bold text-slate-400 tracking-tight">{{ label }}</span>
    <span class="text-sm font-medium text-slate-800">{{ value }}</span>
  </div>
</template>