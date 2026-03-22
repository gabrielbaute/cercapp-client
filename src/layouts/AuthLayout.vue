<script setup lang="ts">
import AuthFooter from '../components/common/AuthFooter.vue';
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
    
    <div class="absolute top-10 left-10 w-96 h-96 bg-cercapp-navy/5 rounded-full blur-3xl pointer-events-none"></div>
    <div class="absolute bottom-10 right-10 w-96 h-96 bg-cercapp-gold/10 rounded-full blur-3xl pointer-events-none"></div>

    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
    
    <AuthFooter />

  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>