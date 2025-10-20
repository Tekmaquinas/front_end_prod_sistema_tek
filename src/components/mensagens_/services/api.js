/**
 * Serviço centralizado para gerenciar as chamadas à API
 */

// Base URL da API de mensagens
const BASE_URL = 'https://backmessages.squareweb.app/';
const API_BASE_URL = 'https://backmessages.squareweb.app/';

// Token fixo de autenticação - não precisa de login
const TOKEN_FIXO = 'ef9354cc8b5f6aec770636e6bce6ca85001ae47c';

/**
 * Funções para gerenciar o token de autenticação
 */
const TokenService = {
  getToken: () => {
    return TOKEN_FIXO; // Retorna diretamente o token fixo
  },
  
  getAuthHeader: () => {
    return { 'Authorization': `Token ${TOKEN_FIXO}` };
  }
};

// Função para criar cabeçalhos padrão com autorização
const createHeaders = (contentType = 'application/json') => {
  const headers = {
    'Content-Type': contentType,
    'Accept': 'application/json',
    'X-Custom-Cookie': `tekmaquinas=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtZW1icm9faWQiOjEsImVtYWlsIjoieXVyaWRhbmllbDE5NUBnbWFpbC5jb20iLCJoYXNoIjoiYmI3MDJkNTc3Y2ZmZTUxNGI0ODQ3YzVjY2VlMWQ4MzcxYWJjNWU2ODc0ZjUxMTk1MmJkMTI3NTJkNzYxZjAxMWE3MzJiYTk0YzVhNTY3ODc0MGRmNDQ2OWQ5MWYzNzFmZTYyYTE4Mjk0YjNhMjJmYjc3YzRjMzViOGRlMjAxNWQiLCJleHAiOjE3NDY1Mjc2MTAsInN1YiI6IjEiLCJ0eXBlIjoiYWNjZXNzX3Rva2VuIiwiaWF0IjoxNzQ1OTIyODEwfQ.vTw2Q1l0o12hTwSmqZfdHzDS5UWkA13zun6QcqiU7Dw`,
    ...TokenService.getAuthHeader()
  };
  return headers;
};

// Endpoints de autenticação
const AUTH_ENDPOINTS = {
  LOGIN: `${API_BASE_URL}/auth/`,
  LOGOUT: `${BASE_URL}/member/logout`,
  CHECK: `${BASE_URL}/member/check`
};

// Endpoints de chats usando thread_id
const CHATS_ENDPOINTS = {
  // Listar todos os chats com opções de filtro
  LIST: `${API_BASE_URL}/api/chats/`,
  // Criar novo chat com um cliente usando o ID do pedido (continua usando order_id)
  CREATE_CHAT: (orderId) => `${API_BASE_URL}/api/chats/create-chat/${orderId}/`,
  // Obter estatísticas de notificações de chats por marketplace
  NOTIFICATIONS: `${API_BASE_URL}/api/chats/notifications/`,
  // Obter chat pelo thread_id, incluindo mensagens
  GET_BY_THREAD_ID: (threadId) => `${API_BASE_URL}/api/chats/thread/${threadId}/`,
  // Definir status de visualização de um chat pelo thread_id
  SET_SEEN_STATUS: (threadId) => `${API_BASE_URL}/api/chats/thread/${threadId}/seen/`,
  // Responder a um chat específico pelo thread_id
  RESPOND: (threadId) => `${API_BASE_URL}/api/chats/thread/${threadId}/respond/`,
  // Atualizar status de um chat específico pelo thread_id
  SET_STATUS: (threadId) => `${API_BASE_URL}/api/chats/thread/${threadId}/status/`,
  // Buscar mensagens com texto específico
  SEARCH_MESSAGES: (searchString) => `${API_BASE_URL}/api/chats/search-messages/${searchString}/`,
  // Buscar chats que contenham uma string específica
  SEARCH: (searchString) => `${API_BASE_URL}/api/chats/search/${searchString}/`,
  // Busca profunda em chats, mensagens e notas
  DEEP_SEARCH: (searchString) => `${API_BASE_URL}/api/chats/deep-search/${searchString}/`,
  // Obter estatísticas gerais dos chats
  STATISTICS: `${API_BASE_URL}/api/chats/statistics/`,
  // Operações sobre um chat específico por ID
  BY_ID: (id) => `${API_BASE_URL}/api/chats/${id}/`
};

