<script setup lang="ts">
import { useLogin } from './Login';
import { AppAssets } from '../../utils/assets';

// Desestructuramos las variables y la función de composable
const { email, password, isLoading, errorMessage, submitLogin } = useLogin();
</script>

<template>
    <div class="max-w-md w-full space-y-8 bg-white p-10 rounded-3xl shadow-xl border border-slate-100 relative z-10">
      
      <div class="text-center">
        <img class="mx-auto h-20 w-auto object-contain drop-shadow-sm" :src="AppAssets.isologoAzul" alt="Cercapp Isologo" />
        <h2 class="mt-6 text-3xl font-extrabold text-cercapp-navy tracking-tight">
          Bienvenido a CercAPP
        </h2>
        <p class="mt-2 text-sm text-slate-500 font-medium">
          Inicia sesión en tu cuenta
        </p>
      </div>

      <div v-if="errorMessage" class="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
        <p class="text-sm text-red-700 font-medium">{{ errorMessage }}</p>
      </div>

      <form class="mt-8 space-y-6" @submit.prevent="submitLogin">
        <div class="space-y-4">
          
          <div>
            <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Correo Electrónico</label>
            <input 
              v-model="email" 
              type="email" 
              placeholder="ejemplo@correo.com"
              class="appearance-none relative block w-full px-4 py-3 border border-slate-200 placeholder-slate-400 text-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-cercapp-navy focus:border-cercapp-navy sm:text-sm transition-all bg-slate-50 focus:bg-white"
              :disabled="isLoading"
            />
          </div>
          
          <div>
            <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Contraseña</label>
            <input 
              v-model="password" 
              type="password" 
              placeholder="••••••••"
              class="appearance-none relative block w-full px-4 py-3 border border-slate-200 placeholder-slate-400 text-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-cercapp-navy focus:border-cercapp-navy sm:text-sm transition-all bg-slate-50 focus:bg-white"
              :disabled="isLoading"
            />
          </div>
        </div>

        <div class="flex items-center justify-end mt-4">
          <div class="text-sm">
            <router-link to="/recover-password" class="font-bold text-cercapp-navy hover:text-cercapp-gold transition-colors">
              ¿Olvidaste tu contraseña?
            </router-link>
          </div>
        </div>

        <div>
          <button 
            type="submit" 
            :disabled="isLoading"
            class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-cercapp-navy hover:bg-cercapp-navy/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cercapp-navy transition-all shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
          >
            <span v-if="isLoading" class="flex items-center gap-2">
              <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              Ingresando...
            </span>
            <span v-else>Ingresar a mi cuenta</span>
          </button>
        </div>
        
        <div class="text-center mt-4 pt-4 border-t border-slate-100">
          <p class="text-sm text-slate-500">
            ¿No tienes cuenta? 
            <router-link to="/register" class="font-bold text-cercapp-navy hover:text-cercapp-gold transition-colors">
              Regístrate aquí
            </router-link>
          </p>
        </div>

      </form>
      
  </div>
</template>