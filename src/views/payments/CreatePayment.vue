<script lang="ts">
import { defineComponent } from 'vue';
import useCreatePayment from './CreatePayment';

export default defineComponent({
  name: 'CreatePaymentView',
  setup() {
    return { ...useCreatePayment() };
  }
});
</script>

<template>
  <div class="max-w-3xl mx-auto space-y-6">
    
    <div class="flex items-center gap-4">
      <router-link to="/payments" class="p-2 bg-white border border-gray-200 rounded-lg text-gray-500 hover:text-cercapp-navy hover:bg-gray-50 transition-colors">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
      </router-link>
      <div>
        <h1 class="text-2xl font-bold text-cercapp-navy">Registrar Pago</h1>
        <p class="text-gray-500 mt-1">Reporta un nuevo aporte a tus planes de inversión.</p>
      </div>
    </div>

    <div v-if="isLoadingPlans" class="bg-white p-8 rounded-2xl shadow-sm border border-cercapp-light flex justify-center py-12">
      <span class="animate-spin h-8 w-8 border-4 border-cercapp-navy border-t-transparent rounded-full"></span>
    </div>

    <div v-else class="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-cercapp-light">
      
      <div v-if="errorMessage" class="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-6 border border-red-100">
        {{ errorMessage }}
      </div>

      <div v-if="activePlans.length === 0" class="text-center py-8">
        <p class="text-gray-600 font-medium">No tienes planes de inversión activos.</p>
        <p class="text-sm text-gray-500 mt-2 mb-4">Debes crear un plan antes de poder registrar pagos.</p>
        <router-link to="/plans/create" class="inline-block bg-cercapp-navy text-white font-semibold py-2 px-6 rounded-lg transition-colors hover:bg-blue-900">
          Crear un Plan
        </router-link>
      </div>

      <form v-else @submit.prevent="submitPayment" class="space-y-6">
        
        <div>
          <label class="block text-sm font-bold text-cercapp-navy mb-2">Plan de Inversión Destino</label>
          <select 
            v-model="form.investment_plan_id"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cercapp-gold outline-none bg-white"
            :disabled="isLoading"
            required
          >
            <option value="" disabled>Selecciona un plan...</option>
            <option v-for="plan in activePlans" :key="plan.id" :value="plan.id">
              {{ plan.plan_name }} ({{ plan.investment_type }})
            </option>
          </select>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div>
            <label class="block text-sm font-bold text-cercapp-navy mb-2">Método de Pago</label>
            <select 
              v-model="form.payment_method"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cercapp-gold outline-none bg-white"
              :disabled="isLoading"
            >
              <option value="TRANSFERENCIA">Transferencia Bancaria</option>
              <option value="PAGO_MOVIL">Pago Móvil</option>
              <option value="ZELLE">Zelle</option>
              <option value="EFECTIVO">Efectivo</option>
              <option value="BINANCE">Binance Pay</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-bold text-cercapp-navy mb-2">Monto (USD)</label>
            <div class="relative">
              <span class="absolute left-4 top-2.5 text-gray-500 font-medium">$</span>
              <input 
                v-model.number="form.divisa_amount" 
                type="number" 
                step="0.01"
                min="0.01"
                class="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cercapp-gold outline-none"
                :disabled="isLoading"
                required
              />
            </div>
          </div>

        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div>
            <label class="block text-sm font-bold text-cercapp-navy mb-1">Número de Referencia</label>
            <p class="text-xs text-gray-500 mb-2">El código de confirmación de tu banco.</p>
            <input 
              v-model="form.transaction_id" 
              type="text" 
              placeholder="Ej. 1234567890"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cercapp-gold outline-none"
              :disabled="isLoading"
              required
            />
          </div>

          <div>
            <label class="block text-sm font-bold text-cercapp-navy mb-1">Fecha de Emisión</label>
            <p class="text-xs text-gray-500 mb-2">¿Cuándo realizaste esta transacción?</p>
            <input 
              v-model="form.payment_date" 
              type="date" 
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cercapp-gold outline-none"
              :disabled="isLoading"
              required
            />
          </div>

        </div>

        <hr class="border-cercapp-light my-6" />

        <div class="flex justify-end gap-3">
          <router-link 
            to="/payments" 
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
            <span v-else>Registrar Pago</span>
          </button>
        </div>

      </form>

    </div>
  </div>
</template>