// Endpoints de notas usando thread_id
const NOTES_ENDPOINTS = {
  // Listar todas as notas, com opção de filtrar
  LIST: `${API_BASE_URL}/api/notes/`,
  // Listar notas de um chat específico pelo thread_id
  LIST_BY_THREAD_ID: (threadId) => `${API_BASE_URL}/api/notes/thread/${threadId}/`,
  // Criar nova nota para um chat usando o thread_id
  CREATE_FOR_THREAD: (threadId) => `${API_BASE_URL}/api/notes/thread/${threadId}/create/`,
  // Operações sobre uma nota específica por ID
  BY_ID: (id) => `${API_BASE_URL}/api/notes/${id}/`
};

/**
 * Endpoints para estatísticas
 */
const STATS_ENDPOINTS = {
  GET_STATISTICS: (params = {}) => {
    const url = new URL(`${API_BASE_URL}/api/chats/statistics/`);
    
    // Adicionar parâmetros à URL
    if (params.start_date) url.searchParams.append('start_date', params.start_date);
    if (params.end_date) url.searchParams.append('end_date', params.end_date);
    if (params.marketplace) url.searchParams.append('marketplace', params.marketplace);
    
    return url.toString();
  }
};

/**
 * Serviço para autenticação
 */
const AuthService = {
  /**
   * Realiza login do usuário
   * @param {string} username - Nome de usuário
   * @param {string} password - Senha do usuário
   * @returns {Promise} Promise com o resultado do login
   */
  login: async (username, password) => {
    try {
      const response = await fetch(AUTH_ENDPOINTS.LOGIN, {
        method: 'POST',
        headers: createHeaders(),
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error('Credenciais inválidas');
      }

      const data = await response.json();
      
      // Salvar o token recebido
      if (data.token) {
        TokenService.saveToken(data.token);
      }
      
      return data;
    } catch (error) {
      console.error('Erro durante login:', error);
      throw error;
    }
  },

  /**
   * Realiza logout do usuário
   * @returns {Promise} Promise com o resultado do logout
   */
  logout: async () => {
    try {
      // Primeiro, tenta fazer logout pela API
      const response = await fetch(AUTH_ENDPOINTS.LOGOUT, {
        method: 'POST',
        headers: createHeaders()
      });

      // Mesmo se houver erro na API, sempre remove o token local
      TokenService.removeToken();
      
      if (!response.ok) {
        console.warn('API de logout retornou erro, mas o token local foi removido');
      }

      return response.ok ? await response.json() : { success: true, message: 'Logout local realizado' };
    } catch (error) {
      // Mesmo com erro de rede, remover o token local
      TokenService.removeToken();
      console.error('Erro durante logout:', error);
      return { success: true, message: 'Logout local realizado com erro na API' };
    }
  },

  /**
   * Verifica se o usuário está autenticado
   * @returns {Promise} Promise com o status de autenticação
   */
  checkAuth: async () => {
    // Verifica se existe token armazenado
    if (!TokenService.getToken()) {
      return { success: false };
    }
    
    try {
      const response = await fetch(AUTH_ENDPOINTS.CHECK, {
        method: 'GET',
        headers: createHeaders()
      });

      if (!response.ok) {
        // Se a verificação falha, remover o token
        TokenService.removeToken();
        throw new Error('Erro na verificação de autenticação');
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao verificar autenticação:', error);
      return { success: false };
    }
  },
};

/**
 * Serviço para gerenciar chats
 */
const ChatService = {
  /**
   * Busca todos os chats com filtros opcionais
   * @param {Object} params - Parâmetros de consulta
   * @returns {Promise} Promise com os dados dos chats
   */
  getChats: async (params = {}) => {
    const queryParams = new URLSearchParams();
    
    if (params.page) queryParams.append('page', params.page);
    if (params.pageSize) queryParams.append('page_size', params.pageSize);
    if (params.marketplace) queryParams.append('marketplace', params.marketplace);
    if (params.status) queryParams.append('status', params.status);
    if (params.exclude_status) queryParams.append('exclude_status', params.exclude_status);
    if (params.startDate) queryParams.append('start_date', params.startDate);
    if (params.endDate) queryParams.append('end_date', params.endDate);
    if (params.stateMarketplace) queryParams.append('state_marketplace', params.stateMarketplace);
    if (params.clientName) queryParams.append('client_name', params.clientName);
    if (params.clientId) queryParams.append('client_id', params.clientId);
    if (params.notific !== undefined) queryParams.append('notific', params.notific);
    if (params.alert !== undefined) queryParams.append('alert', params.alert);
    if (params.seen) queryParams.append('seen', params.seen);

    const url = `${CHATS_ENDPOINTS.LIST}${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    
    console.log("URL da requisição:", url);
    
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: createHeaders(),
        mode: 'cors'
      });
      
      if (!response.ok) {
        throw new Error(`Erro ao buscar chats: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      
      return data;
    } catch (error) {
      console.error('Erro ao buscar chats:', error);
      throw error;
    }
  },

  /**
   * Realiza uma busca normal em chats
   * @param {string} searchTerm - Termo de busca
   * @param {Object} params - Parâmetros adicionais da busca
   * @returns {Promise} Promise com os resultados da busca
   */
  search: async (searchTerm, params = {}) => {
    const queryParams = new URLSearchParams();
    
    if (params.page) queryParams.append('page', params.page);
    if (params.pageSize) queryParams.append('page_size', params.pageSize);
    if (params.marketplace) queryParams.append('marketplace', params.marketplace);
    
    const query = queryParams.toString() ? `?${queryParams.toString()}` : '';
    const url = `${CHATS_ENDPOINTS.SEARCH(searchTerm)}${query}`;
    
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: createHeaders(),
        mode: 'cors'
      });
      
      if (!response.ok) {
        throw new Error(`Erro na busca: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erro ao executar busca:', error);
      throw error;
    }
  },
  
  /**
   * Realiza uma busca profunda em chats, mensagens e notas
   * @param {string} searchTerm - Termo de busca
   * @param {Object} params - Parâmetros adicionais da busca
   * @returns {Promise} Promise com os resultados da busca profunda
   */
  deepSearch: async (searchTerm, params = {}) => {
    const queryParams = new URLSearchParams();
    
    if (params.page) queryParams.append('page', params.page);
    if (params.pageSize) queryParams.append('page_size', params.pageSize);
    if (params.marketplace) queryParams.append('marketplace', params.marketplace);
    
    const query = queryParams.toString() ? `?${queryParams.toString()}` : '';
    const url = `${CHATS_ENDPOINTS.DEEP_SEARCH(searchTerm)}${query}`;
    
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: createHeaders(),
        mode: 'cors'
      });
      
      if (!response.ok) {
        throw new Error(`Erro na busca profunda: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erro ao executar busca profunda:', error);
      throw error;
    }
  },

  /**
   * Obtém detalhes de um chat específico pelo thread_id
   * @param {string} threadId - ID da thread
   * @returns {Promise} Promise com os dados do chat
   */
  getChat: async (threadId) => {
    try {
      const response = await fetch(CHATS_ENDPOINTS.GET_BY_THREAD_ID(threadId), {
        method: 'GET',
        headers: createHeaders(),
        mode: 'cors'
      });
      
      if (!response.ok) {
        throw new Error(`Erro ao buscar chat: ${response.status} ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Erro ao buscar chat com threadId ${threadId}:`, error);
      throw error;
    }
  },

  /**
   * Cria um novo chat com base no ID do pedido
   * @param {string} orderId - ID do pedido
   * @param {Object} data - Dados para criar o chat (message, marketplace)
   * @returns {Promise} Promise com o resultado da criação, incluindo thread_id
   */
  createChat: async (orderId, data) => {
    try {
      const response = await fetch(CHATS_ENDPOINTS.CREATE_CHAT(orderId), {
        method: 'POST',
        headers: createHeaders(),
        body: JSON.stringify(data),
        mode: 'cors'
      });
      
      if (!response.ok) {
        throw new Error(`Erro ao criar chat: ${response.status} ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Erro ao criar chat com orderId ${orderId}:`, error);
      throw error;
    }
  },

  /**
   * Responde a um chat específico pelo thread_id
   * @param {string} threadId - ID da thread
   * @param {Object} data - Dados da resposta
   * @returns {Promise} Promise com o resultado da operação
   */
  respondToChat: async (threadId, data) => {
    try {
      const response = await fetch(CHATS_ENDPOINTS.RESPOND(threadId), {
        method: 'POST',
        headers: createHeaders(),
        body: JSON.stringify(data),
        mode: 'cors'
      });
      
      if (!response.ok) {
        throw new Error(`Erro ao responder chat: ${response.status} ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Erro ao responder chat com threadId ${threadId}:`, error);
      throw error;
    }
  },

  /**
   * Define o status de visualização de um chat pelo thread_id
   * @param {string} threadId - ID da thread
   * @param {Object} data - Objeto com a propriedade seen (boolean)
   * @returns {Promise} Promise com o resultado da operação
   */
  setSeenStatus: async (threadId, data) => {
    try {
      const response = await fetch(CHATS_ENDPOINTS.SET_SEEN_STATUS(threadId), {
        method: 'POST',
        headers: createHeaders(),
        body: JSON.stringify(data),
        mode: 'cors'
      });
      
      if (!response.ok) {
        throw new Error(`Erro ao definir status de visualização: ${response.status} ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Erro ao definir status de visualização para chat com threadId ${threadId}:`, error);
      throw error;
    }
  },

  /**
   * Atualiza o status de um chat pelo thread_id
   * @param {string} threadId - ID da thread
   * @param {Object} data - Objeto com a propriedade status
   * @returns {Promise} Promise com o resultado da operação
   */
  setStatus: async (threadId, data) => {
    try {
      const response = await fetch(CHATS_ENDPOINTS.SET_STATUS(threadId), {
        method: 'POST',
        headers: createHeaders(),
        body: JSON.stringify(data),
        mode: 'cors'
      });
      
      if (!response.ok) {
        throw new Error(`Erro ao atualizar status: ${response.status} ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Erro ao atualizar status para chat com threadId ${threadId}:`, error);
      throw error;
    }
  },

  /**
   * Obtém estatísticas de notificações de chats por marketplace
   * @returns {Promise} Promise com as estatísticas de notificações
   */
  getNotifications: async () => {
    try {
      const response = await fetch(CHATS_ENDPOINTS.NOTIFICATIONS, {
        method: 'GET',
        headers: createHeaders(),
        mode: 'cors',
        
      });
      
      if (!response.ok) {
        throw new Error(`Erro ao buscar notificações: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Garantir estrutura segura das notificações para evitar undefined
      const formattedData = {
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
      
      return formattedData;
    } catch (error) {
      console.error('Erro ao buscar notificações:', error);
      // Retornar estrutura vazia em caso de erro
      return {
        leroy: { notific: 0, alerts: 0, urgente: 0 },
        worten: { notific: 0, alerts: 0, urgente: 0 },
        ia_status: { notificacao: 0, info: 0 },
        total: 0,
        saved: 0
      };
    }
  }
};

/**
 * Serviço para gerenciar notas
 */
const NotesService = {
  /**
   * Lista todas as notas com opções de filtro
   * @param {Object} params - Parâmetros de consulta
   * @returns {Promise} Promise com os dados das notas
   */
  getNotes: async (params = {}) => {
    const queryParams = new URLSearchParams();
    
    if (params.page) queryParams.append('page', params.page);
    if (params.pageSize) queryParams.append('page_size', params.pageSize);
    if (params.chatId) queryParams.append('chat_id', params.chatId);
    if (params.threadId) queryParams.append('thread_id', params.threadId);

    const url = `${NOTES_ENDPOINTS.LIST}${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: createHeaders(),
        mode: 'cors'
      });
      
      if (!response.ok) {
        throw new Error(`Erro ao buscar notas: ${response.status} ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Erro ao buscar notas:', error);
      throw error;
    }
  },

  /**
   * Obtém notas de um chat específico pelo thread_id
   * @param {string} threadId - ID da thread
   * @returns {Promise} Promise com as notas do chat
   */
  getNotesByThreadId: async (threadId) => {
    try {
      const response = await fetch(NOTES_ENDPOINTS.LIST_BY_THREAD_ID(threadId), {
        method: 'GET',
        headers: createHeaders(),
        mode: 'cors'
      });
      
      if (!response.ok) {
        throw new Error(`Erro ao buscar notas: ${response.status} ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Erro ao buscar notas para threadId ${threadId}:`, error);
      throw error;
    }
  },

  /**
   * Cria uma nova nota para um chat específico pelo thread_id
   * @param {string} threadId - ID da thread
   * @param {Object} data - Objeto com a propriedade nota (texto da nota)
   * @returns {Promise} Promise com o resultado da operação
   */
  createNote: async (threadId, data) => {
    try {
      const response = await fetch(NOTES_ENDPOINTS.CREATE_FOR_THREAD(threadId), {
        method: 'POST',
        headers: createHeaders(),
        body: JSON.stringify(data),
        mode: 'cors'
      });
      
      if (!response.ok) {
        throw new Error(`Erro ao criar nota: ${response.status} ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Erro ao criar nota para threadId ${threadId}:`, error);
      throw error;
    }
  },

  /**
   * Atualiza uma nota existente
   * @param {number} noteId - ID da nota a ser atualizada
   * @param {string} nota - Novo texto da nota
   * @param {number} chatId - ID do chat associado à nota (opcional)
   * @returns {Promise} Promise com o resultado da operação
   */
  updateNote: async (noteId, nota, chatId) => {
    try {
      if (!chatId) {
        try {
          const noteDetails = await fetch(NOTES_ENDPOINTS.BY_ID(noteId), {
            method: 'GET',
            headers: createHeaders(),
            mode: 'cors'
          });
          
          if (noteDetails.ok) {
            const noteData = await noteDetails.json();
            chatId = noteData.chat;
          }
        } catch (err) {
          console.error("Erro ao obter detalhes da nota:", err);
        }
      }

      const noteData = { 
        nota: nota 
      };
      
      if (chatId) {
        noteData.chat = chatId;
      }
      
      const response = await fetch(NOTES_ENDPOINTS.BY_ID(noteId), {
        method: 'PUT',
        headers: createHeaders(),
        body: JSON.stringify(noteData),
        mode: 'cors'
      });
      
      if (!response.ok) {
        throw new Error(`Erro ao atualizar nota: ${response.status} ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Erro ao atualizar nota ${noteId}:`, error);
      throw error;
    }
  },

  /**
   * Exclui uma nota existente
   * @param {number} noteId - ID da nota a ser excluída
   * @returns {Promise} Promise com o resultado da operação
   */
  deleteNote: async (noteId) => {
    try {
      const response = await fetch(NOTES_ENDPOINTS.BY_ID(noteId), {
        method: 'DELETE',
        headers: createHeaders(),
        mode: 'cors'
      });
      
      if (!response.ok) {
        throw new Error(`Erro ao excluir nota: ${response.status} ${response.statusText}`);
      }
      
      return true;
    } catch (error) {
      console.error(`Erro ao excluir nota ${noteId}:`, error);
      throw error;
    }
  }
};

/**
 * Serviço para estatísticas
 */
const StatisticsService = {
  /**
   * Obtém estatísticas de chats com filtros opcionais
   * @param {Object} params - Parâmetros de consulta (start_date, end_date, marketplace)
   * @returns {Promise} Promise com os dados estatísticos
   */
  getStatistics: async (params = {}) => {
    try {
      const response = await fetch(STATS_ENDPOINTS.GET_STATISTICS(params), {
        method: 'GET',
        headers: createHeaders(),
        mode: 'cors'
      });
      
      if (!response.ok) {
        throw new Error(`Erro ao buscar estatísticas: ${response.status} ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
      throw error;
    }
  }
};

export {
  BASE_URL,
  API_BASE_URL,
  AUTH_ENDPOINTS,
  CHATS_ENDPOINTS,
  NOTES_ENDPOINTS,
  TokenService,
  createHeaders,
  ChatService,
  NotesService,
  AuthService,
  StatisticsService
};
