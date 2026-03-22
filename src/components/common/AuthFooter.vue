<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'AuthFooter',
  setup() {
    const currentYear = new Date().getFullYear();
    
    // Usamos ts-ignore para que TypeScript deje de quejarse. 
    // Sabemos perfectamente que Vite inyectará este valor al hacer el 'npm run build'.
    // @ts-ignore
    const appVersion = typeof __APP_VERSION__ !== 'undefined' ? __APP_VERSION__ : '1.0.0';

    return { 
      currentYear, 
      appVersion 
    };
  }
});
</script>

<template>
  <footer class="absolute bottom-4 w-full text-center z-20 px-4">
    <div class="flex flex-col md:flex-row items-center justify-center gap-1 md:gap-4 text-xs text-slate-400 font-medium">
      <p>&copy; {{ currentYear }} CercAPP</p>
      <span class="hidden md:inline text-slate-300">|</span>
      <p>Todos los derechos reservados.</p>
      <span class="hidden md:inline text-slate-300">|</span>
      <p class="text-cercapp-navy font-bold bg-slate-200/50 px-2 py-0.5 rounded-md">
        v{{ appVersion }}
      </p>
    </div>
  </footer>
</template>