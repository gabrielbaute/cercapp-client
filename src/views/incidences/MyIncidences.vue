<script lang="ts">
import { defineComponent } from 'vue';
import useMyIncidences from './MyIncidences';
import IncidenceListItem from '../../components/incidences/IncidenceListItem.vue';
import ConfirmModal from '../../components/common/ConfirmModal.vue'; // Importamos el modal

export default defineComponent({
  name: 'MyIncidencesView',
  components: { IncidenceListItem, ConfirmModal }, // Lo registramos
  setup() {
    return { ...useMyIncidences() };
  }
});
</script>

<template>
  <div class="space-y-6 max-w-4xl mx-auto">
    
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left">
      <div>
        <h1 class="text-2xl font-bold text-cercapp-navy">Soporte y Ayuda</h1>
        <p class="text-gray-500 mt-1">Gestiona tus consultas o reporta problemas técnicos.</p>
      </div>
      <router-link to="/incidences/create" class="bg-cercapp-gold hover:bg-yellow-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm shrink-0">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
        Nuevo Ticket
      </router-link>
    </div>

    <div class="bg-white p-4 rounded-xl shadow-sm border border-cercapp-light flex items-center gap-4 text-left">
      <label class="text-sm font-bold text-cercapp-navy shrink-0">Mostrar:</label>
      <select v-model="currentFilter" class="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-cercapp-gold focus:border-cercapp-gold block w-full sm:w-auto p-2 outline-none font-medium">
        <option value="ACTIVE">Abiertos (Pendientes y En proceso)</option>
        <option value="ALL">Historial completo</option>
        <option value="RESOLVED">Solo Resueltos</option>
        <option value="CANCELLED">Solo Cancelados</option>
      </select>
    </div>

    <div v-if="isLoading" class="flex justify-center py-12">
      <span class="animate-spin h-8 w-8 border-4 border-cercapp-navy border-t-transparent rounded-full"></span>
    </div>
    
    <div v-else-if="errorMessage" class="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 text-left">
      {{ errorMessage }}
    </div>

    <div v-else-if="filteredIncidences.length === 0" class="bg-white rounded-2xl p-12 text-center border border-cercapp-light shadow-sm">
      <div class="w-16 h-16 bg-gray-50 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
      </div>
      <h3 class="text-lg font-bold text-cercapp-navy">Sin tickets</h3>
      <p class="text-gray-500 mt-1 max-w-sm mx-auto">No tienes consultas activas en esta categoría.</p>
    </div>

    <div v-else class="bg-white rounded-2xl shadow-sm border border-cercapp-light overflow-hidden p-4 space-y-3 text-left">
      <IncidenceListItem v-for="incidence in filteredIncidences" :key="incidence.id" :incidence="incidence">
        <template #actions v-if="incidence.status === 'PENDING'">
          <button 
            @click="confirmCancelIncidence(incidence.id)" 
            class="px-3 py-1.5 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition-colors shadow-sm"
          >
            Cancelar Ticket
          </button>
        </template>
      </IncidenceListItem>
    </div>

    <ConfirmModal 
      :show="modal.show" 
      :title="modal.title" 
      :message="modal.message" 
      :type="modal.type"
      :isLoading="isActionLoading"
      @confirm="executeCancelIncidence"
      @close="modal.show = false"
    />

  </div>
</template>