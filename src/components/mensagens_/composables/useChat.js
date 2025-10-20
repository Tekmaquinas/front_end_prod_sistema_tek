import { ref, computed, nextTick } from 'vue';
import { ChatService } from '../services/api';

/**
 * Composable para gerenciar funcionalidades de chat
 * @param {Object} options - Opções de configuração
 * @param {Function} options.onNotify - Callback para notificar mudanças
 * @returns {Object} Métodos e estados para operações de chat
 */
export function useChat(options = {}) {
  // Estado
  const chatDetails = ref({});
  const isLoading = ref(false);
  const isSendingMessage = ref(false);
  const newMessage = ref('');
  const error = ref(null);
  
  // Referência para o input (para focar automaticamente)
  const messageInputRef = ref(null);

  // Notificação de mudanças
  const notifyChanges = () => {
    if (options.onNotify && typeof options.onNotify === 'function') {
      options.onNotify();
    }
  };

  // Propriedades computadas
  const reversedMessages = computed(() => {
    const messages = chatDetails.value?.messages;
    if (!messages || !Array.isArray(messages)) return [];
    return [...messages].reverse();
  });

  // Verificar se pode enviar mensagem
  const canSendMessage = computed(() => 
    chatDetails.value?.order_id && newMessage.value.trim() !== '' && !isSendingMessage.value
  );

  /**
   * Foca o input de mensagem
   */
  const focusMessageInput = () => {
    if (messageInputRef.value) {
      setTimeout(() => {
        try {
          messageInputRef.value.focus();
        } catch (err) {
          console.error('Erro ao focar input:', err);
        }
      }, 300);
    }
  };

  /**
   * Busca detalhes de um chat específico
   * @param {string} orderId - ID do pedido
   */
  const fetchChatDetails = async (orderId) => {
    if (!orderId) return;
    
    // Importante: NÃO bloquear input durante carregamento
    error.value = null;
    
    try {
      const data = await ChatService.getChatByOrderId(orderId);
      
      if (data.seen === undefined) {
        data.seen = false;
      }
      
      chatDetails.value = data;
      
      // Após carregar os dados, focar o input
      nextTick(() => {
        focusMessageInput();
      });
    } catch (err) {
      console.error('Erro ao buscar detalhes do chat:', err);
      error.value = 'Não foi possível carregar os dados do chat. Por favor, tente novamente.';
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Envia uma mensagem para o chat atual
   */
  const sendMessage = async () => {
    if (!canSendMessage.value) return false;
    
    // Validar se a mensagem não está vazia
    if (!newMessage.value.trim()) return false;
    
    const messageToSend = newMessage.value;
    newMessage.value = ''; // Limpar imediatamente para melhorar UX
    isSendingMessage.value = true;
    
    try {
      await ChatService.respondToChat(chatDetails.value.order_id, messageToSend);
      
      // Recarregar o chat para mostrar a nova mensagem
      await fetchChatDetails(chatDetails.value.order_id);
      notifyChanges();
      
      // Focar o input novamente
      focusMessageInput();
      
      return true;
    } catch (err) {
      console.error('Erro ao enviar mensagem:', err);
      error.value = err.message || 'Erro ao enviar mensagem';
      // Se houve erro, devolver a mensagem ao campo
      newMessage.value = messageToSend;
      return false;
    } finally {
      isSendingMessage.value = false;
    }
  };

  /**
   * Verifica se a mensagem é de saída (enviada pelo sistema)
   */
  const isOutgoingMessage = (message) => {
    if (!message || !message.to_names) return false;
    return !message.to_names.includes('Tekmaquinas');
  };

  /**
   * Limpa o estado atual
   */
  const clearState = () => {
    chatDetails.value = {};
    newMessage.value = '';
    error.value = null;
    isLoading.value = false;
    isSendingMessage.value = false;
  };

  // Inicializar estado
  clearState();

  return {
    // Estado
    chatDetails,
    isLoading,
    isSendingMessage,
    newMessage,
    error,
    messageInputRef,
    
    // Computed
    reversedMessages,
    canSendMessage,
    
    // Métodos
    fetchChatDetails,
    sendMessage,
    isOutgoingMessage,
    notifyChanges,
    clearState,
    focusMessageInput
  };
}
