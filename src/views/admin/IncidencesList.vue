<script lang="ts">
import { defineComponent } from 'vue';
import useIncidencesList from './IncidencesList';
import IncidenceStatusBadge from '../../components/common/IncidenceStatusBadge.vue';

export default defineComponent({
  name: 'IncidencesList',
  components: { IncidenceStatusBadge },
  setup() { return { ...useIncidencesList() }; }
});
</script>

<template>
  <div class="p-6 space-y-6">

    <div class="space-y-4 border-b border-slate-100 pb-6 text-left">
      <div>
        <h1 class="text-2xl font-bold text-slate-900">Mesa de Ayuda (Tickets)</h1>
        <p class="text-sm text-slate-500 font-medium italic">Gestión de requerimientos y soporte técnico.</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        
        <div>
          <label class="text-[10px] font-bold text-slate-400 uppercase ml-1">Usuario (Email)</label>
          <input v-model="filters.email" type="text" placeholder="Buscar por correo..." class="w-full mt-1 p-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500 transition-colors" />
        </div>

        <div>
          <label class="text-[10px] font-bold text-slate-400 uppercase ml-1">Estado de la Incidencia</label>
          <select v-model="filters.status" class="w-full mt-1 p-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none">
            <option value="">Cualquier Estado</option>
            <option value="PENDING">Abiertas (Pendientes)</option>
            <option value="IN_PROGRESS">En Revisión</option>
            <option value="RESOLVED">Resueltas (Cerradas)</option>
            <option value="CANCELED">Canceladas</option>
          </select>
        </div>

        <div class="flex flex-col justify-end">
          <button @click="fetchIncidences" class="w-full p-2 bg-slate-900 text-white rounded-lg text-xs font-bold transition-all shadow-sm hover:bg-slate-800">
            ↻ Recargar Servidor
          </button>
        </div>

      </div>
    </div>
    <div v-if="isLoading" class="py-20 text-center text-slate-400 font-medium italic">
      Sincronizando tickets de soporte...
    </div>

    <div v-else-if="filteredIncidences.length === 0" class="py-20 text-center bg-white rounded-2xl border border-dashed border-slate-300">
      <p class="text-slate-400 italic font-medium">No se encontraron tickets con los criterios actuales.</p>
    </div>
    <div v-else class="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden text-left">
      <table class="w-full text-sm">
        
        <thead class="bg-slate-50 text-slate-500 text-[10px] font-bold uppercase tracking-widest">
          <tr>
            <th class="px-6 py-4">Reportado Por</th>
            <th class="px-6 py-4">Asunto / Mensaje</th>
            <th class="px-6 py-4 text-center">Estado</th>
            <th class="px-6 py-4 text-center">Fecha</th>
            <th class="px-6 py-4 text-right">Acción</th>
          </tr>
        </thead>
        
        <tbody class="divide-y divide-slate-100">
          <tr v-for="inc in filteredIncidences" :key="inc.id" class="hover:bg-slate-50/50 transition-colors">
            
            <td class="px-6 py-4">
              <div class="font-bold text-slate-900">{{ inc.user_first_name }} {{ inc.user_last_name }}</div>
              <div class="text-[11px] text-slate-400 font-mono">{{ inc.user_email }}</div>
            </td>

            <td class="px-6 py-4">
              <div class="text-slate-700 font-medium line-clamp-2 max-w-xs" :title="inc.content">
                {{ inc.content }}
              </div>
              <div v-if="inc.resource_path" class="text-[10px] text-blue-500 mt-1 font-bold flex items-center gap-1">
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"/></svg>
                Archivo Adjunto
              </div>
            </td>

            <td class="px-6 py-4 text-center">
              <IncidenceStatusBadge :status="inc.status" />
            </td>

            <td class="px-6 py-4 text-center">
              <div class="text-slate-900 font-bold text-xs">{{ new Date(inc.created_at).toLocaleDateString() }}</div>
            </td>

            <td class="px-6 py-4 text-right">
              <router-link :to="{ name: 'IncidenceDetail', params: { id: inc.id } }" class="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-600 border border-blue-100 rounded-lg hover:bg-blue-100 font-bold text-xs transition-colors">
                Revisar
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
              </router-link>
            </td>

          </tr>
        </tbody>
      </table>
    </div>
    <div v-if="totalPages > 1" class="flex justify-between items-center bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
      <button @click="changePage(pagination.page - 1)" :disabled="pagination.page === 1" class="px-4 py-2 bg-slate-50 text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-100 disabled:opacity-50 font-bold text-xs transition-colors">
        Anterior
      </button>
      <span class="text-sm text-slate-500 font-medium">Página {{ pagination.page }} de {{ totalPages }}</span>
      <button @click="changePage(pagination.page + 1)" :disabled="pagination.page === totalPages" class="px-4 py-2 bg-slate-50 text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-100 disabled:opacity-50 font-bold text-xs transition-colors">
        Siguiente
      </button>
    </div>
    </div>
</template>