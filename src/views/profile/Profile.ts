import { useAuthStore } from '../../store/auth.store';

export default function useProfile() {
  const authStore = useAuthStore();
  
  // Refrescamos los datos en segundo plano por si hubo algún cambio externo
  const refreshProfile = async () => {
    await authStore.fetchProfile();
  };

  return {
    authStore,
    refreshProfile
  };
}