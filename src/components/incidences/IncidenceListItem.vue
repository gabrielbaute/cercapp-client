<script lang="ts">
import { defineComponent, type PropType } from 'vue';
import { useIncidenceListItem } from './IncidenceListItem';
import type { components } from '../../api/v1/schema';

export default defineComponent({
  name: 'IncidenceListItem',
  props: {
    incidence: {
      type: Object as PropType<components["schemas"]["IncidenceResponse"]>,
      required: true
    }
  },
  setup(props) {
    return { ...useIncidenceListItem(props) };
  }
});
</script>

<template>
  <div class="p-5 bg-white border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors shadow-sm flex flex-col sm:flex-row gap-4 sm:items-center justify-between">
    
    <div class="flex items-start gap-4 flex-1">
      <div class="w-10 h-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center shrink-0 mt-1">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
      </div>
      
      <div class="flex-1 min-w-0">
        <div class="flex items-center gap-2 mb-1">
          <span class="text-xs font-bold text-gray-400 uppercase tracking-wider">Ticket #{{ incidence.id.split('-')[0] }}</span>
          <span :class="statusBadge.class" class="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide">
            {{ statusBadge.text }}
          </span>
        </div>
        <p class="text-sm text-gray-800 font-medium line-clamp-2" :title="incidence.content">
          {{ truncatedContent }}
        </p>
        <p class="text-xs text-gray-500 mt-2">Creado el: {{ new Date(incidence.created_at).toLocaleDateString() }}</p>
      </div>
    </div>

    <div class="flex shrink-0">
      <slot name="actions"></slot>
    </div>

  </div>
</template>