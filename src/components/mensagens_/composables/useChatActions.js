import { ref } from 'vue';
import { ChatService } from '../services/api';

/**
 * Composable para gerenciar ações com chats (salvar, mudar status)
 * @param {Object} options - Opções de configuração
 * @returns {Object} Métodos e estado das ações
 */
export function useChatActions(options = {}) {
  const {
    onStatusChanged = null,
    onSaveToggled = null,
    emitter = null
  } = options;
  
  // Constantes para status de chat
  const CHAT_STATUS = { 
    PENDENTE: 'pendente',
    FINALIZADO: 'finalizado',
    OPERADOR: 'operador'
  };
  
  // Opções de status disponíveis
  const statusOptions = [
    { label: "Pendente", value: CHAT_STATUS.PENDENTE, severity: "warning" },
    { label: "Finalizado", value: CHAT_STATUS.FINALIZADO, severity: "success" },
    { label: "Operador", value: CHAT_STATUS.OPERADOR, severity: "info" },
  ];
  
  /**
   * Alterna o status de salvamento de um chat
   * @param {Object} chat - O chat a ser modificado
   * @returns {Promise<Object>} Resultado da operação
   */
  const toggleSaveStatus = async (chat) => {
    try {
      // Chamar o serviço para alternar o status
      await ChatService.setSeenStatus(chat.order_id, !chat.seen);
      
      // Atualizar o item localmente
      const updatedChat = { ...chat, seen: !chat.seen };
      
      // Notificar sobre a alteração, se houver emitter
      if (emitter) emitter.emit('notifications-updated');
      
      // Chamar callback se fornecido
      if (onSaveToggled) {
        onSaveToggled(updatedChat);
      }
      
      return {
        success: true,
        action: updatedChat.seen ? 'salvo' : 'removido dos salvos',
        chat: updatedChat
      };
    } catch (error) {
      console.error('Erro ao alterar status de salvamento:', error);
      return {
        success: false,
        error: error.message || 'Não foi possível alterar o status de salvamento'
      };
    }
  };
  
  /**
   * Altera o status de um chat
   * @param {string} orderId - ID do pedido
   * @param {string} newStatus - Novo status a ser definido
   * @returns {Promise<Object>} Resultado da operação
   */
  const changeStatus = async (orderId, newStatus) => {
    try {
      await ChatService.setStatus(orderId, newStatus);
      
      // Chamar callback se fornecido
      if (onStatusChanged) {
        onStatusChanged(orderId, newStatus);
      }
      
      return {
        success: true,
        message: `Status alterado para ${newStatus}`
      };
    } catch (error) {
      console.error('Erro ao alterar status:', error);
      return {
        success: false,
        error: error.message || 'Não foi possível alterar o status do chat'
      };
    }
  };
  
  return {
    // Constantes
    CHAT_STATUS,
    statusOptions,
    
    // Métodos
    toggleSaveStatus,
    changeStatus
  };
} 