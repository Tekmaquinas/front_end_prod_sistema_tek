<template>
    <Card class="h-full" style="min-height: 85dvh">
      <template #content>
        <DataTable
          :value="chats"
          :rowClass="rowClass"
          :rowStyle="rowStyle"
          paginator
          :rows="pagination.pageSize"
          :rowsPerPageOptions="[20, 50, 100, 200]"
          :totalRecords="totalRecords"
          :loading="isLoading"
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown CurrentPageReport"
          currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} registros"
          @page="onPageChange"
          :lazy="true"
          selectionMode="single"
          dataKey="thread_id"
          v-model:selection="selectedChat"
          :metaKeySelection="false"
          @rowSelect="onRowSelect"
          tableStyle="min-width: 50rem"
          size="small"
          scrollable scrollHeight="calc(100vh - 250px)"
          responsiveLayout="scroll"
          class="p-datatable-sm"
        >
          <template #header>
            <div class="flex flex-wrap items-center justify-between gap-5">
              <div class="flex flex-wrap items-center gap-2">
                <!-- Campo de busca -->
                <IconField>
                  <InputIcon>
                    <i class="pi pi-search" />
                  </InputIcon>
                  <InputText
                    v-model="searchQuery"
                    id="search"
                    name="search"
                    type="text"
                    placeholder="Pesquisar"
                    variant="filled"
                    size="small"
                    style="width: 20dvw"
                    @keyup.enter="executeSearch"
                  />
                </IconField>
  
                <!-- Seletor de marketplace -->
                <div class="field">
                  <select
                    v-model="searchMarketplace"
                    class="p-inputtext p-component p-inputtext-sm w-32"
                    aria-label="Selecione o marketplace"
                  >
                    <option value="">Todos</option>
                    <option value="leroy">Leroy</option>
                    <option value="worten">Worten</option>
                  </select>
                </div>
  
                <!-- Checkbox Deep Search -->
                <div class="flex items-center">
                  <Checkbox v-model="isDeepSearch" binary inputId="deep-search" />
                  <label for="deep-search" class="ml-2 cursor-pointer"
                    >Busca profunda</label
                  >
                </div>
  
                <!-- Botões de busca e limpar -->
                <div class="flex gap-1">
                  <Button
                    icon="pi pi-search"
                    severity="primary"
                    size="small"
                    @click="executeSearch"
                    :loading="isSearchInProgress"
                    :disabled="!searchQuery.trim()"
                  />
                  <Button
                    v-if="isSearchMode"
                    icon="pi pi-times"
                    severity="secondary"
                    size="small"
                    @click="cancelSearch"
                    :disabled="isSearchInProgress"
                    title="Limpar busca"
                  />
                </div>
              </div>
            </div>
          </template>
  
          <!-- Colunas da tabela -->
          <Column field="seen" header="" :style="{ width: '40px' }">
            <template #body="{ data }">
              <SavedIndicator
                :saved="data.seen === true"
                size="small"
                @click.stop="toggleSaveStatus(data)"
              />
            </template>
          </Column>
          <Column field="user_name"></Column>
          <Column field="topic_value"></Column>
  
          <Column field="date_updated">
            <template #body="slotProps">
              {{ DateFormat(slotProps.data.date_updated) }}
            </template>
          </Column>
  
          <Column field="order_id" style="width: 15%"></Column>
          <Column field="total_messages">
            <template #body="slotProps">
              <!-- Badge vermelho para chats não lidos (shop_reply_needed = true) -->
              <Badge
                v-if="slotProps.data.shop_reply_needed === true"
                severity="danger"
              />
            </template>
          </Column>
          <Column field="status" style="width: 15%"></Column>
          <Column style="width: 0.1rem; padding: 0px;">
            <template #body="{ data }">

              <Tag v-if="data?.order_data?.has_incident == true" v-tooltip.top="{ value: 'Incidente Aberto',pt: {text: '!bg-primary !text-primary-contrast !font-medium'}}" class="pi pi-exclamation-circle " severity="warn" style=" font-size: small; background-color: transparent;" />

            </template>
          </Column>
          <!-- Coluna para o menu de opções -->
          <Column style="width: 50px; text-align: center">
            <template #body="slotProps">
              <Button
                icon="pi pi-ellipsis-v"
                text
                rounded
                aria-label="Opções"
                @click="(event) => openOptionsMenu(event, slotProps.data)"
                aria-haspopup="true"
              />
            </template>
          </Column>
  
          <template #paginatorstart>
            <Button
              type="button"
              icon="pi pi-refresh"
              text
              @click="refreshData"
            />
          </template>
  
          <template #paginatorend>
            <span class="text-sm text-gray-500">Total: {{ totalRecords }}</span>
          </template>
        </DataTable>
  
        <!-- Diálogo para mudança de status -->
        <Dialog
          v-model:visible="changeStatusDialog"
          modal
          header="Alterar Status"
          :style="{ width: '400px' }"
        >
          <div class="p-3">
            <h3 class="mb-3">Selecione o novo status:</h3>
            <div class="status-options grid grid-cols-2 gap-2">
              <Button
                v-for="option in statusOptions"
                :key="option.value"
                :label="option.label"
                :severity="option.severity"
                @click="changeStatus(option.value)"
                class="w-full"
              />
            </div>
          </div>
          <template #footer>
            <Button
              label="Cancelar"
              icon="pi pi-times"
              @click="changeStatusDialog = false"
              text
            />
          </template>
        </Dialog>
  
        <!-- Menu de opções global -->
        <Menu ref="optionsMenu" :model="currentMenuItems" :popup="true" />
        <router-view></router-view>
      </template>
    </Card>
  </template>
  
  <script>
  // Adicionamos um <script> normal para definir apenas as props
  import { useRoute } from "vue-router";
  
  export default {
    props: {
      statusFilter: {
        type: String,
        default() {
          const route = useRoute();
          return route.params.state || 'pendente';
        }
      }
    }
  }
  </script>
  
  <script setup>
  import { useRoute, useRouter } from "vue-router";
  import { ref, watch, onMounted, inject, computed, onBeforeUnmount } from "vue";
  import { DateFormat } from "../utils.mjs";
  import { ChatService } from "./services/api";
  import { useToast } from "primevue/usetoast";
  import SavedIndicator from "./ui/SavedIndicator.vue";
  import { normalizeChats } from "./utils/chatUtils.js";
  
  // Props e injeções
  const router = useRouter();
  const route = useRoute();
  // Note que não estamos usando defineProps aqui, as props já foram definidas no script normal acima
  
  const endpoint = useRoute();
  const baseUrl = inject("base_url");
  const emitter = inject("emitter", null);
  
  // Obter o estado global da pesquisa
  const globalSearchState = inject("globalSearchState", null);
  
  // Estado do componente
  const marketplace = ref(endpoint.params.marketplace);
  const state = ref(endpoint.params.state);
  const chats = ref([]);
  const pagination = ref({ page: 1, pageSize: 20 });
  const totalRecords = ref(0);
  const isLoading = ref(false);
  
  // Estado para o sistema de busca
  // Usar os valores do estado global, se disponível
  const searchQuery = ref(globalSearchState?.value?.query || "");
  const searchMarketplace = ref(globalSearchState?.value?.marketplace || "");
  const isDeepSearch = ref(globalSearchState?.value?.isDeep || false);
  const isSearchInProgress = ref(false);
  const isSearchMode = ref(globalSearchState?.value?.isActive || false);
  
  // Inicializar chats e totalRecords com valores do estado global, se disponível
  if (
    globalSearchState?.value?.isActive &&
    globalSearchState?.value?.results.length > 0
  ) {
    chats.value = globalSearchState.value.results;
    totalRecords.value = globalSearchState.value.totalCount;
    pagination.value = { ...globalSearchState.value.pagination };
  }
  
  // Toast para notificações
  const toast = useToast();
  
  // Referências e estados
  const optionsMenu = ref(null);
  const selectedChat = ref(null);
  const changeStatusDialog = ref(false);
  const currentMenuItems = ref([]);
  
  // Opções de status disponíveis
  const statusOptions = [
    { label: "Urgente", value: "urgente", severity: "danger" },
    { label: "Atenção", value: "atencao", severity: "warning" },
    { label: "Info", value: "info", severity: "info" },
    { label: "Pendente", value: "pendente", severity: "warning" },
    { label: "Finalizado", value: "finalizado", severity: "success" },
    { label: "Operador", value: "operador", severity: "info" },
  ];
  
  // --- FUNÇÕES DE MENU E UI ---
  
  /**
   * Abre o menu de opções para um chat específico
   */
  const openOptionsMenu = (event, chat) => {
    event.stopPropagation(); // Impede que o clique selecione a linha
    selectedChat.value = chat;
  
    // Atualiza os itens do menu com base no chat selecionado
    currentMenuItems.value = [
      {
        label: "Mudar Status",
        icon: "pi pi-tag",
        command: () => showChangeStatusDialog(),
      },
      {
        label: chat.seen ? "Remover dos salvos" : "Salvar chat",
        icon: chat.seen ? "pi pi-bookmark-fill" : "pi pi-bookmark",
        command: () => toggleSaveChat(),
      },
    ];
  
    // Mostra o menu
    optionsMenu.value.toggle(event);
  };
  
  /**
   * Abre o diálogo para mudar o status
   */
  const showChangeStatusDialog = () => {
    changeStatusDialog.value = true;
  };
  
  // --- FUNÇÕES DE AÇÃO DE CHAT ---
  
  /**
   * Muda o status do chat selecionado
   */
  const changeStatus = async (newStatus) => {
    if (!selectedChat.value || !selectedChat.value.thread_id) return;
  
    try {
      // Usar o método setStatus com thread_id
      await ChatService.setStatus(selectedChat.value.thread_id, {
        status: newStatus
      });
  
      // Fechar o diálogo
      changeStatusDialog.value = false;
  
      // Notificar o usuário
      toast.add({
        severity: "success",
        summary: "Status atualizado",
        detail: `O status do chat foi alterado para ${newStatus}`,
        life: 3000,
      });
  
      // Atualizar a lista de chats
      refreshData();
    } catch (error) {
      console.error("Erro ao alterar status:", error);
      toast.add({
        severity: "error",
        summary: "Erro",
        detail: "Não foi possível alterar o status do chat",
        life: 3000,
      });
    }
  };
  
  /**
   * Alterna o estado de salvamento do chat selecionado
   */
  const toggleSaveChat = async () => {
    if (!selectedChat.value || !selectedChat.value.thread_id) return;
  
    // Captura o ID e o status atual para log
    const threadId = selectedChat.value.thread_id;
    const currentStatus = selectedChat.value.seen;
  
    // Inverte o estado atual
    const newSeenStatus = !currentStatus;
  
    try {
      // Usar o método setSeenStatus com thread_id
      const response = await ChatService.setSeenStatus(threadId, {
        seen: newSeenStatus
      });
  
      // Atualizar o status localmente no chat selecionado
      selectedChat.value.seen = newSeenStatus;
  
      // Notificar o usuário
      toast.add({
        severity: "success",
        summary: newSeenStatus ? "Chat salvo" : "Chat removido",
        detail: newSeenStatus
          ? "O chat foi salvo com sucesso"
          : "O chat foi removido dos salvos",
        life: 3000,
      });
  
      // Atualizar a lista de chats
      refreshData();
    } catch (error) {
      console.error("Erro ao alterar status de salvamento:", error);
      toast.add({
        severity: "error",
        summary: "Erro",
        detail: "Não foi possível alterar o status de salvamento",
        life: 3000,
      });
    }
  };
  
  /**
   * Alterna o status de salvamento de um chat diretamente na tabela
   */
  const toggleSaveStatus = async (chat) => {
    try {
      // Usar thread_id
      const response = await ChatService.setSeenStatus(
        chat.thread_id, 
        { seen: !chat.seen }
      );
  
      // Atualizar o item na lista localmente
      if (response) {
        const updatedChat = chats.value.find(c => c.thread_id === chat.thread_id);
        if (updatedChat) {
          updatedChat.seen = response.seen;
        }
      }
  
      // Notificar sobre a alteração
      if (emitter) emitter.emit("notifications-updated");
  
      // Feedback para o usuário
      const action = chat.seen ? "removido dos salvos" : "salvo";
      toast.add({
        severity: "success",
        summary: "Sucesso",
        detail: `Chat ${action} com sucesso`,
        life: 3000,
      });
    } catch (error) {
      console.error("Erro ao alterar status de salvamento:", error);
      toast.add({
        severity: "error",
        summary: "Erro",
        detail: "Não foi possível alterar o status de salvamento",
        life: 3000,
      });
    }
  };
  
  /**
   * Atualiza os dados
   */
  const refreshData = () => {
    if (isSearchMode.value) {
      executeSearch();
    } else {
      fetchChats();
    }
  };
  
  // --- FUNÇÕES DE CARREGAMENTO E BUSCA ---
  
  /**
   * Executa a busca com base no tipo (normal ou profunda)
   */
  const executeSearch = async () => {
    // Validação do termo de busca
    const searchTerm = searchQuery.value.trim();
    if (!searchTerm) return;
  
    isSearchInProgress.value = true;
    isSearchMode.value = true;
    pagination.value.page = 1; // Resetar para a primeira página em nova busca
  
    try {
      const params = {
        page: pagination.value.page,
        pageSize: pagination.value.pageSize,
      };
  
      // Adicionar marketplace se estiver selecionado
      if (searchMarketplace.value) {
        params.marketplace = searchMarketplace.value;
      }
  
      let data;
  
      if (isDeepSearch.value) {
        data = await ChatService.deepSearch(searchTerm, params);
      } else {
        data = await ChatService.search(searchTerm, params);
      }
  
      // Verificar se temos dados válidos
      if (!data || (!data.results && !Array.isArray(data))) {
        data = { results: [], count: 0 };
      }
  
      // Garantir que os dados estejam no formato esperado
      if (Array.isArray(data)) {
        chats.value = normalizeChats(data);
        totalRecords.value = data.length;
      } else {
        // Atualizar os resultados locais
        chats.value = normalizeChats(data?.results || []);
        totalRecords.value = data?.count || chats.value.length || 0;
      }
  
      // Atualizar o estado global com os resultados da pesquisa
      if (globalSearchState) {
        globalSearchState.value = {
          query: searchQuery.value,
          marketplace: searchMarketplace.value,
          isDeep: isDeepSearch.value,
          isActive: true,
          results: chats.value,
          totalCount: totalRecords.value,
          pagination: { ...pagination.value },
        };
      }
  
      return data;
    } catch (error) {
      console.error(
        `Erro na ${isDeepSearch.value ? "busca profunda" : "busca"}:`,
        error
      );
  
      // Limpar resultados em caso de erro
      chats.value = [];
      totalRecords.value = 0;
  
      // Notificar o usuário sobre o erro
      toast.add({
        severity: "error",
        summary: "Erro na busca",
        detail: "Não foi possível completar a busca. Tente novamente.",
        life: 3000,
      });
  
      return null;
    } finally {
      isSearchInProgress.value = false;
    }
  };
  
  /**
   * Cancela a busca e retorna ao modo normal de listagem
   */
  const cancelSearch = () => {
    if (!isSearchMode.value) return;
  
    // Limpar campos e estado de busca local
    searchQuery.value = "";
    searchMarketplace.value = "";
    isDeepSearch.value = false;
    isSearchMode.value = false;
    pagination.value.page = 1;
  
    // Limpar o estado global de pesquisa
    if (globalSearchState) {
      globalSearchState.value = {
        query: "",
        marketplace: "",
        isDeep: false,
        isActive: false,
        results: [],
        totalCount: 0,
        pagination: { page: 1, pageSize: 10 },
      };
    }
  
    // Recarregar os dados normais da aba atual
    fetchChats();
  };
  
  /**
   * Busca chats com base nos parâmetros atuais
   */
  const fetchChats = async () => {
    // Não fazer busca normal se estiver em modo de busca
    if (isSearchMode.value) return;
  
    isLoading.value = true;
    try {
      // Parâmetros base da requisição
      const params = {
        page: pagination.value.page,
        pageSize: pagination.value.pageSize,
      };
  
      // Se não for 'all', adiciona o marketplace
      if (marketplace.value !== "ia") {
        params.marketplace = marketplace.value;
      }
  
      // Aplicar filtros específicos de acordo com o estado
      switch (state.value) {
        case "nao_lidos":
          // Chats não lidos (cliente foi o último a responder)
          params.notific = "true";
          break;
        case "lidos":
          // Chats lidos (operador foi o último a responder)
          params.notific = "false";
          break;
        case "atencao":
          // Chats com alerta
          params.alert = "true";
          break;
        case "urgente":
          // Chats com status urgente
          params.status = "urgente";
          break;
        case "info":
          // Chats com status info
          params.status = "info";
          break;
        case "finalizado":
          // Chats com status finalizado
          params.status = "finalizado";
          break;
        case "saved":
          // Chats salvos
          params.seen = "true";
          break;
        case "operador":
          // Chats com status operador
          params.status = "operador";
          break;
        case "pendente":
          // Caixa de entrada - todas as mensagens do marketplace, sem filtro de status
          break;
        default:
          // Nenhum filtro específico - Caixa de Entrada
      }
  
      const data = await ChatService.getChats(params);
  
      // Atualizar os dados e registrar informações de debug
      // Normalizar os chats para garantir valores consistentes
      chats.value = normalizeChats(data?.results || []);
      totalRecords.value = data?.count || 0;
    } catch (error) {
      console.error("Erro ao carregar os chats:", error);
      chats.value = [];
      totalRecords.value = 0;
    } finally {
      isLoading.value = false;
    }
  };
  
  /**
   * Trata evento de mudança de página
   */
  const onPageChange = (event) => {
    // A PrimeVue usa index 0-based para páginas, mas a API usa 1-based
    pagination.value.page = event.page + 1;
    pagination.value.pageSize = event.rows;
  
    if (isSearchMode.value && searchQuery.value.trim()) {
      executeSearch();
    } else {
      fetchChats();
    }
  };
  
  // --- FUNÇÕES DE ESTILO E APARÊNCIA ---
  
  /**
   * Define classes para linhas da tabela
   * shop_reply_needed: true = chat NÃO LIDO (precisa de resposta)
   * shop_reply_needed: false = chat LIDO (não precisa de resposta)
   */
  const rowClass = (data) => {
    return !data.shop_reply_needed ? ["text-primary-contrast", "lida"] : [];
  };
  
  /**
   * Define estilo para linhas da tabela
   * shop_reply_needed: true = chat NÃO LIDO (em negrito)
   * shop_reply_needed: false = chat LIDO (em cor cinza)
   */
  const rowStyle = (data) => {
    return data.shop_reply_needed === true
      ? { fontWeight: 600 }
      : { color: "gray" };
  };
  
  /**
   * Trata seleção de linha
   */
  const onRowSelect = (event) => {
    const chat = event.data;
    if (chat && chat.thread_id) {
      router.push(`/inbox/${chat.marketplace}/${route.params.state}/chat/${chat.thread_id}`);
    } else {
      console.error("Thread ID não disponível para este chat");
      toast.add({
        severity: "error",
        summary: "Erro",
        detail: "Não foi possível abrir o chat: thread_id não disponível",
        life: 3000,
      });
    }
  };
  
  // --- WATCHERS E LIFECYCLE HOOKS ---
  
  // Observar mudanças nos parâmetros da rota
  watch(
    () => endpoint.params,
    (newParams, oldParams) => {
      const newMarketplace = newParams.marketplace;
      const newState = newParams.state;
      const oldMarketplace = oldParams?.marketplace;
      const oldState = oldParams?.state;
  
      // Verificar se estamos mudando de aba/marketplace
      const changedTab =
        newMarketplace !== oldMarketplace || newState !== oldState;
  
      // Verificar se estamos na mesma aba
      const sameTab = newMarketplace === oldMarketplace && newState === oldState;
  
      // Se estamos navegando para um chat, não fazemos nada
      const goingToChat = newParams.id && !oldParams?.id;
      if (goingToChat) {
        return;
      }
  
      // Se estamos retornando de um chat para a lista
      const returnedFromChat = oldParams?.id && !newParams.id;
  
      // Atualizar os valores de marketplace e state
      marketplace.value = newMarketplace;
      state.value = newState;
  
      // Se estamos apenas voltando de um chat, não redefinimos a página
      if (!returnedFromChat) {
        pagination.value.page = 1; // Resetar para a primeira página apenas se não estamos voltando de um chat
      }
  
      // Se estamos retornando de um chat com estado de pesquisa ativo
      if (returnedFromChat && isSearchMode.value) {
        return;
      }
  
      // Se mudamos de aba e tínhamos uma pesquisa, cancelar a pesquisa e mostrar a nova aba
      if (changedTab && isSearchMode.value) {
        cancelSearch();
      }
      // Se estamos voltando de um chat ou mudando de aba, recarregar os dados normais
      else if (returnedFromChat || changedTab) {
        if (!isSearchMode.value) {
          fetchChats();
        }
      }
    },
    { deep: true }
  );
  
  watch(
    () => pagination.value.pageSize,
    (newSize, oldSize) => {
      if (newSize !== oldSize) {
        fetchChats();
      }
    }
  );
  
  // Observar o estado global para atualizar o estado local se o estado global mudar
  if (globalSearchState) {
    watch(
      () => globalSearchState.value,
      (newGlobalState) => {
        if (newGlobalState.isActive) {
          // Atualizar o estado local com o global
          searchQuery.value = newGlobalState.query;
          searchMarketplace.value = newGlobalState.marketplace;
          isDeepSearch.value = newGlobalState.isDeep;
          isSearchMode.value = newGlobalState.isActive;
  
          // Atualizar chats se o estado global tem resultados
          if (newGlobalState.results && newGlobalState.results.length > 0) {
            chats.value = newGlobalState.results;
            totalRecords.value = newGlobalState.totalCount;
            pagination.value = { ...newGlobalState.pagination };
          }
        }
      },
      { deep: true }
    );
  }
  
  // Configurar listeners para eventos
  const setupEventListeners = () => {
    if (emitter) {
      // Remover qualquer listener existente para evitar duplicatas
      emitter.off("chat-closed");
  
      // Adicionar listener para o evento de fechamento de chat
      emitter.on("chat-closed", () => {
        // Verificar se os resultados locais estão atualizados com o global
        if (
          globalSearchState?.value?.isActive &&
          globalSearchState.value.results.length > 0 &&
          isSearchMode.value &&
          searchQuery.value.trim()
        ) {
          const globalResultsMatch =
            globalSearchState.value.results.length === chats.value.length &&
            globalSearchState.value.query === searchQuery.value;
  
          if (!globalResultsMatch) {
            chats.value = globalSearchState.value.results;
            totalRecords.value = globalSearchState.value.totalCount;
            pagination.value = { ...globalSearchState.value.pagination };
          }
        }
      });
    }
  };
  
  // Inicializar dados na montagem
  onMounted(async () => {
    // Configurar listeners para eventos
    setupEventListeners();
  
    // Pequeno delay para garantir que o componente seja totalmente montado
    await new Promise((resolve) => setTimeout(resolve, 100));
  
    // Verificar se temos estado de pesquisa ativo (global ou local)
    const hasActiveSearch =
      isSearchMode.value ||
      (globalSearchState?.value?.isActive &&
        globalSearchState.value.results.length > 0);
  
    if (hasActiveSearch) {
      if (
        globalSearchState?.value?.isActive &&
        globalSearchState.value.results.length > 0
      ) {
        chats.value = globalSearchState.value.results;
        totalRecords.value = globalSearchState.value.totalCount;
        pagination.value = { ...globalSearchState.value.pagination };
      }
    } else {
      fetchChats();
    }
  });
  
  // Remover listeners e limpar recursos ao desmontar
  onBeforeUnmount(() => {
    if (emitter) {
      emitter.off("chat-closed");
    }
  });
  </script>
  
  <style scoped>
  /* Estilos para o paginador */
  :deep(.p-paginator) {
    padding: 1rem;
    border-radius: 0.5rem;
  }
  
  :deep(.p-paginator .p-paginator-current) {
    margin-left: auto;
  }
  
  :deep(.p-datatable-footer) {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  :deep(.p-dropdown-label) {
    display: flex;
    align-items: center;
  }
  
  /* Estilo para o diálogo de mudança de status */
  .status-options button {
    margin-bottom: 0.5rem;
    text-transform: capitalize;
  }
  </style>
  