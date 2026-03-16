<script lang="ts">
import { defineComponent } from 'vue';
import useCreatePlan from './CreatePlan';

export default defineComponent({
  name: 'CreatePlanView',
  setup() {
    return { ...useCreatePlan() };
  }
});
</script>

<template>
  <div class="max-w-3xl mx-auto space-y-6">
    
    <div class="flex items-center gap-4">
      <router-link to="/plans" class="p-2 bg-white border border-gray-200 rounded-lg text-gray-500 hover:text-cercapp-navy hover:bg-gray-50 transition-colors">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
      </router-link>
      <div>
        <h1 class="text-2xl font-bold text-cercapp-navy">Crear Plan de Inversión</h1>
        <p class="text-gray-500 mt-1">Configura las reglas de tu nuevo portafolio.</p>
      </div>
    </div>

    <div class="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-cercapp-light">
      
      <div v-if="errorMessage" class="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-6 border border-red-100">
        {{ errorMessage }}
      </div>

      <form @submit.prevent="submitPlan" class="space-y-6">
        
        <div>
          <label class="block text-sm font-bold text-cercapp-navy mb-1">Nombre del Plan</label>
          <p class="text-xs text-gray-500 mb-2">Un nombre descriptivo para identificarlo (ej. Fondo para Retiro, Ahorros Universidad).</p>
          <input 
            v-model="form.plan_name" 
            type="text" 
            placeholder="Ej. Mi Inversión a 5 Años"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cercapp-gold outline-none"
            :disabled="isLoading"
          />
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div>
            <label class="block text-sm font-bold text-cercapp-navy mb-2">Tipo de Inversión</label>
            <select 
              v-model="form.investment_type"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cercapp-gold outline-none bg-white"
              :disabled="isLoading"
            >
              <option value="STANDARD">Estándar</option>
              <option value="PREMIUM">Premium</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-bold text-cercapp-navy mb-2">Frecuencia de Aportes</label>
            <select 
              v-model="form.payments_period"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cercapp-gold outline-none bg-white"
              :disabled="isLoading"
            >
              <option value="SEMANAL">Semanal</option>
              <option value="QUINCENAL">Quincenal</option>
              <option value="MENSUAL">Mensual</option>
              <option value="BIMESTRAL">Bimestral</option>
              <option value="TRIMESTRAL">Trimestral</option>
              <option value="SEMESTRAL">Semestral</option>
              <option value="ANUAL">Anual</option>
            </select>
          </div>

        </div>

        <div class="w-full md:w-1/2 md:pr-3">
          <label class="block text-sm font-bold text-cercapp-navy mb-1">Período de Capitalización</label>
          <p class="text-xs text-gray-500 mb-2">Representado en años (ej. 1 = Anual).</p>
          <input 
            v-model.number="form.capitalization_period" 
            type="number" 
            min="1"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cercapp-gold outline-none"
            :disabled="isLoading"
          />
        </div>

        <hr class="border-cercapp-light my-6" />

        <div class="flex justify-end gap-3">
          <router-link 
            to="/plans" 
            class="px-6 py-2 text-gray-600 font-semibold hover:bg-gray-100 rounded-lg transition-colors"
          >
            Cancelar
          </router-link>
          <button 
            type="submit" 
            :disabled="isLoading"
            class="bg-cercapp-navy hover:bg-blue-900 text-white font-semibold py-2 px-8 rounded-lg transition-colors flex items-center justify-center min-w-[150px]"
          >
            <span v-if="isLoading" class="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
            <span v-else>Guardar Plan</span>
          </button>
        </div>

      </form>

    </div>
  </div>
</template>