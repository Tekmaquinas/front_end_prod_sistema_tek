<template>
    <toolbar />
    <div class="bg-white m-0 min-h-screen w-full flex flex-col p-4 pt-0">
      <Toast />
      <ConfirmPopup />
      <div class="flex flex-col gap-4 mb-2" /> 
      <div v-if="isProgressVisible" class="mb-5 w-full">
        <ProgressBar :value="progressValue" />
        <div class="text-center mt-2 text-sm text-green-500 font-bold">
          Processando devoluções... {{progressValue}}%
        </div>
      </div>
  
      <div class="table-container flex-1 w-full h-full">
        <div class="flex justify-between items-center w-full mb-4">
          <div class="flex items-center relative w-[370px]">
            <IconField>
              <InputIcon>
                <i class="pi pi-search" />
              </InputIcon>
              <InputText v-model="filters['global'].value" placeholder="Pesquisar" />
            </IconField>
          </div>
          <div class="flex items-center">
            <Button v-if="selectedReturns.length > 0" label="Apagar" icon="pi pi-trash" class="p-button-danger  ml-2" size="small" rounded
            @click="DeleteSelectedReturns"
            />
            <Button label="Adicionar" icon="pi pi-plus" class="p-button-success  ml-2"  size="small" rounded
            @click="showCreateModal" 
            />
            
            <Button label="Exportar Relatório" icon="pi pi-file-excel" class="p-button-help  ml-2" size="small" rounded
            @click="exportCSV" 
            />
            <Button icon="pi pi-refresh" class=" ml-2 bg-black border-none"  size="small" rounded
            @click="refresh" 
            />
          </div>
        </div>
        <!-- Tabela -->
        <DataTable 
          showGridlines
          removableSort

          v-model:selection="selectedReturns" 
          
          paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport"
          currentPageReportTemplate="{first}-{last}/{totalRecords}"
          filterDisplay="menu"
          editMode="cell"
          dataKey="id"
          size="small"
            resizableColumns columnResizeMode="expand"
          :value="returns"
          :filters="filters"
          :virtualScrollerOptions="{ itemSize: 24 }"
          :loading="loading"
          :paginator="true" 
          :rows="100"
          :rowsPerPageOptions="[5,10,25,50]"
          
          
          @cell-edit-complete="onCellEditComplete"
          
          >
  
          <!-- Coluna de seleção -->
          <Column selectionMode="multiple" headerStyle="width: 1rem" />
          
          <!-- Order ID -->
          <Column field="order_id" header="Order ID" headerStyle="min-width: 8.5rem;" style="min-width: 8.5rem;">
              <template #body="{data, field}">
                  <div class="flex flex-col gap-0">
                      <div class="font-bold">{{ data[field] }}</div>
                  </div>
              </template>
              <template #editor="{ data, field }">
                  <InputText v-model="data[field]"  autofocus class="w-full input-cursor p-0.5" @keydown.enter="$event.target.blur()"/>
              </template>
          </Column>
  
          <!-- Origem -->
          <Column field="origem" header="Origem" headerStyle="min-width: 8.5rem;" style="min-width: 8.5rem;">
              <template #body="{data, field}">
                  <span class="truncate">{{ data[field] || '' }}</span>
              </template>
              <template #editor="{ data, field }">
                  <InputText v-model="data[field]" autofocus class="w-full input-cursor p-0.5" @keydown.enter="$event.target.blur()"/>
              </template>  
          </Column>
        
          <!-- Atualização -->
          <Column field="trackingStatus" header="Status Tracking" headerStyle="min-width: 8.5rem;" style="min-width: 8.5rem;">
            <template #body="{data, field}">
                <Tag v-if="data[field]" class="p-0.5 truncate" :value="data[field]" :severity="getTrackingStatusSeverity(data[field])" />
                <span v-else class="text-gray-400"></span>
            </template>
            <template #editor="{ data, field }">
              <InputText v-model="data[field]" autofocus class="w-full input-cursor p-0.5" @keydown.enter="$event.target.blur()"/>
            </template> 
          </Column>
          
          <!-- Tracking -->
          <Column field="trackingNumber" header="Tracking" headerStyle="min-width: 8.5rem;" style="min-width: 8.5rem;">
            <template #body="{data, field}">
              <div class="font-medium truncate">{{ data[field] || '' }}</div>
            </template>
            <template #editor="{ data, field }">
              <InputText v-model="data[field]" autofocus class="w-full input-cursor p-0.5" @keydown.enter="$event.target.blur()"/>
            </template>
          </Column>
  
          <!-- Valor -->
          <Column field="valorProduto" header="Valor" headerStyle="min-width: 5.5rem;" style="min-width: 5.5rem;">
            <template #body="{data, field}">
              <div class="font-bold">{{ formatCurrency(data[field]) || '' }}</div>
            </template>
            <template #editor="{ data, field }">
              <InputNumber v-model="data[field]" class="w-full input-cursor p-0.5" inputId="currency-germany"  
                  autofocus 
                  mode="currency" 
                  currency="EUR" 
                  @keydown.enter="$event.target.blur()" />
            </template>
          </Column>
        
          <!-- Banco -->
          <Column field="bankName" header="Banco" headerStyle="width: 2.5rem;" style="min-width: 8.5rem;">
            <template #body="{data, field}">
              <Tag v-if="data[field]" class="p-0.5 truncate" :value="data[field]" icon="pi pi-building" severity="info"/>
              <span v-else class="text-gray-400"></span>
            </template>
            <template #editor="{ data, field }">
              <InputText v-model="data[field]" autofocus class="w-full input-cursor p-0.5" @keydown.enter="$event.target.blur()"/>
            </template>
          </Column>
  
          <!-- Motivo da Devolução -->
          <Column field="motivoDevolucao" header="Motivo de Devolução" headerStyle="max-width: 460px; min-width: 260px">
            <template #body="{data, field}">
              <div class="whitespace-pre-wrap break-words word-break-all p-2 text-wrap"
                  style="min-width: 300px; max-width: 600px; box-sizing: border-box; overflow-wrap: anywhere;">
                  {{ data[field] || '' }}
              </div>
            </template>
            <template #editor="{ data, field }">
              <Textarea v-model="data[field]" class="w-full input-cursor p-0.3"  placeholder="Motivo" rows="1" cols="30" autoResize autofocus 
                  @keydown.enter.exact.prevent="() => {}" 
                  @keydown.enter.shift.exact="$event.target.blur()" />
            </template>
          </Column>
  
          <!-- Comentários -->
          <Column field="Comments" header="Comentários" headerStyle="max-width: 460px; min-width: 260px">
            <template #body="{data, field}">
              <div class="whitespace-pre-wrap break-words word-break-all overflow-y-auto p-2 text-wrap"
                  style="min-width: 300px; max-width: 600px; max-height: 150px; box-sizing: border-box; overflow-wrap: anywhere;">
                  {{ data[field] || '' }}
              </div>
            </template>
            <template #editor="{ data, field }">
              <Textarea v-model="data[field]" autoResize rows="1" cols="12" placeholder="Digite" autofocus class="w-full input-cursor p-0.3" 
                style=" width: 100%; overflow-wrap: anywhere; word-break: break-all; box-sizing: border-box;"
                @keydown.enter.exact.prevent="() => {}" 
                @keydown.enter.shift.exact="$event.target.blur()" />
            </template>
          </Column>
  
          <!-- Resolução -->
          <Column field="resolucao" header="Resolução" headerStyle="max-width: 460px; min-width: 260px" style="width: 2.5rem;">
            <template #body="{data, field}">
              <div class="text-3xs text-gray-500">{{ data[field] || '' }}</div>
            </template>
            <template #editor="{ data, field }">
              <Textarea v-model="data[field]" autofocus autoResize class="w-full input-cursor text-3xs"rows="1"cols="12" 
                style=" width: 100%; overflow-wrap: anywhere; word-break: break-all; box-sizing: border-box;"
                placeholder="Digite" 
                @keydown.enter="$event.target.blur()"/>
            </template>
          </Column>
  
          <!-- Ticket -->
          <Column field="ticketVevor" header="Ticket Vevor" headerStyle="width: 2rem;" style="width: 2rem;" >
            <template #body="{data, field}">
                <div class="flex items-center gap-1 ">
                    <a v-if="data[field]" 
                        class="text-3xs text-blue-500 hover:text-blue-700 w-full" 
                        :href="data[field]" 
                        style="text-decoration: underline;"target="_blank" >Ver Ticket</a>
    
                    <span v-else class="text-3xs text-gray-400">Nenhum ticket</span>
                    
                    <Button icon="pi pi-pencil" class="p-button-text p-button-sm p-button-rounded" @click="editTicketField(data)"/>
                </div>
            </template>
            <template #editor="{ data, field }">
              <InputText v-model="data[field]" autofocus class="w-full input-cursor text-3xs p-0.5" placeholder="" 
                  @keydown.enter="$event.target.blur()"/>
            </template>
          </Column>
  
          <!-- Estado -->
          <Column field="status" header="Estado do Pedido"  style="width: 2.5rem;" bodyClass="badge-info">
            <template #body="{ data, field }">
                <span style="width: 100%;" class="text-sm  rounded-lg flex items-center gap-1 w-fit" >
                    <span class="text-sm" style="font-size: small; text-align: center !important; width: 100%;">
                        {{ data[field] }}
                    </span>
                </span>
            </template>
            <template #editor="{ data, field }">
                <Select v-model="data[field]" class="w-full text-3xs p-0.5" :value="data[field]" :options="statusPedido" 
                    optionLabel="label" optionValue="value" placeholder="Sel." 
                    @change="onRowStateProgressUpdate(data)"/>
            </template>
          </Column>
        </DataTable>
      </div>
      
      <!-- Modal de Criação -->
      <Dialog v-model:visible="isCreateModalVisible" modal maximizable header="Adicionar Nova Devolução" :style="{ width: '50vw', padding: '1rem' }" 
        :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
        <Accordion value="0">

          <AccordionPanel>
            <AccordionHeader>Dados Básicos</AccordionHeader>
              <AccordionContent>
                <div class="flex flex-col gap-4">
                  <div class="flex justify-between gap-4">
                    <IftaLabel class="w-full">
                      <IconField>
                        <InputText v-model="newProductData.order_id" inputId="create_order_id" placeholder="Digite o order_id" fluid
                            :required="false" />
                      </IconField>
                      <label for="create_order_id">Order ID</label>
                    </IftaLabel>
                  </div>
                  <div class="flex justify-between gap-4">
                    <IftaLabel class="w-full">
                      <IconField>
                        <DatePicker v-model="newProductData.date" inputId="create_date" dateFormat="dd/mm/yy" placeholder="Selecione a data" fluid :required="false" />
                      </IconField>
                      <label for="create_date">Data de Criação</label>
                    </IftaLabel>
                    
                    <IftaLabel class="w-full">
                      <IconField>
                        <Textarea v-model="newProduct.origem"  class="w-full" inputId="create_origem" placeholder="Digite a origem" rows="3"
                            :required="false" />
                      </IconField>
                      <label for="create_origem">Origem do Pedido</label>
                    </IftaLabel>
                  </div>
                </div>
              </AccordionContent>
            </AccordionPanel>

            <AccordionPanel value="1">
              <AccordionHeader>Detalhes da Devolução</AccordionHeader>
              <AccordionContent>
                <div class="flex flex-col gap-5">
                  <div class="flex justify-between gap-6">
                    <IftaLabel class="w-full">
                      <IconField>
                        <InputText v-model="newProductData.trackingNumber" inputId="create_tracking" placeholder="Digite o número de rastreamento"
                        fluid :required="false" />
                      </IconField>
                      <label for="create_tracking">Tracking</label>
                    </IftaLabel>
                  </div>
                  <div class="flex flex-col gap-5">
                    <div class="flex justify-between gap-6">
                    <IftaLabel class="w-full">
                      <IconField>
                        <InputText v-model="newProductData.motivoDevolucao" inputId="create_reason" placeholder="Digite o motivo" class="w-full"
                        :required="false" />
                      </IconField>
                      <label for="create_reason" class="font-medium">Motivo da Devolução</label>
                    </IftaLabel>
                  </div>
                  </div>
                  
                  <div class="flex justify-between gap-4">
                    <IftaLabel class="w-full">
                      <IconField>
                        <InputText v-model="newProductData.ticketVevor" inputId="create_ticket" placeholder="Insira a Url" fluid :required="false" />
                      </IconField>
                      <label for="create_ticket">Ticket Vevor> </label>
                    </IftaLabel>
                  </div>
                  
                  <div class="flex justify-between gap-4">
                    <IftaLabel class="w-full">
                      <IconField>
                        <Textarea v-model="newProductData.trackingStatus" inputId="create_tracking_status" placeholder="Selecione o status"
                        fluid rows="3" :required="false" />
                      </IconField>
                      <label for="create_tracking_status">Status do Tracking</label>
                    </IftaLabel>
                    
                    <IftaLabel class="w-full">
                      <IconField>
                        <InputNumber v-model="newProductData.valorProduto" inputId="create_refund" mode="currency" currency="EUR" 
                        locale="de-DE" placeholder="Digite o valor" fluid
                        :required="false" />
                      </IconField>
                      <label for="create_refund">Valor a Reembolsar (€)</label>
                    </IftaLabel>
                    <IftaLabel class="w-full">
                      <IconField>
                        <InputText v-model="newProductData.bankName" inputId="create_bank" placeholder="Ex: Wise" 
                        class="w-full" />
                      </IconField>
                      <label for="create_bank" class="font-medium">Dados de Devolução</label>
                    </IftaLabel>
                  </div>
                </div>
              </AccordionContent>
            </AccordionPanel>

            <AccordionPanel value="2">
              <AccordionHeader>Informações Adicionais</AccordionHeader>
              <AccordionContent>
                <div class="flex justify-between gap-7">
                  <IftaLabel class="w-full">
                    <IconField>
                      <Textarea v-model="newProductData.resolucao" inputId="create_resolucao" rows="3" placeholder="Digite a Resolução" 
                      fluid :required="false" />
                    </IconField>
                    <label for="create_resolucao">Resolução</label>
                  </IftaLabel>
                  <IftaLabel class="w-full">
                        <IconField>
                            <Select v-model="newProductData.status" inputId="create_status" :options="statusPedido" optionLabel="label"
                                optionValue="value" placeholder="Selecione o estado" 
                                class="w-full"
                                :required="false" 
                                />
                        </IconField>
                        <label for="create_status">Estado do Pedido</label>
                  </IftaLabel>
                  <IftaLabel class="w-full">
                    <IconField>
                      <Textarea v-model="newProductData.Comments" inputId="create_comments" rows="3" placeholder="Digite os comentários" 
                      fluid :required="false" />
                    </IconField>
                    <label for="create_comments">Comentários</label>
                  </IftaLabel>
                </div>
              </AccordionContent>
            </AccordionPanel>
          </Accordion>
          <template #footer>
            <Button label="Cancelar" icon="pi pi-times" class="p-button-text" @click="cancelCreate" />
            <Button label="Salvar" icon="pi pi-check" class="p-button-success" @click="newProduct" />
          </template>
      </Dialog>
  
  
    </div>
  </template>
    
  <script setup>
  
    import toolbar from '../components/toolbar.vue';
    import { ref, watch, inject, onMounted } from 'vue';
    import { useToast } from 'primevue/usetoast';
    import { useConfirm } from 'primevue/useconfirm';
    import { Badge } from 'primevue';
  
  
  const base_url = inject('base_url_devolucoes');
  const toast = useToast();
  const searchQuery = ref('');
  const selectedReturns = ref([]);
  const isProgressVisible = ref(false);
  const progressValue = ref(0);
  const isCreateModalVisible = ref(false);
  const loading = ref(false);
  const returns = ref([]);
  const confirm = useConfirm();
  
  const statusPedido = [
    { label: 'Em Trânsito', value: 'Em Trânsito' },
    { label: 'Entregue', value: 'Entregue' },
    { label: 'Devolvido', value: 'Devolvido' },
    { label: 'Pendente', value: 'Pendente' }
  ]

  
  onMounted(() => {
    fetchResponseReturn();
  });
  
  async function updateStatus(data, field){
    const novo_valor = data[field];
    const index = returns.value.findIndex(item => item.id === data.id);
    if (index !== -1) {
      returns.value[index].status = novo_valor;
    }
  }
  
  watch(searchQuery, (newValue) => {
  filters.value.global.value = newValue;
  });
  
  const filters = ref({
    global: { value: null, matchMode: 'contains' },
    'order_id': { 
      operator: 'and', 
      constraints: [{ value: null, matchMode: 'equals' }] 
    },
    'origem': { 
      operator: 'or', 
      constraints: [{ value: null, matchMode: 'equals' }] 
    },
    'trackingStatus': { 
      operator: 'or', 
      constraints: [{ value: null, matchMode: 'equals' }] 
    },
    'lastUpdate': { 
      operator: 'and', 
      constraints: [{ value: null, matchMode: 'equals' }] 
    },
    'trackingNumber': { 
      operator: 'and', 
      constraints: [{ value: null, matchMode: 'contains' }] 
    },
    'valorProduto': { 
      operator: 'and', 
      constraints: [{ value: null, matchMode: 'equals' }] 
    },
    'bankName': { 
      operator: 'and', 
      constraints: [{ value: null, matchMode: 'contains' }] 
    },
    'motivoDevolucao': { 
      operator: 'and', 
      constraints: [{ value: null, matchMode: 'contains' }] 
    },
    'Comments': { 
      operator: 'and', 
      constraints: [{ value: null, matchMode: 'contains' }] 
    },
    'resolucao': { 
      operator: 'and', 
      constraints: [{ value: null, matchMode: 'contains' }] 
    },
    'status': { 
      operator: 'or', 
      constraints: [{ value: null, matchMode: 'equals' }] 
    },
  });
  
    const updateStateProgress = async (return_id, state_item) => {

        const response = await fetch(`${base_url}/v1/devolucoes/update/${return_id}`, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status: state_item }),
            credentials: 'include'});

        if (response.redirected || response.status === 302 || response.status === 401) {
            window.location.href = "/login";
            return;
        }

        if (!response.ok) {
            throw new Error('Erro ${response.status}: Não foi possível atualizar o link.');
        }

        const data = await response.json();
        return data;
    };

    
    async function onRowStateProgressUpdate(data_returns) {
        const item_state = data_returns['status'];
        const item_id = data_returns['id'];

        const response = await updateStateProgress(item_id,item_state);  
            const index = returns.value.findIndex(return_ => return_.id === data_returns.id);
            if (index !== -1) {
                returns.value[index].status = response.status;
            }

    }


  const onCellEditComplete = async (event) => {
    const { data, newValue, field } = event;
    
    try {
      if (!data || !field || !data.id) {
        throw new Error('Dados incompletos para edição');
      }
  
      const oldValue = data[field];
      data[field] = newValue;
  
      // Corrigido: usando o ID real do item na URL
      const response = await fetch(`${base_url}/v1/devolucoes/update/${data.id}`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: data.id,
          [field]: newValue
        }),
      });
  
      if (!response.ok) {
        data[field] = oldValue;
        throw new Error('Erro ao atualizar no servidor');
      }
  
      // Atualiza o item na lista local com os dados retornados
      const updatedData = await response.json();
      const index = returns.value.findIndex(item => item.id === data.id);
      if (index !== -1) {
        returns.value[index] = { ...returns.value[index], ...updatedData };
      }
  
      toast.add({
        severity: 'success',
        summary: 'Atualizado',
        detail: `Campo atualizado com sucesso`,
        life: 3000
      });
      // toast.add({
      //   severity: 'success',
      //   summary: 'Atualizado',
      //   detail: `Campo ${field} atualizado com sucesso`,
      //   life: 3000
      // });
  
    } catch (error) {
      console.error('Erro ao editar célula:', error);
      
      // Feedback de erro
      toast.add({
        severity: 'error',
        summary: 'Erro na edição',
        detail: error.message || 'Falha ao atualizar o campo',
        life: 5000
      });
    }
  };
  
  const DeleteSelectedReturns = (event) => {
    if (!selectedReturns.value || selectedReturns.value.length === 0) {
      toast.add({
        severity: 'warn',
        summary: 'Nenhum item selecionado',
        detail: 'Selecione pelo menos um item para excluir',
        life: 3000
      });
      return;
    }
  
    confirm.require({
      target: event.currentTarget,
      message: `Deseja realmente excluir ${selectedReturns.value.length} item(ns) selecionado(s)?`,
      header: 'Confirmação de Exclusão',
      icon: 'pi pi-exclamation-triangle',
      rejectClass: 'p-button-secondary p-button-outlined',
      acceptClass: 'p-button-danger',
      acceptLabel: 'Excluir',
      rejectLabel: 'Cancelar',
      accept: async () => {
        loading.value = true;
        
        try {
          const idsToDelete = selectedReturns.value.map(item => item.id);
          const deletePromises = idsToDelete.map(id => 
            fetch(`${base_url}/v1/devolucoes/delete/${id}`, {
              method: 'DELETE',
              credentials: 'include'
            })
          );
          
          await Promise.all(deletePromises);
          returns.value = returns.value.filter(item => !idsToDelete.includes(item.id));
          selectedReturns.value = [];
    
          toast.add({
            severity: 'success',
            summary: 'Sucesso!',
            detail: `${idsToDelete.length} item(ns) excluído(s)`,
            life: 3000
          });
          
        } catch (error) {
          console.error('Erro ao excluir:', error);
          toast.add({
            severity: 'error',
            summary: 'Erro',
            detail: error.message || 'Falha ao excluir itens',
            life: 5000
          });
        } finally {
          loading.value = false;
        }
      },
      reject: () => {
        toast.add({
          severity: 'info',
          summary: 'Cancelado',
          detail: 'Exclusão não realizada',
          life: 2000
        });
      }
    });
  };
  
  function handleRowClick(event) {
    if (event.target.closest('.p-column-editor') || event.target.closest('input') || event.target.closest('textarea')) return;
  }
    
  const editTicketField = (slotProps) => {
    // Encontra a linha correspondente na tabela
    const row = document.querySelector(`[data-pc-section="row"][data-pc-index="${slotProps.index}"]`);
    if (row) {
       // Encontra o campo ticketVevor e ativa a edição
       const editButton = row.querySelector('[data-pc-section="editbutton"]');
       if (editButton) {
        editButton.click();
      }
    }
  };
  
  const fetchResponseReturn = async () => {
      try {
        const response = await fetch(`${base_url}/v1/devolucoes/`,{
          method: 'GET',
          credentials: 'include',
          headers: {
          'Content-Type': 'application/json',
          },
          });
  
        const data = await response.json()
        returns.value = data
      } catch (error) {
        console.error('Erro ao buscar devoluções:', error);
      toast.add({
        severity: 'error',
        summary: 'Erro ao carregar',
        detail: error.message || 'Falha ao carregar dados do servidor',
        life: 5000
      });
  }}
  
  
      
  const formatCurrency = (value) => {
    if (!value) return '€ 0,00';
    const formatted = new Intl.NumberFormat('pt-PT', {
      style: 'currency',
      currency: 'EUR'
    }).format(value);
    return formatted.endsWith('€') ? `€ ${formatted.replace(/\s?€$/, '')}` : formatted;
  };
  
      
  const getTrackingStatusSeverity = (status) => {
    switch(status) {
      case 'Entregue': return 'success';
      case 'Em Trânsito': return 'info';
      case 'Atrasado': return 'warning';
      default: return 'null';
    }
  };
  
  const exportCSV = () => {
    try {
      const dataToExport = selectedReturns.value?.length > 0 
        ? selectedReturns.value 
        : returns.value;
  
      if (!dataToExport?.length) {
        toast.add({
          severity: 'warn',
          summary: 'Nenhum dado para exportar',
          detail: 'Não há dados disponíveis para exportação',
          life: 3000
        });
        return;
      }
  
      let csvContent = "\uFEFF";
      const headers = [
        'Order ID', 'Origem', 'Status Tracking', 'Tracking', 
        'Valor', 'Banco', 'Motivo de Devolução', 'Comentários', 
        'Resolução', 'Ticket Vevor', 'Estado do Pedido'
      ];
      csvContent += headers.join(";") + "\r\n";
  
      dataToExport.forEach(item => {
        const row = [
          item.order_id || '',
          item.origem || '',
          item.trackingStatus || '',
          item.trackingNumber || '',
          item.valorProduto ? formatCurrency(item.valorProduto) : '',
          item.bankName || '',
          `"${(item.motivoDevolucao || '').replace(/"/g, '""')}"`,
          `"${(item.Comments || '').replace(/"/g, '""')}"`,
          item.resolucao || '',
          item.ticketVevor || '',
          item.status || ''
        ];
        csvContent += row.join(";") + "\r\n";
      });
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `devolucoes_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      
      setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }, 100);
  
      toast.add({
        severity: 'success',
        summary: 'Exportação concluída',
        detail: selectedReturns.value?.length > 0
          ? `${selectedReturns.value.length} item(ns) selecionado(s) exportado(s)`
          : 'Planilha exportada com sucesso',
        life: 3000
      });
  
    } catch (error) {
      console.error('Erro na exportação:', error);
      toast.add({
        severity: 'error',
        summary: 'Erro na exportação',
        detail: error.message || 'Falha ao exportar os dados',
        life: 5000
      });
    }
  };
      
  const refresh = async () => {
    try {
      // Mostra mensagem de carregamento
      toast.add({
        severity: 'info',
        summary: 'Atualizando',
        detail: 'Recarregando dados da tabela...',
        life: 2000
      });
  
      // Ativa o estado de loading
      loading.value = true;
  
      // Limpa seleções se necessário
      selectedReturns.value = [];
  
      // Força um pequeno delay para o usuário perceber a atualização
      await new Promise(resolve => setTimeout(resolve, 300));
  
      // Chama a função de carregamento dos dados
      await fetchResponseReturn();
  
      // Feedback de sucesso
      toast.add({
        severity: 'success',
        summary: 'Atualizado',
        detail: 'Dados da tabela recarregados com sucesso',
        life: 3000
      });
  
    } catch (error) {
      console.error('Erro ao recarregar tabela:', error);
      toast.add({
        severity: 'error',
        summary: 'Erro na atualização',
        detail: 'Falha ao recarregar os dados da tabela',
        life: 5000
      });
    } finally {
      loading.value = false;
    }
  };
  
  const newProductData = ref({
    order_id: '',
    origem: '',
    motivoDevolucao: '',
    Comments: '',
    trackingNumber: '',
    carrier: '',
    trackingStatus: '',
    valorProduto: 0,
    resolucao: '',
    ticketVevor: '',
    status: 'Pendente',
    bankName: ''
  });
  
  const newProduct = async () => {
    try {
      toast.add({
        severity: 'info',
        summary: 'Aguarde..',
        detail: `Enviando dados`,
        life: 3000
      });
      const currentDate = new Date();
      const timestamp = currentDate.getTime();
  
      const requestBody = {
        order_id: newProductData.value.order_id || null,
        date: timestamp,
        lastUpdate: timestamp,
        origem: newProductData.value.origem || null,
        motivoDevolucao: newProductData.value.motivoDevolucao || null,
        Comments: newProductData.value.Comments || null,
        trackingNumber: newProductData.value.trackingNumber || null,
        carrier: newProductData.value.carrier || null,
        trackingStatus: newProductData.value.trackingStatus || null,
        valorProduto: newProductData.value.valorProduto !== null && newProductData.value.valorProduto !== '' 
          ? Number(newProductData.value.valorProduto) 
          : null,
        resolucao: newProductData.value.resolucao || null,
        ticketVevor: newProductData.value.ticketVevor || null,
        status: newProductData.value.status || 'Pendente',
        bankName: newProductData.value.bankName || null,
        isNew: true
      };
  
      loading.value = true;
  
      const response = await fetch(`${base_url}/v1/devolucoes/create`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao criar novo item na API');
      }
  
      const createdItem = await response.json();
      returns.value = [createdItem, ...returns.value];
  
      toast.add({
        severity: 'success',
        summary: 'Sucesso',
        detail: `Devolução criada com sucesso${createdItem.order_id ? ' #' + createdItem.order_id : ''}`,
        life: 3000
      });
  
      isCreateModalVisible.value = false;
      resetNewProductData();
     
      
  
    } catch (error) {
      console.error('Erro ao criar novo produto:', error);
      
      toast.add({
        severity: 'error',
        summary: 'Erro',
        detail: error.message || 'Falha ao criar nova devolução',
        life: 5000
      });
    } finally {
      loading.value = false;
    }
  };
  
  const resetNewProductData = () => {
    newProductData.value = {
      order_id: '',
      origem: '',
      motivoDevolucao: '',
      Comments: '',
      trackingNumber: '',
      carrier: '',
      trackingStatus: '',
      valorProduto: null,
      resolucao: '',
      ticketVevor: '',
      status: 'Pendente',
      bankName: ''
    };
  };
  
  const showCreateModal = () => {
    isCreateModalVisible.value = true;
  };
  
  const cancelCreate = () => {
    isCreateModalVisible.value = false;
    newProductData.value = {};
  };
  
  </script>
      
    <style scoped>
    .table-container {
      caret-color: transparent !important;
    }
    
    :deep(.p-datatable .p-datatable-tbody > tr > td) {
      user-select: none !important;
      -webkit-user-select: none !important;
      cursor: default !important;
      padding: 0.3rem;
      font-size: 0.75rem;
    }
    
    :deep(.p-datatable .p-datatable-tbody > tr > td textarea),
    :deep(.p-datatable .p-datatable-tbody > tr > td .p-inputtext),
    :deep(.p-datatable .p-datatable-tbody > tr > td .p-dropdown),
    :deep(.p-datatable .p-datatable-tbody > tr > td .p-calendar) {
    cursor: text !important;
    user-select: text !important;
    caret-color: auto !important;
    }
    :deep(.p-datatable .p-datatable-tbody > tr > td input:focus),
    :deep(.p-datatable .p-datatable-tbody > tr > td textarea:focus) {
      outline: none !important;
      box-shadow: none !important;
    }
    
    :deep(.p-button) {
      cursor: pointer !important;
    }
    
    :deep(.p-datatable .p-selectable-row:focus) {
      outline: none !important;
      box-shadow: none !important;
    }
    
    :deep(.custom-datatable) {
      --row-highlight-border: none !important;
    }
    
    :deep(.custom-datatable .p-datatable .p-datatable-tbody > tr:focus) {
      outline: none !important;
      box-shadow: none !important;
    }
    
    :deep(.p-datatable .p-datatable-tbody > tr > td.p-selection-column) {
      border-left: none !important;
      padding-left: 0 !important;
    }
    
    :deep(.p-datatable .p-selection-column .p-checkbox .p-checkbox-box) {
      border: none !important;
      background: transparent !important;
      box-shadow: none !important;
    }
    
    :deep(.p-datatable .p-selection-column) {
      padding-left: 0.5rem !important;
      border-left: none !important;
      background: transparent !important;
    }
    
    :deep(.p-datatable .p-datatable-tbody > tr.p-highlight > td.p-selection-column) {
      border-left: none !important;
    }
    
    :deep(.p-datatable .p-datatable-tbody > tr > td:first-child),
    :deep(.p-datatable .p-datatable-thead > tr > th:first-child) {
      border-left: none !important;
      padding-left: 0.5rem !important;
    }
      
    :deep(.p-datatable .p-datatable-thead > tr > th) {
      padding: 0.3rem;
      font-size: 0.8rem;
    }
    
    :deep(.p-datatable .p-datatable-tbody > tr.unread-row) {
      background-color: #f0f7ff !important;
      border-left: 4px solid #2196F3;
    }
    
    :deep(.p-datatable .p-datatable-tbody > tr.unread-row:hover) {
      background-color: #e1f0ff !important;
    }
      
    :deep(.p-datatable .p-datatable-tbody > tr > td .flex.flex-col .text-2xs) {
      font-size: 0.7rem !important;
      line-height: 1 !important;
      margin-top: 0.1rem !important;
    }
    
    :deep(.p-datatable .p-datatable-tbody > tr > td .p-inputtext:focus),
    :deep(.p-datatable .p-datatable-tbody > tr > td .p-textarea:focus),
    :deep(.p-datatable .p-datatable-tbody > tr > td .p-dropdown:focus),
    :deep(.p-datatable .p-datatable-tbody > tr > td .p-calendar:focus) {
      outline: none !important;
      box-shadow: none !important;
      border: none !important;
    }
    
    :deep(.p-dialog .p-inputtext:focus),
    :deep(.p-dialog .p-textarea:focus),
    :deep(.p-dialog .p-dropdown:focus),
    :deep(.p-dialog .p-calendar:focus) {
      outline: none !important;
      box-shadow: none !important;
      border: none !important;
    }
    
    :deep(.p-button:focus) {
      outline: none !important;
      box-shadow: none !important;
    }
    
    input:focus {
      outline: none;
    }
    .custom-datatable *:focus {
      outline: none !important;
    }
    .table-container *:focus {
      outline: none !important;
    }
    
    :deep(.custom-datatable.p-datatable .p-datatable-tbody > tr > td) {
      border-left: none;
    }
    
    :deep(.p-datatable .p-datatable-tbody > tr > td:focus),
    :deep(.p-datatable .p-datatable-tbody > tr > td *:focus) {
      outline: none !important;
      box-shadow: none !important;
    }
    :deep(.p-datatable .no-focus) {
      outline: none !important;
      box-shadow: none !important;
      caret-color: transparent !important;
      pointer-events: none;
    }
    :deep(.p-datatable input),
    :deep(.p-datatable textarea) {
      caret-color: transparent !important;
    }
    
    .p-popover-content {
      padding: 0.5rem !important;
      min-width: 200px;
    }
    .p-button.justify-start {
      justify-content: flex-start;
      text-align: left;
    }
  </style>