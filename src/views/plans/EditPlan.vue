<script lang="ts">
import { defineComponent } from 'vue';
import useEditPlan from './EditPlan';

export default defineComponent({
  name: 'EditPlanView',
  setup() {
    return { ...useEditPlan() };
  }
});
</script>

<template>
  <div class="max-w-3xl mx-auto space-y-6">
    
    <div class="flex items-center gap-4">
      <router-link :to="{ name: 'PlanDetail', params: { id: planId } }" class="p-2 bg-white border border-gray-200 rounded-lg text-gray-500 hover:text-cercapp-navy hover:bg-gray-50 transition-colors">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
      </router-link>
      <div>
        <h1 class="text-2xl font-bold text-cercapp-navy">Editar Plan</h1>
        <p class="text-gray-500 mt-1">Modifica las reglas de tu portafolio.</p>
      </div>
    </div>

    <div v-if="isLoading" class="bg-white p-8 rounded-2xl shadow-sm border border-cercapp-light flex justify-center py-12">
      <span class="animate-spin h-8 w-8 border-4 border-cercapp-navy border-t-transparent rounded-full"></span>
    </div>

    <div v-else class="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-cercapp-light">
      
      <div v-if="errorMessage" class="bg-red-50 text-red-600 p-4 rounded-xl text-sm mb-6 border border-red-100 flex items-start gap-3">
        <svg class="w-5 h-5 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
        <p>{{ errorMessage }}</p>
      </div>

      <form @submit.prevent="submitUpdate" class="space-y-6">
        
        <div>
          <label class="block text-sm font-bold text-cercapp-navy mb-1">Nombre del Plan</label>
          <input 
            v-model="form.plan_name" 
            type="text" 
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cercapp-gold outline-none"
            :disabled="isSaving || originalStatus === 'BLOCKED'"
          />
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-bold text-cercapp-navy mb-2">Tipo de Inversión</label>
            <select v-model="form.investment_type" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cercapp-gold outline-none bg-white" :disabled="isSaving || originalStatus === 'BLOCKED'">
              <option value="STANDARD">Estándar</option>
              <option value="PREMIUM">Premium</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-bold text-cercapp-navy mb-2">Frecuencia de Aportes</label>
            <select v-model="form.payments_period" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cercapp-gold outline-none bg-white" :disabled="isSaving || originalStatus === 'BLOCKED'">
              <option value="SEMANAL">Semanal</option>
              <option value="QUINCENAL">Quincenal</option>
              <option value="MENSUAL">Mensual</option>
              <option value="ANUAL">Anual</option>
              </select>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-bold text-cercapp-navy mb-1">Período de Capitalización</label>
            <input v-model.number="form.capitalization_period" type="number" min="1" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cercapp-gold outline-none" :disabled="isSaving || originalStatus === 'BLOCKED'" />
          </div>

          <div>
            <label class="block text-sm font-bold text-cercapp-navy mb-1">Estado del Plan</label>
            <select v-model="form.status" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cercapp-gold outline-none bg-white" :disabled="isSaving || originalStatus === 'BLOCKED'">
              <option value="ACTIVE">Activo</option>
              <option value="INACTIVE">Inactivo (Desactivar)</option>
              <option v-if="originalStatus === 'BLOCKED'" value="BLOCKED">Bloqueado (Solo Admin)</option>
            </select>
            <p v-if="form.status === 'INACTIVE'" class="text-xs text-yellow-600 mt-2 flex items-center gap-1">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              Solo podrás desactivarlo si no tienes pagos pendientes por aprobar.
            </p>
          </div>
        </div>

        <hr class="border-cercapp-light my-6" />

        <div class="flex justify-end gap-3">
          <button type="submit" :disabled="isSaving || originalStatus === 'BLOCKED'" class="bg-cercapp-navy hover:bg-blue-900 disabled:bg-gray-400 text-white font-semibold py-2 px-8 rounded-lg transition-colors flex items-center justify-center min-w-[150px]">
            <span v-if="isSaving" class="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
            <span v-else>Actualizar Plan</span>
          </button>
        </div>

      </form>
    </div>
  </div>
</template>