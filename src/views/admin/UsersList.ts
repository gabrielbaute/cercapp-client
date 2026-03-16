import { ref, reactive, onMounted, computed } from 'vue';
import { UserAdminService } from '../../api/services/user-admin.service';
import type { components } from '../../api/v1/schema';

type UserResponse = components["schemas"]["UserResponse"];

export default function useUserList() {
  const users = ref<UserResponse[]>([]);
  const isLoading = ref(true);
  const isActionLoading = ref(false);
  const errorMessage = ref('');
  
  const pagination = reactive({
    page: 1,
    limit: 50, // Límite de 50 según instrucción
    total: 0
  });

  // NUEVO: ESTADOS DE FILTROS LOCALES
  const filters = reactive({
    search: '', // Para buscar por nombre, correo o documento
    status: ''  // 'ACTIVE' | 'INACTIVE' | 'BLOCKED'
  });

  const modal = reactive({
    show: false,
    title: '',
    message: '',
    type: 'info' as 'danger' | 'warning' | 'info',
    action: null as (() => Promise<void>) | null
  });

  const totalPages = computed(() => Math.ceil(pagination.total / pagination.limit));

  const fetchUsers = async () => {
    isLoading.value = true;
    errorMessage.value = '';
    try {
      const skip = (pagination.page - 1) * pagination.limit;
      const data = await UserAdminService.getAllUsers(skip, pagination.limit);
      
      if (data && Array.isArray(data.users)) {
        users.value = data.users;
        pagination.total = data.count || 0;
      }
    } catch (error: any) {
      errorMessage.value = 'Error al obtener usuarios desde el servidor.';
      console.error("FetchUsers Fail:", error);
    } finally {
      isLoading.value = false;
    }
  };

  // NUEVO: LÓGICA DE FILTRADO COMBINADO SOBRE LOS RESULTADOS YA CARGADOS
  const filteredUsers = computed(() => {
    return users.value.filter(user => {
      // 1. Filtro Búsqueda (Nombre, Email o Documento)
      const searchTerm = filters.search.toLowerCase();
      const fullName = `${user.first_name} ${user.last_name}`.toLowerCase();
      const email = (user.email || '').toLowerCase();
      const doc = `${user.document_type}-${user.document_number}`.toLowerCase();

      const matchesSearch = !searchTerm || 
        fullName.includes(searchTerm) || 
        email.includes(searchTerm) || 
        doc.includes(searchTerm);

      // 2. Filtro por Estado
      const matchesStatus = !filters.status || user.status === filters.status;

      return matchesSearch && matchesStatus;
    });
  });

  // MANTENEMOS INTACTO TODO LO DEMÁS
  const confirmActivate = (user: UserResponse) => {
    modal.title = 'Activar Usuario';
    modal.message = `¿Deseas restaurar el acceso de ${user.first_name}? El usuario podrá volver a operar en la plataforma.`;
    modal.type = 'info';
    modal.show = true;
    modal.action = async () => {
      await UserAdminService.updateUser(user.id, { status: 'ACTIVE' });
    };
  };

  const confirmDeactivate = (user: UserResponse) => {
    modal.title = 'Desactivar Usuario';
    modal.message = `¿Deseas marcar como inactivo a ${user.first_name}? No podrá realizar nuevas operaciones hasta que sea activado de nuevo.`;
    modal.type = 'warning';
    modal.show = true;
    modal.action = async () => {
      await UserAdminService.updateUser(user.id, { status: 'INACTIVE' });
    };
  };

  const handleStatusAction = (user: UserResponse) => {
    const isBlocked = user.status === 'BLOCKED';
    modal.title = isBlocked ? 'Desbloquear Usuario' : 'Bloquear Usuario';
    modal.message = isBlocked 
      ? `¿Deseas quitar el bloqueo a ${user.first_name}?`
      : `¿Deseas bloquear a ${user.first_name}? Se le impedirá el acceso total al sistema.`;
    modal.type = isBlocked ? 'info' : 'danger';
    modal.show = true;
    modal.action = async () => {
      await UserAdminService.blockUser(user.id);
    };
  };

  const confirmDelete = (user: UserResponse) => {
    modal.title = 'Eliminar Registro';
    modal.message = `¿Confirmas la eliminación permanente de ${user.first_name}? Esta acción no se puede deshacer.`;
    modal.type = 'danger';
    modal.show = true;
    modal.action = async () => {
      await UserAdminService.deleteUser(user.id);
    };
  };

  const executeAction = async () => {
    if (!modal.action) return;
    isActionLoading.value = true;
    try {
      await modal.action();
      modal.show = false;
      await fetchUsers();
    } catch (error: any) {
      alert('Error del sistema: ' + (error?.data?.detail || 'Acción no procesada.'));
    } finally {
      isActionLoading.value = false;
    }
  };

  const changePage = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages.value) {
      pagination.page = newPage;
      fetchUsers();
    }
  };

  onMounted(fetchUsers);

  // EXPORTAMOS TODO (Añadiendo filters y filteredUsers)
  return {
    users, filteredUsers, filters, isLoading, isActionLoading, errorMessage, pagination, totalPages, modal,
    fetchUsers, handleStatusAction, confirmDelete, executeAction, changePage, confirmActivate, confirmDeactivate
  };
}