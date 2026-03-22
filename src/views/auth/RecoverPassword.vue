<script setup lang="ts">
import { useRecoverPassword } from './RecoverPassword';
import { AppAssets } from '../../utils/assets';

const { email, isLoading, errorMessage, successMessage, submitRecover } = useRecoverPassword();
</script>

<template>
    <div class="max-w-md w-full bg-white rounded-3xl shadow-xl p-10 space-y-6 border border-slate-100 relative z-10">
      
      <div class="text-center">
        <img class="mx-auto h-20 w-auto object-contain drop-shadow-sm" :src="AppAssets.isologoAzul" alt="Cercapp Isologo" />
        <h1 class="mt-6 text-2xl font-extrabold text-cercapp-navy tracking-tight">Recuperar Acceso</h1>
        <p class="text-slate-500 mt-2 text-sm font-medium">Ingresa tu correo y te enviaremos instrucciones para restablecer tu contraseña.</p>
      </div>

      <div v-if="errorMessage" class="bg-red-50 text-red-700 p-4 rounded-xl text-sm font-medium border-l-4 border-red-500">
        {{ errorMessage }}
      </div>
      <div v-if="successMessage" class="bg-green-50 text-green-700 p-4 rounded-xl text-sm font-medium border-l-4 border-green-500">
        {{ successMessage }}
      </div>

      <form @submit.prevent="submitRecover" class="space-y-6 mt-8">
        <div>
          <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Correo Electrónico</label>
          <input 
            v-model="email" 
            type="email" 
            placeholder="ejemplo@correo.com"
            class="appearance-none relative block w-full px-4 py-3 border border-slate-200 placeholder-slate-400 text-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-cercapp-navy focus:border-cercapp-navy sm:text-sm transition-all bg-slate-50 focus:bg-white"
            :disabled="isLoading || !!successMessage"
          />
        </div>

        <button 
          type="submit" 
          :disabled="isLoading || !!successMessage"
          class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-cercapp-navy hover:bg-cercapp-navy/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cercapp-navy transition-all shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
        >
          <span v-if="isLoading" class="flex items-center gap-2">
            <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            Enviando Instrucciones...
          </span>
          <span v-else>Enviar Enlace de Recuperación</span>
        </button>
      </form>

      <div class="text-center text-sm mt-6">
        <router-link to="/login" class="font-bold text-cercapp-navy hover:text-cercapp-gold flex items-center justify-center gap-1 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Volver al Inicio de Sesión
        </router-link>
      </div>
      
    </div>
</template>