import api from './api';

export const ChatService = {
  // Listar todos os chats com filtros opcionais
  getChats: async (filters = {}) => {
    const response = await api.get('/api/chats/', { params: filters });
    return response.data;
  },

  // Obter chat por thread_id
  getChatByThreadId: async (threadId) => {
    const response = await api.get(`/api/chats/thread/${threadId}/`);
    return response.data;
  },

  // Fallback: Obter chat por order_id (para compatibilidade)
  getChatByOrderId: async (orderId) => {
    try {
      const response = await api.get(`/api/chats/order/${orderId}/`);
      return response.data;
    } catch (error) {
      // Se a API não suporta mais este endpoint, tentar buscar nos chats
      if (error.response && error.response.status === 404) {
        // Buscar o chat pelo order_id na lista de chats
        const chatsResponse = await api.get('/api/chats/', { 
          params: { 
            search: orderId 
          } 
        });
        
        if (chatsResponse.data && chatsResponse.data.length > 0) {
          const chat = chatsResponse.data.find(c => c.order_id === orderId);
          if (chat && chat.thread_id) {
            return await this.getChatByThreadId(chat.thread_id);
          }
        }
      }
      throw error;
    }
  },

  // Criar novo chat (retorna thread_id)
  createChat: async (orderId, data) => {
    const response = await api.post(`/api/chats/create-chat/${orderId}/`, data);
    return response.data;
  },

  // Responder a um chat usando thread_id
  respondToChat: async (threadId, data) => {
    const response = await api.post(`/api/chats/thread/${threadId}/respond/`, data);
    return response.data;
  },

  // Atualizar status de um chat usando thread_id
  setChatStatus: async (threadId, data) => {
    const response = await api.post(`/api/chats/thread/${threadId}/status/`, data);
    return response.data;
  },

  // Marcar chat como visto/não visto usando thread_id
  setChatSeenStatus: async (threadId, data) => {
    const response = await api.post(`/api/chats/thread/${threadId}/seen/`, data);
    return response.data;
  },

  // Obter notificações
  getNotifications: async () => {
    const response = await api.get('/api/chats/notifications/');
    return response.data;
  },

  // Buscar chats
  searchChats: async (searchTerm, filters = {}) => {
    const response = await api.get(`/api/chats/search/${searchTerm}/`, { 
      params: filters 
    });
    return response.data;
  },

  // Busca profunda em chats
  deepSearchChats: async (searchTerm, filters = {}) => {
    const response = await api.get(`/api/chats/deep-search/${searchTerm}/`, { 
      params: filters 
    });
    return response.data;
  },

  // Obter estatísticas
  getStatistics: async (filters = {}) => {
    const response = await api.get('/api/chats/statistics/', { 
      params: filters 
    });
    return response.data;
  },

  // Notas por thread_id
  getNotesByThreadId: async (threadId) => {
    const response = await api.get(`/api/notes/thread/${threadId}/`);
    return response.data;
  },

  // Criar nota para um chat usando thread_id
  createNoteForChat: async (threadId, data) => {
    const response = await api.post(`/api/notes/thread/${threadId}/create/`, data);
    return response.data;
  },
};

export default ChatService;
