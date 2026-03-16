<script lang="ts">
import { defineComponent } from 'vue';
import useMyPlans from './MyPlans';
import PlanCard from '../../components/plans/PlanCard.vue';

export default defineComponent({
  name: 'MyPlansView',
  components: { PlanCard }, // Declaramos el componente reutilizable
  setup() {
    return { ...useMyPlans() };
  }
});
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-cercapp-navy">Mis Planes de Inversión</h1>
        <p class="text-gray-500 mt-1">Gestiona y visualiza el estado de tus portafolios.</p>
      </div>
      <router-link to="/plans/create" class="bg-cercapp-gold hover:bg-yellow-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
        Nuevo Plan
      </router-link>
    </div>

    <div v-if="isLoading" class="flex justify-center py-12">
      <span class="animate-spin h-8 w-8 border-4 border-cercapp-navy border-t-transparent rounded-full"></span>
    </div>
    
    <div v-else-if="errorMessage" class="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100">
      {{ errorMessage }}
    </div>

    <div v-else-if="planes.length === 0" class="bg-white rounded-2xl p-12 text-center border border-cercapp-light shadow-sm">
      <h3 class="text-lg font-bold text-cercapp-navy">Sin planes activos</h3>
      <p class="text-gray-500 mt-1">No tienes ningún plan de inversión registrado actualmente.</p>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <PlanCard v-for="plan in planes" :key="plan.id" :plan="plan" />
    </div>
  </div>
</template>