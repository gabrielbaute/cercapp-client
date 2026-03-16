import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';

import './assets/main.css'; // Aquí está Tailwind

const app = createApp(App);

app.use(createPinia()); // Inyectamos el Gestor de Estado Global
app.use(router);        // Inyectamos el Router

app.mount('#app');