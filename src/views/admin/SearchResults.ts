import { ref, onMounted, watch, computed } from 'vue';
import { useRoute } from 'vue-router';
import { UserAdminService } from '../../api/services/user-admin.service';
import type { components } from '../../api/v1/schema';

type UserResponse = components["schemas"]["UserResponse"];

export function useSearchResults() {
  const route = useRoute();
  const searchQuery = ref(route.query.q as string || '');
  
  const allUsers = ref<UserResponse[]>([]);
  const isLoading = ref(true);
  const errorMessage = ref('');

  const fetchUsers = async () => {
    isLoading.value = true;
    errorMessage.value = '';
    try {
      // Nota: Si tu backend tiene un endpoint de búsqueda específico, úsalo aquí.
      // Si no, traemos el primer gran bloque de usuarios para filtrar en el cliente.
      const data: any = await UserAdminService.getAllUsers(0, 1000); 
      
      allUsers.value = Array.isArray(data) ? data : (data?.users || data?.items || []);
    } catch (error) {
      errorMessage.value = "Error al conectar con la base de datos de usuarios.";
      console.error(error);
    } finally {
      isLoading.value = false;
    }
  };

  // Filtramos la lista de usuarios basados en el query de búsqueda
  const filteredResults = computed(() => {
    const term = searchQuery.value.toLowerCase().trim();
    if (!term) return [];

    return allUsers.value.filter(user => {
      const doc = `${user.document_type || ''}${user.document_number || ''}`.toLowerCase();
      const docOnly = (user.document_number || '').toLowerCase();
      const email = (user.email || '').toLowerCase();
      const fullName = `${user.first_name || ''} ${user.last_name || ''}`.toLowerCase();

      return doc.includes(term) || 
             docOnly.includes(term) || 
             email.includes(term) || 
             fullName.includes(term);
    });
  });

  // Estar atentos a si el usuario cambia la búsqueda desde el TopBar sin cambiar de vista
  watch(() => route.query.q, (newQuery) => {
    searchQuery.value = newQuery as string || '';
  });

  onMounted(fetchUsers);

  return { searchQuery, filteredResults, isLoading, errorMessage };
}