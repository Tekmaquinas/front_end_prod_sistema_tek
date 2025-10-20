import { ref, onMounted, onBeforeUnmount } from 'vue';
import { ChatService } from '../services/api';

/**
 * Composable para gerenciar notificações do sistema
 * @param {Object} options - Opções de configuração
 * @returns {Object} Métodos e estado das notificações
 */
export function useNotifications(options = {}) {
  const { 
    interval = 10000, // Intervalo padrão de 10 segundos
    emitter = null,
    onUpdate = null
  } = options;
  
  // Estado das notificações
  const notifications = ref({
    leroy: { 
      notific: 0, // Contador de chats não lidos (cliente foi o último a responder)
      alerts: 0,  // Contador de alertas
      urgente: 0  // Contador de chats urgentes
    },
    worten: { 
      notific: 0, // Contador de chats não lidos (cliente foi o último a responder)
      alerts: 0,  // Contador de alertas
      urgente: 0  // Contador de chats urgentes
    },
    ia_status: { 
      notificacao: 0, // Contador de notificações da IA
      info: 0         // Contador de informações da IA
    },
    total: 0,    // Total de chats com notificações
    saved: 0     // Total de chats salvos
  });
  
  // Controlar o intervalo
  let notificationInterval = null;
  
  /**
   * Busca notificações atualizadas da API
   */
  const fetchNotifications = async () => {
    try {
      const data = await ChatService.getNotifications();
      
      // Atualizar o estado
      notifications.value = {
        leroy: {
          notific: data.leroy?.notific || 0,
          alerts: data.leroy?.alerts || 0,
          urgente: data.leroy?.urgente || 0
        },
        worten: {
          notific: data.worten?.notific || 0,
          alerts: data.worten?.alerts || 0,
          urgente: data.worten?.urgente || 0
        },
        ia_status: {
          notificacao: data.ia_status?.notificacao || 0,
          info: data.ia_status?.info || 0
        },
        total: data.total || 0,
        saved: data.saved || 0
      };
      
      // Chamar callback se fornecido
      if (onUpdate) {
        onUpdate(notifications.value);
      }
    } catch (error) {
      console.error('Erro ao buscar notificações:', error);
    }
  };

  /**
   * Configura escutas de eventos para atualização
   */
  const setupListeners = () => {
    if (emitter) {
      // Escutar eventos de atualização de notificações
      emitter.on('notifications-updated', fetchNotifications);
    }
  };
  
  /**
   * Inicia a atualização automática
   */
  const startAutoRefresh = () => {
    if (notificationInterval) {
      clearInterval(notificationInterval);
    }
    notificationInterval = setInterval(fetchNotifications, interval);
  };
  
  /**
   * Para a atualização automática
   */
  const stopAutoRefresh = () => {
    if (notificationInterval) {
      clearInterval(notificationInterval);
      notificationInterval = null;
    }
  };

  // Ciclo de vida
  onMounted(() => {
    fetchNotifications();
    setupListeners();
    startAutoRefresh();
  });

  onBeforeUnmount(() => {
    stopAutoRefresh();
    
    if (emitter) {
      emitter.off('notifications-updated');
    }
  });

  return {
    notifications,
    fetchNotifications,
    startAutoRefresh,
    stopAutoRefresh
  };
}
