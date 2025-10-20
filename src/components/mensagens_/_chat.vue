<template>
    <Dialog 
      v-model:visible="visible" 
      modal 
      :style="dialogStyle" 
      :breakpoints="dialogBreakpoints" 
      pt:root:class="!border-0" 
      pt:mask:class="backdrop-blur-sm" 
      @hide="onCloseDialog"
    >
      <template #header>
        <div class="chat-header flex flex-col relative w-full">
          <span class="font-bold whitespace-nowrap">{{ chatDetails.user_name }}</span>
          <span class="text-surface-500 dark:text-surface-400 block">
            {{ DateFormat(chatDetails.date_created) }}
          </span>
          
          <!-- Badge de chat salvo (com menu de opções) -->
          <div class="absolute right-0 top-0 flex items-center">
            <Badge 
              v-if="chatDetails.seen" 
              value="Salvo" 
              severity="success" 
            />
            <!-- Botão de 3 pontinhos refeito -->
            <Button 
              icon="pi pi-ellipsis-v" 
              text 
              rounded 
              aria-label="Opções" 
              @click="openOptionsMenu" 
              aria-haspopup="true" 
            />
            <Menu ref="optionsMenu" :model="currentMenuItems" :popup="true" />
          </div>
        </div>
      </template>
  
      <!-- Estado de carregamento -->
      <div v-if="isLoading" class="loading-container">
        <ProgressSpinner class="spinner" strokeWidth="8" fill="transparent" animationDuration=".5s" />
      </div>
      
      <!-- Estado de erro -->
      <div v-else-if="error" class="error-container">
        <i class="pi pi-exclamation-triangle text-yellow-500 text-4xl mb-3"></i>
        <h3 class="text-xl mb-2">Ocorreu um problema</h3>
        <p class="text-gray-600 mb-4">{{ error }}</p>
        <Button label="Tentar novamente" icon="pi pi-refresh" @click="reload" />
      </div>
  
      <!-- Conteúdo do chat -->
      <div v-else class="chat-layout">
        <!-- Painel esquerdo: Mensagens -->
        <div class="chat-panel" style="height: calc(100vh - 230px);">
          <div class="chat-container" style="height: 100%;">
            <StateDisplay 
              v-if="isLoading" 
              type="loading" 
              message="Carregando mensagens..."
            />
            <StateDisplay 
              v-else-if="error" 
              type="error" 
              :message="error"
              @retry="loadChatDetails"
            />
            <template v-else>
              <div v-if="reversedMessages.length === 0" class="empty-messages">
                <StateDisplay 
                  type="empty" 
                  message="Nenhuma mensagem encontrada"
                />
              </div>
              <template v-else>
                <MessageBubble 
                  v-for="(message, index) in reversedMessages" 
                  :key="index"
                  :message="message"
                  :isOutgoing="isOutgoingMessage(message)"
                />
              </template>
            </template>
          </div>
  
          <!-- Área de entrada -->
          <div class="message-input-container">
            <div class="message-input-wrapper">
              <InputText 
                v-model="newMessage" 
                placeholder="Digite sua mensagem..." 
                class="w-full" 
                @keyup.enter="sendResponse"
              />
              <Button 
                icon="pi pi-send" 
                @click="sendResponse" 
              />
            </div>
          </div>
        </div>
  
        <!-- Painel direito: Informações -->
        <Tabs class="chat-info-tabs" value="0">
          <TabList>
            <Tab value="0">Cliente</Tab>
            <Tab value="1">Produto</Tab>
            <Tab value="2">Rastreio</Tab>
            <Tab value="3">Notas</Tab>
          </TabList>
          <TabPanels>
            <!-- Aba Cliente -->
            <TabPanel value="0">
              <div class="info-panel">
                <div class="info-section">
                  <h4 class="info-title">Dados do Cliente</h4>
                  <div class="info-row" v-if="chatDetails.user_name">
                    <span class="info-label">Nome:</span>
                    <span class="info-value">{{ chatDetails.user_name }}</span>
                  </div>
                  <div class="info-row" v-if="chatDetails.user_id">
                    <span class="info-label">ID:</span>
                    <span class="info-value">{{ chatDetails.user_id }}</span>
                  </div>
                  <!-- Adicionando o campo order_id -->
                  <div class="info-row" v-if="chatDetails.order_id">
                    <span class="info-label">Pedido ID:</span>
                    
                    <span v-if="chatDetails.order_data.marketplace === 'leroy'" class="info-value">
                      <a :href="`https://adeo-marketplace.mirakl.net/mmp/shop/order/${chatDetails.order_id}`" target="_blank" rel="noopener noreferrer">{{ chatDetails.order_id }}</a>
                    </span>
                    <span v-else-if="chatDetails.order_data.marketplace === 'worten'" class="info-value">
                      <a :href="`https://marketplace.worten.pt/mmp/shop/order/${chatDetails.order_id}`" target="_blank" rel="noopener noreferrer">{{ chatDetails.order_id }}</a>
                    </span>              
                  </div>
                  <div class="info-row" v-if="chatDetails.status">
                    <span class="info-label">Status:</span>
                    <span class="info-value">
                      <Badge :value="chatDetails.status" :severity="getStatusSeverity(chatDetails.status)" />
                    </span>
                  </div>
                  <div class="info-row" v-if="chatDetails.topic_value">
                    <span class="info-label">Assunto:</span>
                    <span class="info-value">{{ chatDetails.topic_value }}</span>
                  </div>
                </div>
  
                <!-- Endereço -->
                <div class="info-section" v-if="chatDetails.order_data">
                  <h4 class="info-title">Endereço</h4>
                  <div class="info-row" v-if="chatDetails.order_data.city">
                    <span class="info-label">Cidade:</span>
                    <span class="info-value">{{ chatDetails.order_data.city }}</span>
                  </div>
                  <div class="info-row" v-if="chatDetails.order_data.country">
                    <span class="info-label">País:</span>
                    <span class="info-value">{{ chatDetails.order_data.country }}</span>
                  </div>
                  <div class="info-row" v-if="chatDetails.order_data['zip-code']">
                    <span class="info-label">CEP:</span>
                    <span class="info-value">{{ chatDetails.order_data['zip-code'] }}</span>
                  </div>
                </div>
              </div>
            </TabPanel>
  
            <!-- Aba Produto -->
            <TabPanel value="1">
              <div class="info-panel" v-if="chatDetails.order_data">
                <div class="info-section">
                  <h4 class="info-title">Detalhes do Produto</h4>
                  <div class="info-row" v-if="chatDetails.order_data.product_title">
                    <span class="info-label">Produto:</span>
                    <span class="info-value">{{ chatDetails.order_data.product_title }}</span>
                  </div>
                  <div class="info-row" v-if="chatDetails.order_data.price">
                    <span class="info-label">Preço:</span>
                    <span class="info-value">{{ formatPrice(chatDetails.order_data.price) }}</span>
                  </div>
                  <div class="info-row" v-if="chatDetails.order_data.quantity">
                    <span class="info-label">Quantidade:</span>
                    <span class="info-value">{{ chatDetails.order_data.quantity }}</span>
                  </div>
                  <div class="info-row" v-if="chatDetails.order_data.stock">
                    <span class="info-label">Estoque:</span>
                    <span class="info-value">{{ chatDetails.order_data.stock }}</span>
                  </div>
                  <div class="info-row" v-if="chatDetails.order_data.last_updated_date">
                    <span class="info-label">Última Atualização:</span>
                    <span class="info-value">{{ formatDate(chatDetails.order_data.last_updated_date) }}</span>
                  </div>
                  <div class="info-row" v-if="chatDetails.order_data.link">
                    <span class="info-label">Link:</span>
                    <span class="info-value">
                      <a :href="chatDetails.order_data.link" target="_blank" class="product-link">
                        Ver Produto <i class="pi pi-external-link"></i>
                      </a>
                    </span>
                  </div>
                </div>
              </div>
              <p v-else class="no-data-message">Não há informações disponíveis sobre o produto</p>
            </TabPanel>
  
            <!-- Aba Rastreio -->
            <TabPanel value="2">
              <div class="info-panel" v-if="chatDetails.order_data">
                <div class="info-section">
                  <h4 class="info-title">Informações de Envio</h4>
                  <div class="info-row" v-if="chatDetails.order_data.shipping_company">
                    <span class="info-label">Transportadora:</span>
                    <span class="info-value">{{ chatDetails.order_data.shipping_company }}</span>
                  </div>
                  <div class="info-row" v-if="chatDetails.order_data.shipping_carrier_code">
                    <span class="info-label">Código:</span>
                    <span class="info-value">{{ chatDetails.order_data.shipping_carrier_code }}</span>
                  </div>
                  <div class="info-row" v-if="chatDetails.order_data.info_logistic">
                    <span class="info-label">Info. Logística:</span>
                    <span class="info-value">{{ chatDetails.order_data.info_logistic }}</span>
                  </div>
                  <div class="info-row" v-if="chatDetails.order_data.shipping_link || chatDetails.shipping_link">
                    <span class="info-label">Rastreamento:</span>
                    <span class="info-value">
                      <a :href="chatDetails.order_data.shipping_link || chatDetails.shipping_link" target="_blank" class="tracking-link">
                        Rastrear <i class="pi pi-map-marker"></i>
                      </a>
                    </span>
                  </div>
                </div>
  
                <div class="info-section">
                  <h4 class="info-title">Dados do Marketplace</h4>
                  <div class="info-row" v-if="chatDetails.order_data.marketplace">
                    <span class="info-label">Marketplace:</span>
                    <span class="info-value">{{ chatDetails.order_data.marketplace }}</span>
                  </div>
                  <div class="info-row" v-if="chatDetails.order_data.state">
                    <span class="info-label">Estado:</span>
                    <span class="info-value">{{ chatDetails.order_data.state }}</span>
                  </div>
                </div>
  
                <div class="info-section">
                  <h4 class="info-title">Produto e Endereço</h4>
                  <div class="info-row" v-if="chatDetails.order_data.product_title">
                    <span class="info-label">Produto:</span>
                    <span class="info-value">{{ chatDetails.order_data.product_title }}</span>
                  </div>
                  <div class="info-row" v-if="chatDetails.order_data.quantity">
                    <span class="info-label">Quantidade:</span>
                    <span class="info-value">{{ chatDetails.order_data.quantity }}</span>
                  </div>
                  <div class="info-row" v-if="chatDetails.order_data.price">
                    <span class="info-label">Preço:</span>
                    <span class="info-value">{{ formatPrice(chatDetails.order_data.price) }}</span>
                  </div>
                  <div class="info-row" v-if="chatDetails.order_data.city">
                    <span class="info-label">Cidade:</span>
                    <span class="info-value">{{ chatDetails.order_data.city }}</span>
                  </div>
                  <div class="info-row" v-if="chatDetails.order_data.country">
                    <span class="info-label">País:</span>
                    <span class="info-value">{{ chatDetails.order_data.country }}</span>
                  </div>
                  <div class="info-row" v-if="chatDetails.order_data['zip-code']">
                    <span class="info-label">CEP:</span>
                    <span class="info-value">{{ chatDetails.order_data['zip-code'] }}</span>
                  </div>
                  <div class="info-row" v-if="chatDetails.order_data.last_updated_date">
                    <span class="info-label">Atualizado em:</span>
                    <span class="info-value">{{ formatDate(chatDetails.order_data.last_updated_date) }}</span>
                  </div>
                </div>
              </div>
              <p v-else class="no-data-message">Não há informações de rastreio disponíveis</p>
            </TabPanel>
  
            <!-- Nova Aba de Notas -->
            <TabPanel value="3">
              <div class="notes-section">
                <StateDisplay 
                  v-if="notesLoading" 
                  type="loading" 
                  message="Carregando notas..."
                />
                <template v-else>
                  <NoteEditor 
                    :note="currentNote" 
                    :loading="isNoteSaving" 
                    @save="saveNote" 
                    @reset="resetNoteForm" 
                  />
                  
                  <div v-if="notes.length === 0" class="empty-notes">
                    <StateDisplay 
                      type="empty" 
                      message="Nenhuma nota encontrada"
                    />
                  </div>
                  
                  <div v-else class="notes-container">
                    <div class="note-item" v-for="note in notes" :key="note.id">
                      <div class="note-content">
                        <p>{{ note.nota }}</p>
                        <p class="note-date">{{ formatDate(note.date_created) }}</p>
                      </div>
                      <div class="note-actions">
                        <Button icon="pi pi-pencil" text @click="editNote(note)" />
                        <Button icon="pi pi-trash" text severity="danger" @click="confirmDeleteNote(note)" />
                      </div>
                    </div>
                  </div>
                </template>
              </div>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </div>
  
      <!-- Diálogo de confirmação para excluir nota -->
      <ConfirmationDialog
        v-model:visible="deleteNoteDialog"
        title="Confirmar Exclusão"
        message="Tem certeza que deseja excluir esta nota? Esta ação não pode ser desfeita."
        confirmLabel="Excluir"
        confirmSeverity="danger"
        :loading="isDeleting"
        @confirm="deleteNote"
      />
  
      <!-- Adicione o diálogo de mudança de status abaixo do diálogo de confirmação para excluir nota -->
      <Dialog 
        v-model:visible="changeStatusDialog" 
        modal 
        header="Alterar Status" 
        :style="{ width: '400px' }"
      >
        <div class="p-3">
          <h3 class="mb-3">Selecione o novo status:</h3>
          <div class="status-options grid grid-cols-2 gap-2">
            <!-- Utilize as mesmas opções de status conforme sua lógica -->
            <Button 
              v-for="option in statusOptions" 
              :key="option.value" 
              :label="option.label" 
              :severity="option.severity"
              @click="updateChatStatus(option.value)"
              class="w-full"
            />
          </div>
        </div>
        <template #footer>
          <Button label="Cancelar" icon="pi pi-times" @click="changeStatusDialog = false" text />
        </template>
      </Dialog>
    </Dialog>
  </template>
  
  <script setup>

    import { ref, watch, inject, onMounted, computed } from 'vue';
    import { useRoute, useRouter } from 'vue-router';
    import { DateFormat, getFromCache, getNameStatus } from '../utils.mjs';

    import { useChat } from './composables/useChat';
    import { NotesService, ChatService } from './services/api';
    import { useToast } from 'primevue/usetoast';

    // Novos componentes
    import MessageBubble from './ui/MessageBubble.vue';
    import NoteEditor from './ui/NoteEditor.vue';
    import StateDisplay from './ui/StateDisplay.vue';
    import ConfirmationDialog from './ui/ConfirmationDialog.vue';
    import { formatDate } from './utils/helpers.js';

  // Constantes e injeção de dependências
  const route = useRoute();
  const router = useRouter();
  const emitter = inject('emitter', null);
  
  // Configuração do diálogo
  const dialogStyle = { width: '80dvw', height: '90dvh' };
  const dialogBreakpoints = { '1199px': '75vw', '575px': '90vw' };
  const visible = ref(false);
  
  // Instanciando o composable
  const { 
    chatDetails, 
    isLoading, 
    newMessage, 
    error,
    reversedMessages,
    canSendMessage,
    fetchChatDetails, 
    sendMessage: originalSendMessage, 
    isOutgoingMessage 
  } = useChat({
    onNotify: () => {
      if (emitter) emitter.emit('notifications-updated');
    }
  });
  
  // Métodos auxiliares
  const messageClasses = (message) => {
    return isOutgoingMessage(message) 
      ? 'outgoing-bubble' 
      : 'incoming-bubble';
  };
  
  // Funções auxiliares para formatação de dados
  const formatPrice = (price) => {
    if (!price) return 'Não disponível';
    
    // Verificar se é um número
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    if (isNaN(numPrice)) return price;
    
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'EUR'
    }).format(numPrice);
  };
  
  const getStatusSeverity = (status) => {
    switch (status?.toLowerCase()) {
      case 'urgente': return 'danger';
      case 'atencao': return 'warning';
      case 'info': return 'info';
      case 'finalizado': return 'success';
      case 'pendente': return 'warning';
      case 'operador': return 'info';
      default: return 'secondary';
    }
  };
  
  // Estado para gerenciamento de notas
  const notes = ref([]);
  const notesLoading = ref(false);
  const currentNote = ref({ id: null, text: '' });
  const isNoteSaving = ref(false);
  const deleteNoteDialog = ref(false);
  const noteToDelete = ref(null);
  const noteToUpdate = ref(null);
  const isDeleting = ref(false);
  
  // Adicione as referências e estado para o menu de opções
  const optionsMenu = ref(null);
  const currentMenuItems = ref([]);
  const changeStatusDialog = ref(false); // Se precisar do diálogo de status
  
  // Função para abrir o menu de opções a partir dos 3 pontinhos
  const openOptionsMenu = (event) => {
    event.stopPropagation();
    currentMenuItems.value = [
      {
        label: 'Mudar Status',
        icon: 'pi pi-tag',
        command: () => { changeStatusDialog.value = true; }
      },
      {
        label: chatDetails.value.seen ? 'Tirar dos Salvos' : 'Salvar Chat',
        icon: chatDetails.value.seen ? 'pi pi-bookmark-fill' : 'pi pi-bookmark',
        command: async () => {
          if (!chatDetails.value.thread_id) return;
          const newSeenStatus = !chatDetails.value.seen;
          try {
            const response = await ChatService.setSeenStatus(chatDetails.value.thread_id, {
              seen: newSeenStatus
            });
            chatDetails.value.seen = newSeenStatus;
            toast.add({
              severity: 'success',
              summary: newSeenStatus ? 'Chat salvo' : 'Chat removido',
              detail: newSeenStatus ? 'O chat foi salvo com sucesso' : 'O chat foi removido dos salvos',
              life: 3000
            });
          } catch (err) {
            toast.add({
              severity: 'error',
              summary: 'Erro',
              detail: 'Não foi possível alterar o status de salvamento',
              life: 3000
            });
          }
        }
      }
    ];
    optionsMenu.value.toggle(event);
  };
  
  // Adicione os estados e as funções para o diálogo de status
  const statusOptions = [
    { label: 'Urgente', value: 'urgente', severity: 'danger' },
    { label: 'Atenção', value: 'atencao', severity: 'warning' },
    { label: 'Info', value: 'info', severity: 'info' },
    { label: 'Pendente', value: 'pendente', severity: 'warning' },
    { label: 'Finalizado', value: 'finalizado', severity: 'success' },
    { label: 'Operador', value: 'operador', severity: 'info' }
  ];
  
  const updateChatStatus = async (newStatus) => {
    try {
      const response = await ChatService.setStatus(threadId.value, { status: newStatus });
      if (response) {
        chatDetails.value.status = newStatus;
        toast.add({
          severity: "success",
          summary: "Sucesso",
          detail: "Status atualizado com sucesso",
          life: 3000,
        });
      }
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
      toast.add({
        severity: "error",
        summary: "Erro",
        detail: "Não foi possível atualizar o status",
        life: 3000,
      });
    }
  };
  
  // Adicionar estado para controlar o envio de mensagem em andamento
  const isSendingMessage = ref(false);
  
  // Melhorar a função de envio de mensagem
  const sendResponse = async () => {
    if (!newMessage.value.trim()) {
      toast.add({
        severity: "warn",
        summary: "Atenção",
        detail: "Digite uma mensagem para enviar",
        life: 3000,
      });
      return;
    }
  
    isSendingMessage.value = true;
    const Profile = JSON.parse(localStorage.getItem(`profile`));

    try {
      const response = await ChatService.respondToChat(threadId.value, 
      {
        response: newMessage.value, send_name: Profile.data.nome || null
      });
  
      if (response && response.message_id) {
        // Atualizar a lista de mensagens após envio bem-sucedido
        loadChatDetails();
        newMessage.value = "";
        toast.add({
          severity: "success",
          summary: "Sucesso",
          detail: "Mensagem enviada com sucesso",
          life: 3000,
        });
      }
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
      toast.add({
        severity: "error",
        summary: "Erro",
        detail: "Não foi possível enviar a mensagem",
        life: 3000,
      });
    } finally {
      isSendingMessage.value = false;
    }
  };
  const statusMaps2 = {
    1:"Script",
    2:"Gestor",
  }
  // Extrair o ID do parâmetro da rota
  const routeId = computed(() => route.params.id);
  
  // Computar o thread_id, tentando usar o ID da rota
  const threadId = computed(() => {
    // Se temos um chat já carregado com thread_id, use-o
    if (chatDetails.value && chatDetails.value.thread_id) {
      return chatDetails.value.thread_id;
    }
    
    // Caso contrário, use o ID da rota
    return routeId.value;
  });
  
  // Carregar os detalhes do chat
  const loadChatDetails = async () => {
    if (!threadId.value) {
      console.error("ID de thread não disponível");
      return;
    }
    
    isLoading.value = true;
    error.value = null;
    
    try {
      const response = await ChatService.getChat(threadId.value);
      
      // Se o thread_id na resposta for diferente do ID da rota, atualizar a URL
      if (response.thread_id && response.thread_id !== routeId.value) {
        router.replace({
          path: `/inbox/${response.marketplace}/${route.params.state}/chat/${response.thread_id}`
        });
      }
      
      chatDetails.value = response;
      messages.value = response.messages || [];
      notas.value = response.notas || [];
      isLoading.value = false;
    } catch (error) {
      console.error("Erro ao carregar detalhes do chat:", error);
      error.value = "Erro ao carregar o chat. Tente novamente.";
      isLoading.value = false;
      toast.add({
        severity: "error", 
        summary: "Erro",
        detail: "Erro ao carregar detalhes do chat",
        life: 3000,
      });
    }
  };
  
  // Atualizar a função fetchNotes para usar thread_id
  const fetchNotes = async () => {
    if (!threadId.value) return;
    
    notesLoading.value = true;
    try {
      // Usar o método getNotesByThreadId
      const response = await NotesService.getNotesByThreadId(threadId.value);
      
      // Verifica se a resposta tem a estrutura paginada com "results"
      if (response && response.results) {
        // Se vier na estrutura paginada, usa o array results
        notes.value = response.results;
      } else if (Array.isArray(response)) {
        // Caso a API retorne diretamente um array
        notes.value = response;
      } else {
        // Formato de resposta inesperado
        notes.value = [];
      }
    } catch (error) {
      console.error('Erro ao carregar notas:', error);
      notes.value = [];
    } finally {
      notesLoading.value = false;
    }
  };
  
  // Atualizar a função saveNote para usar thread_id
  const saveNote = async (noteData) => {
    // Se vem do componente, usamos diretamente
    if (noteData) {
      currentNote.value = noteData;
    }
    
    if (!currentNote.value.text && !currentNote.value.nota) return;
    
    isNoteSaving.value = true;
    try {
      if (currentNote.value.id) {
        // Atualizar nota existente (usando a API existente)
        
        // Buscamos a nota original para obter o chat_id
        const originalNote = noteToUpdate.value;
        
        // Garantir que estamos usando o campo correto
        const noteText = currentNote.value.nota || currentNote.value.text;
        
        await NotesService.updateNote(currentNote.value.id, noteText, originalNote?.chat);
      } else {
        // Criar nova nota usando thread_id
        const noteText = currentNote.value.text || currentNote.value.nota;
        // Usar o método createNote
        await NotesService.createNote(threadId.value, {
          nota: noteText
        });
      }
      
      // Recarregar notas e limpar formulário
      await fetchNotes();
      resetNoteForm();
    } catch (error) {
      console.error('Erro ao salvar nota:', error);
    } finally {
      isNoteSaving.value = false;
    }
  };
  
  /**
   * Prepara o formulário para editar uma nota existente
   */
  const editNote = (note) => {
    noteToUpdate.value = note; // Armazenar a nota original completa
    currentNote.value = {
      id: note.id,
      text: note.nota
    };
  };
  
  /**
   * Resetar o formulário de nota
   */
  const resetNoteForm = () => {
    currentNote.value = { id: null, text: '' };
  };
  
  /**
   * Abre o diálogo de confirmação para excluir nota
   */
  const confirmDeleteNote = (note) => {
    noteToDelete.value = note;
    deleteNoteDialog.value = true;
  };
  
  /**
   * Exclui a nota selecionada usando order_id
   */
  const deleteNote = async () => {
    if (!noteToDelete.value) return;
    
    isDeleting.value = true;
    try {
      await NotesService.deleteNote(noteToDelete.value.id);
      deleteNoteDialog.value = false;
      await fetchNotes();
    } catch (error) {
      console.error('Erro ao excluir nota:', error);
    } finally {
      isDeleting.value = false;
    }
  };
  
  const reload = () => {
    if (route.params.id) {
      loadChatDetails();
      fetchNotes();
    }
  };
  
  const onCloseDialog = () => {
    visible.value = false;
    const { marketplace, state } = route.params;
    router.push(`/inbox/${marketplace}/${state}`);
  };
  
  // Toast para notificações
  const toast = useToast();
  
  // Watchers e ciclo de vida
  watch(
    () => route.params.id,
    async (newId) => {
      if (newId) {
        visible.value = true;
        await loadChatDetails();
        await fetchNotes();
      } else {
        visible.value = false;
        const { marketplace, state } = route.params;
        router.push(`/inbox/${marketplace}/${state}`);
      }
    },
    { immediate: true }
  );
  
  onMounted(() => {
    if (route.params.id) {
      loadChatDetails();
      fetchNotes();
    }
  });
  </script>
  
  <style scoped>
  .chat-header {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
  }
  
  .loading-container {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 200px;
  }
  
  .spinner {
    width: 50px;
    height: 50px;
  }
  
  .error-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 2rem;
    text-align: center;
    min-height: 300px;
  }
  
  .chat-layout {
    display: flex;
    gap: 1rem;
  }
  
  .chat-panel {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 100%;
    margin-bottom: 2rem;
  }
  
  .chat-container {
    display: flex !important;
    flex-direction: column-reverse !important;
    overflow-y: auto !important;
    padding: 1rem;
    height: 62dvh;
    gap: 0.75rem;
  }
  
  .message-wrapper {
    display: flex;
  }
  
  .message-wrapper.outgoing {
    justify-content: flex-end;
  }
  
  .message-wrapper.incoming {
    justify-content: flex-start;
  }
  
  .message-bubble {
    padding: 0.5rem 1rem;
    border-radius: 0.75rem;
    max-width: 60%;
    margin-top: 15px;
    border: solid 1px rgb(202, 202, 202);
    word-break: break-word;
  }
  
  .outgoing-bubble {
    background-color: var(--blue-400);
    color: black;
  }
  
  .incoming-bubble {
    background-color: var(--gray-300);
    color: black;
  }
  
  .message-timestamp {
    font-size: 0.75rem;
    margin-bottom: 0.25rem;
  }
  
  .message-input-container {
    border-top: 1px solid var(--surface-200);
    padding-top: 1rem;
    padding-left: 1rem;
    padding-right: 1rem;
    background-color: white;
  }
  
  .message-input-wrapper {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  .chat-info-tabs {
    width: 66.666667%;
  }
  
  ::-webkit-scrollbar {
    width: 6px !important;
  }
  
  ::-webkit-scrollbar-thumb {
    background-color: #cbd5e0 !important;
    border-radius: 4px !important;
  }
  
  /* Estilo para as abas de informações */
  .info-panel {
    padding: 0.5rem;
    height: 100%;
    overflow-y: auto;
    max-height: 65vh;
  }
  
  .info-section {
    margin-bottom: 1.5rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid var(--surface-200);
  }
  
  .info-section:last-child {
    border-bottom: none;
  }
  
  .info-title {
    font-size: 1rem;
    font-weight: 600;
    margin-bottom: 0.75rem;
    color: var(--primary-color);
  }
  
  .info-row {
    display: flex;
    margin-bottom: 0.5rem;
  }
  
  .info-label {
    font-weight: 600;
    min-width: 140px;
    color: var(--text-color-secondary);
  }
  
  .info-value {
    flex: 1;
  }
  
  .product-link, .tracking-link {
    color: var(--primary-color);
    text-decoration: none;
  }
  
  .product-link:hover, .tracking-link:hover {
    text-decoration: underline;
  }
  
  .no-data-message {
    color: var(--text-color-secondary);
    font-style: italic;
    text-align: center;
    padding: 2rem;
  }
  
  /* Estilos para a seção de notas */
  .notes-section {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  
  .notes-container {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-top: 1rem;
  }
  
  .note-item {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding: 1rem;
    background-color: #f8f9fa;
    border-radius: 6px;
    border-left: 3px solid var(--primary-color);
  }
  
  .note-content {
    flex: 1;
  }
  
  .note-actions {
    display: flex;
    gap: 0.5rem;
  }
  
  .note-date {
    font-size: 0.75rem;
    color: var(--text-color-secondary);
    margin-top: 0.5rem;
  }
  
  .no-notes-message {
    color: var(--text-color-secondary);
    font-style: italic;
    text-align: center;
    padding: 2rem;
  }
  
  .confirmation-content {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem 0;
  }
  
  /* Estilo para o diálogo de mudança de status */
  .status-options button {
    margin-bottom: 0.5rem;
    text-transform: capitalize;
  }
  
  /* Estilo para o botão enviar desabilitado */
  :deep(.p-button[disabled]) {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  /* Estilo para o campo de mensagem quando desabilitado */
  :deep(.p-inputtext[disabled]) {
    opacity: 0.6;
    background-color: var(--surface-100);
  }
  </style>
  