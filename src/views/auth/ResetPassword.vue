<script setup lang="ts">
import { useResetPassword } from './ResetPassword';
import isologoAzul from '../../assets/img/isologo_azul.png';

const { token, newPassword, confirmPassword, isLoading, errorMessage, successMessage, submitReset } = useResetPassword();
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
    
    <div class="absolute -top-24 -left-24 w-96 h-96 bg-cercapp-navy/5 rounded-full blur-3xl"></div>
    <div class="absolute -bottom-24 -right-24 w-96 h-96 bg-cercapp-gold/10 rounded-full blur-3xl"></div>

    <div class="max-w-md w-full bg-white rounded-3xl shadow-xl p-10 space-y-6 border border-slate-100 relative z-10">
      
      <div class="text-center">
        <img class="mx-auto h-20 w-auto object-contain drop-shadow-sm" :src="isologoAzul" alt="Cercapp Isologo" />
        <h1 class="mt-6 text-2xl font-extrabold text-cercapp-navy tracking-tight">Nueva Contraseña</h1>
        <p class="text-slate-500 mt-2 text-sm font-medium">Crea tu nueva contraseña segura para acceder a la plataforma.</p>
      </div>

      <div v-if="errorMessage" class="bg-red-50 text-red-700 p-4 rounded-xl text-sm font-medium border-l-4 border-red-500">
        {{ errorMessage }}
      </div>
      <div v-if="successMessage" class="bg-green-50 text-green-700 p-4 rounded-xl text-sm font-medium border-l-4 border-green-500">
        {{ successMessage }}
      </div>

      <form @submit.prevent="submitReset" class="space-y-6 mt-8">
        
        <div>
          <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Nueva Contraseña</label>
          <input 
            v-model="newPassword" 
            type="password" 
            placeholder="Mínimo 8 caracteres"
            class="appearance-none relative block w-full px-4 py-3 border border-slate-200 placeholder-slate-400 text-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-cercapp-navy focus:border-cercapp-navy sm:text-sm transition-all bg-slate-50 focus:bg-white"
            :disabled="isLoading || !token || !!successMessage"
          />
        </div>

        <div>
          <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Confirmar Contraseña</label>
          <input 
            v-model="confirmPassword" 
            type="password" 
            placeholder="Repite tu contraseña"
            class="appearance-none relative block w-full px-4 py-3 border border-slate-200 placeholder-slate-400 text-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-cercapp-navy focus:border-cercapp-navy sm:text-sm transition-all bg-slate-50 focus:bg-white"
            :disabled="isLoading || !token || !!successMessage"
          />
        </div>

        <button 
          type="submit" 
          :disabled="isLoading || !token || !!successMessage"
          class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-cercapp-navy hover:bg-cercapp-navy/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cercapp-navy transition-all shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
        >
          <span v-if="isLoading" class="flex items-center gap-2">
            <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            Guardando...
          </span>
          <span v-else>Guardar Contraseña</span>
        </button>
      </form>

      <div class="text-center text-sm mt-6">
        <router-link to="/login" class="font-bold text-cercapp-navy hover:text-cercapp-gold transition-colors">
          Cancelar y volver al Login
        </router-link>
      </div>

    </div>
  </div>
</template>