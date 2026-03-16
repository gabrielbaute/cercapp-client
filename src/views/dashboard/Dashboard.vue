<script lang="ts">
import { defineComponent } from 'vue';
import useDashboard from './Dashboard';

export default defineComponent({
  name: 'DashboardView',
  setup() {
    return { ...useDashboard() };
  }
});
</script>

<template>
  <div class="space-y-6">
    
    <div>
      <h1 class="text-2xl font-bold text-cercapp-navy">
        Hola, {{ authStore.user?.first_name || authStore.company?.business_name || 'Bienvenido' }} 👋
      </h1>
      <p class="text-gray-500 mt-1">Aquí tienes un resumen de tu portafolio en CercAPP.</p>
    </div>

    <div v-if="isLoading" class="flex justify-center items-center py-12">
      <span class="animate-spin h-10 w-10 border-4 border-cercapp-navy border-t-transparent rounded-full"></span>
    </div>

    <div v-else-if="errorMessage" class="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100">
      {{ errorMessage }}
    </div>

    <div v-else class="space-y-8">
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        <div class="bg-white p-6 rounded-2xl shadow-sm border border-cercapp-light flex items-center gap-4">
          <div class="w-12 h-12 bg-blue-50 text-cercapp-navy rounded-full flex items-center justify-center">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          </div>
          <div>
            <h3 class="text-gray-500 text-sm font-medium">Planes Activos</h3>
            <p class="text-2xl font-bold text-cercapp-navy mt-1">{{ planesActivos }}</p>
          </div>
        </div>

        <div class="bg-white p-6 rounded-2xl shadow-sm border border-cercapp-light flex items-center gap-4">
          <div class="w-12 h-12 bg-yellow-50 text-cercapp-gold rounded-full flex items-center justify-center">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          </div>
          <div>
            <h3 class="text-gray-500 text-sm font-medium">Capital Confirmado</h3>
            <p class="text-2xl font-bold text-cercapp-navy mt-1">$ {{ capitalInvertido.toFixed(2) }}</p>
          </div>
        </div>

        <div class="bg-white p-6 rounded-2xl shadow-sm border border-cercapp-light flex items-center gap-4">
          <div class="w-12 h-12 bg-gray-50 text-gray-600 rounded-full flex items-center justify-center">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
          </div>
          <div>
            <h3 class="text-gray-500 text-sm font-medium">Total de Planes</h3>
            <p class="text-2xl font-bold text-gray-700 mt-1">{{ planes.length }}</p>
          </div>
        </div>

      </div>

      <div v-if="pagos.filter(p => p.status === 'COMPLETED').length > 0" class="bg-white p-6 rounded-2xl shadow-sm border border-cercapp-light">
        <h3 class="text-lg font-bold text-cercapp-navy mb-4">Evolución de tu Capital</h3>
        <div class="h-72 w-full">
          <canvas ref="chartCanvas"></canvas>
        </div>
      </div>

      <div v-if="planes.length === 0" class="bg-blue-50 rounded-2xl p-8 text-center border border-blue-100">
        <h3 class="text-xl font-bold text-cercapp-navy">¡Es momento de proyectar tu futuro!</h3>
        <p class="text-gray-600 mt-2 mb-6 max-w-lg mx-auto">Aún no tienes planes de inversión registrados. Utiliza nuestra calculadora para simular ganancias o crea tu primer plan ahora mismo.</p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <router-link to="/calculator" class="bg-white text-cercapp-navy font-semibold py-2 px-6 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
            Simular Inversión
          </router-link>
          <router-link to="/plans/create" class="bg-cercapp-navy hover:bg-blue-900 text-white font-semibold py-2 px-6 rounded-lg transition-colors">
            Crear Plan de Inversión
          </router-link>
        </div>
      </div>

    </div>
  </div>
</template>