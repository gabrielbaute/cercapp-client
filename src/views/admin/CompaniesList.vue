<script lang="ts">
import { defineComponent } from 'vue';
import useCompaniesList from './CompaniesList';
import ConfirmModal from '../../components/common/ConfirmModal.vue';

export default defineComponent({
  name: 'CompaniesList',
  components: { ConfirmModal },
  setup() { return { ...useCompaniesList() }; }
});
</script>

<template>
  <div class="p-6 space-y-6">

    <div class="space-y-4 border-b border-slate-100 pb-6 text-left">
      <div>
        <h1 class="text-2xl font-bold text-slate-900">Directorio de Empresas Aliadas</h1>
        <p class="text-sm text-slate-500 font-medium italic">Gestión de organizaciones registradas en el sistema.</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        
        <div class="md:col-span-2">
          <label class="text-[10px] font-bold text-slate-400 uppercase ml-1">Buscar por Nombre o Correo</label>
          <input v-model="filters.nameOrEmail" type="text" placeholder="Ej. Inversiones C.A..." class="w-full mt-1 p-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500 transition-colors" />
        </div>

        <div>
          <label class="text-[10px] font-bold text-slate-400 uppercase ml-1">Estatus</label>
          <select v-model="filters.status" class="w-full mt-1 p-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none">
            <option value="">Todos los Estados</option>
            <option value="ACTIVE">Activas</option>
            <option value="INACTIVE">Inactivas</option>
            <option value="BLOCKED">Bloqueadas</option>
          </select>
        </div>

      </div>
    </div>
    <div v-if="isLoading" class="py-20 text-center text-slate-400 font-medium italic">
      Sincronizando registros empresariales...
    </div>

    <div v-else-if="filteredCompanies.length === 0" class="py-20 text-center bg-white rounded-2xl border border-dashed border-slate-300">
      <p class="text-slate-400 italic font-medium">No se encontraron empresas bajo estos criterios.</p>
    </div>
    <div v-else class="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden text-left">
      <table class="w-full text-sm">
        <thead class="bg-slate-50 text-slate-500 text-[10px] font-bold uppercase tracking-widest">
          <tr>
            <th class="px-6 py-4">Razón Social</th>
            <th class="px-6 py-4">Identificación</th>
            <th class="px-6 py-4 text-center">Estado</th>
            <th class="px-6 py-4 text-right">Acciones Administrativas</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100">
          <tr v-for="company in filteredCompanies" :key="company.id" class="hover:bg-slate-50/50 transition-colors">
            
            <td class="px-6 py-4">
              <div class="font-bold text-slate-900">{{ company.company_name || company.name || 'Sin Razón Social' }}</div>
              <div class="text-[11px] text-slate-400 font-mono">{{ company.email }}</div>
            </td>

            <td class="px-6 py-4">
              <div class="text-slate-700 font-mono font-medium">{{ company.document_number || company.tax_id || 'N/A' }}</div>
            </td>

            <td class="px-6 py-4 text-center">
              <span :class="company.status === 'ACTIVE' ? 'bg-green-100 text-green-700 border-green-200' : (company.status === 'BLOCKED' ? 'bg-red-100 text-red-700 border-red-200' : 'bg-slate-100 text-slate-700 border-slate-200')" class="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border tracking-wider">
                {{ company.status || 'UNKNOWN' }}
              </span>
            </td>

            <td class="px-6 py-4 text-right">
              <div class="flex justify-end gap-1.5">
                
                <button @click="handleBlock(company)" class="p-2 border rounded-lg transition-colors" :class="company.status === 'BLOCKED' ? 'bg-green-50 text-green-600 border-green-100 hover:bg-green-100' : 'bg-amber-50 text-amber-600 border-amber-100 hover:bg-amber-100'" :title="company.status === 'BLOCKED' ? 'Activar Empresa' : 'Bloquear Empresa'">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
                </button>

                <button @click="handleDelete(company)" class="p-2 bg-red-50 text-red-400 border border-red-100 rounded-lg hover:bg-red-100 hover:text-red-600 transition-colors" title="Eliminar Permanentemente">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                </button>

                <router-link :to="{ name: 'CompanyDetail', params: { id: company.id } }" class="p-2 bg-blue-50 text-blue-600 border border-blue-100 rounded-lg hover:bg-blue-100 transition-colors" title="Ver Expediente de Empresa">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                </router-link>

              </div>
            </td>

          </tr>
        </tbody>
      </table>
    </div>
    <ConfirmModal :show="modal.show" :title="modal.title" :message="modal.message" :type="modal.type" :isLoading="isActionLoading" @confirm="executeAction" @close="modal.show = false" />
    </div>
</template>