<script setup lang="ts">
import { ref } from 'vue';
import Sidebar from '../components/layout/Sidebar.vue';
import TopBar from '../components/layout/TopBar.vue';

// Estado reactivo para el menú en móviles
const isMobileSidebarOpen = ref(false);

const toggleSidebar = () => {
  isMobileSidebarOpen.value = !isMobileSidebarOpen.value;
};
</script>

<template>
  <div class="min-h-screen flex bg-gray-50 overflow-hidden">
    
    <Sidebar :isOpen="isMobileSidebarOpen" @close-sidebar="isMobileSidebarOpen = false" />

    <div class="flex-1 flex flex-col min-w-0 h-screen">
      <TopBar @toggle-sidebar="toggleSidebar" />

      <main class="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">
        <router-view />
      </main>
    </div>
    
  </div>
</template>