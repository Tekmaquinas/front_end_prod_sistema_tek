<template>
  <toolbar />
  <Cards_ :route="marketplace"/>
  <div style="margin: auto .5rem; padding: .5rem; background-color: white;  flex: 1; border-radius: 15px;">

    <DataTable
      resizableColumns columnResizeMode="fit"
      v-model:expandedRows="expandedRows"
      v-model:editingRows="editingRows"
      :value="loading ? skeletonRows : products"
      :sortField="sortField"
      :sortOrder="sortOrder"
      collapsedRowIcon="pi pi-angle-down"
      expandedRowIcon="pi pi-angle-up"
      dataKey="unique_id_order"
      editMode="cell"
      :first="(getPaginaFromUrl() - 1) * rows"
      @row-edit-save="onRowEditSave"
      @cell-edit-complete="onCellEditComplete"
      :paginator="true"
      :rows="rows"
      :totalRecords="totalRecords"
      :lazy="true"
      size="small"
      removableSort
      @page="onPageChange"
      v-model:selection="selectedProduct"
      stripedRows
      scrollable
      scrollHeight="67dvh"
      :pt="{

        cell: { style: 'padding: 0 !important' },
        column: {
          bodycell: ({ state }) => (state.loading ? { style: 'opacity: 0.5' } : {})
        },
      }"
    >
    <template #header>          

        <div class="flex flex-wrap items-center justify-between gap-5" style=" margin-bottom: .2rem;">
          <div class="flex flex-wrap items-center justify-between gap-5">
            <span class="font-bold">Pedidos LEROY</span>
            <div class="flex flex-wrap items-center justify-between gap-5" >                
              <SearchBar :route="marketplace"  @updateData="CallbackFilters" />
          </div>
          </div>
          <div class="flex flex-wrap items-center justify-between gap-5">
              <div v-if="selectedProduct && selectedProduct.length > 0">
                <div class="flex items-center gap-4">
                  <Select v-model="selectedAssigment"  :value="selectedAssigment" :options="cities" optionLabel="name" placeholder="Selecione Atribuição" :invalid="!selectedAssigment" size="small"/>
                  <Button @click="sendchanges(selectedProduct)" severity="contrast" label="Enviar Encomenda" size="small" rounded outlined />
                </div>

              </div>
              <Button icon="pi pi-refresh" severity="contrast" size="small" rounded raised @click="ReloadPageSelected" />
          </div>

        </div>
        
      </template>
      <Column selectionMode="multiple" headerStyle="width: 1rem"> </Column>

      <Column field="state" header="State" style="width: 2rem;">
        <template #body="{ data, field }">
          <Skeleton v-if="loading" style="margin: 2px;" />
          <div v-else class="icon-container">
            <i v-tooltip.top="{ value: data[field],pt: {text: '!bg-primary !text-primary-contrast !font-medium'}}" :class="getSeverityIcon(data[field])"></i>
          </div>
        </template>
      </Column>


      <Column field="state_progress" header="Progresso" style="min-width: 55px; max-width: 190px; width: 60px; align-self: center; padding: 0px;">
        <!-- Corpo da coluna, exibe tag ou skeleton -->
        <template #body="{ data, field }">
          <Skeleton v-if="loading" style="margin: 2px;" />
          <div v-else class="flex justify-center">
              <div v-if="data.atribuicao != null" class="flex gap-1">
                <Tag severity="secondary" style="font-size: 11px;">
                  {{ statusMaps2[data.atribuicao] }}
                </Tag>
                <Tag :class="getNameStatus(data[field], 2)">
                  {{ getNameStatus(data[field], 1) }}</Tag>
              </div>
              <div v-else class="flex">
                <Tag :class="getNameStatus(data[field], 2)">
                  {{ getNameStatus(data[field], 1) }}</Tag>
              </div>

          </div>

        </template>

        <!-- Editor da célula -->
        <template #editor="{ data, field }">
          <Select
            v-model="data[field]"
            :options="statusProgressOptions"
            optionLabel="label"
            optionValue="value"
            placeholder="Selecione o status"
            style="width: 100%; margin: 2px;"
            @change="onRowStateProgressUpdate(data)"
          />
        </template>
      </Column>


      <Column field="order_id" header="Order ID"  style="min-width: 50px;  max-width: 390px; width: 90px; align-self: center;">
        <template #body="{ data, field }" >
          <Skeleton v-if="loading" style="margin: 2px;"/>
          <div v-else >
            <span class="locale">{{ data['locale'] }}</span>
            <a  :href="`${base_redirect}/mmp/shop/order/${data[field]}`" target="_blank" rel="noopener noreferrer" style="font-size: 12px;">{{ data[field] }}</a>
            <p style="font-size: x-small;">
              {{ data['created_date'] }} <i v-if="data.shipping_tracking === '10954001468219DE'" v-tooltip.top="{ value: 'Tracking Fake',pt: {text: '!bg-primary !text-primary-contrast !font-medium'}}" class="pi pi-info-circle"  style="color: blue; font-size: x-small; " />
            </p>
          </div>
          
        </template>
      </Column>



      <Column field="image_url" header="imagem" style="min-width: 50px;max-width: 51px;align-self: center;">
            <template #body="{ data, field }">
                <Skeleton v-if="loading" style="margin: 2px;"/>
                <div v-else-if="data['thumb'] != null" >
                  <img :src="data.thumb" :alt="data.product_title" class="w-24 rounded image_products" />
                </div>

            </template>
      </Column>


      <Column field="name" header="produto" style="min-width: 150px; max-width: 360px;">
        <template #body="{ data, field }">
          <Skeleton v-if="loading" style="margin: 2px;" />
          <template v-else-if="data['thumb'] != null">
            <!-- Link do título com truncamento -->
              <div style="line-height: 15px;"> 
                <a 
                    :href="data.link" 
                    target="_blank" 
                    style="font-size: 12px; font-weight: 500; display: inline-block; max-width: 100%; overflow: hidden; white-space: nowrap; text-overflow: ellipsis;" 
                    rel="noopener noreferrer">
                    <span v-if="data.product_title.includes('[ Tem no Armazém ] -')"
                          v-html="data.product_title.replace('[ Tem no Armazém ] -', '<strong style=&quot;background-color:rgba(255, 213, 0, 0.183);&quot;> [ Tem no Armazém ] -</strong>')">
                    </span>
                    <span v-else>
                      {{ data.product_title }}
                    </span>
                  </a>

              <p style=" font-size: small; font-stretch: condensed;" 
                class="text-surface-500 dark:text-surface-100" 
                rounded>
                sku product: {{ data.sku }}
              </p>
              
              <div>
                  <Skeleton v-if="loading" style="margin: 2px;"/>
                  <div v-else>
                    <p style=" font-size: small; font-stretch: condensed; line-height: 10px;"
                        class="text-surface-500 dark:text-surface-100" >quantidade: {{ data['quantity'] }}</p>
                  </div>
                  
              </div>
              </div>

              
            <!-- Linha de SKU -->
            
          </template>
        </template>
      </Column>

      <Column field="comment" headerStyle="font-size: 14px width: 15rem"  header="comentario" class="column_comment" style="max-width: 15rem;">
        <template #body="{ data, field }">
          <Skeleton v-if="loading" style="margin: 2px;" />
          <div v-else class="column_border_left column_border_right" style="min-height: 35px; padding-left: 20px; padding-right: 20px;">
            <p style="word-wrap: break-word; white-space: normal; overflow-wrap: break-word; max-width: 15rem;">
              {{ data[field] }}
            </p>
          </div>
        </template>

        <template #editor="{ data, field }">
          <template v-if="field !== 'price'">
            <InputText v-model="data[field]" autofocus fluid />
          </template>
          <template v-else>
            <InputNumber v-model="data[field]" autofocus fluid />
          </template>
        </template>
      </Column>

      <Column field="price" headerStyle="font-size: 14px"  header="Preço" style="width: 1rem; padding: 5px;">
        <template #body="{ data, field }">
          <Skeleton v-if="loading" style="margin: 2px;"/>
          <div v-else>
            <p  style="font-size: 12px; font-weight: 500; color: gray; ">{{ data[field] }} €</p>
          </div>
          
        </template>
      </Column>

      
      <Column headerStyle="font-size: 14px" field="stock" header="stock"  class="!text-end" style="width: 1rem; padding: 5px;">
        <template #body="{ data, field }">
          <Skeleton v-if="loading" style="margin: 15px;"/>
          <div v-else-if="data[field] !=null" class="flex items-center justify-between" style="width: 100%; text-align: center;">
            <span style="flex-grow: 1; text-align: end; font-size: 12px;">{{ data[field] }}</span>
            <Tag
              icon="pi pi-fw pi-sync"
              severity="Primary"
              rounded
              style="cursor: pointer; text-align: center; background-color: white; transition: background-color 0.3s;"
              @click="onRowStockUpdate(data)"
              @mouseover="hoverTag = true"
              @mouseleave="hoverTag = false"
              :class="{ 'tag-hover': hoverTag }"
            />
          </div>
        </template>
      </Column>


      <!-- <Column :rowEditor="true" style="width: 6.5rem;" bodyStyle="text-align:end">
      
      </Column> -->
      <Column header="informações" style="width: 0.1rem; padding: 0px;">
        <template #body="{ data }">
          <div v-if="data.state != 'Aguardando Aceitação'" class="flex gap-1" >
            <Tag v-if="data.has_customer_message == true" v-tooltip.top="{ value: 'Mensagens',pt: {text: '!bg-primary !text-primary-contrast !font-medium'}}" class="pi pi-envelope " severity="info" style=" font-size: small; " />
            <Tag v-else-if="data.has_customer_message != true" v-tooltip.top="{ value: 'Mensagens',pt: {text: '!bg-primary !text-primary-contrast !font-medium'}}" class="pi pi-envelope icon_valid" severity="secondary" style="font-size: small; " />
            
            <Tag v-if="data.has_incident == true" v-tooltip.top="{ value: 'Incidente Aberto',pt: {text: '!bg-primary !text-primary-contrast !font-medium'}}" class="pi pi-exclamation-circle " severity="warn" style=" font-size: small; " />
            <Tag v-else-if="data.has_incident != true" v-tooltip.top="{ value: 'Incidente Aberto',pt: {text: '!bg-primary !text-primary-contrast !font-medium'}}" class="pi pi-exclamation-circle icon_valid" severity="secondary" style="font-size: small; " />

            <Tag v-if="data.edit == true" v-tooltip.top="{ value: 'Revisão de Morada',pt: {text: '!bg-primary !text-primary-contrast !font-medium'}}" class="pi pi-home icon_invalid" severity="danger" style="color: red; font-size: small; " />
            <Tag v-else-if="data.edit != true" v-tooltip.top="{ value: 'Revisão de Morada',pt: {text: '!bg-primary !text-primary-contrast !font-medium'}}" class="pi pi-home icon_valid" severity="secondary" style="font-size: small; " />

          </div>
        </template>
      </Column>

      <Column style="width: 0.1rem; padding: 5px;">
        <template #body="{ data }">
          <div v-if="data.state != 'Aguardando Aceitação'" >
            <Button
              icon="pi pi-pen-to-square"
              @click="openPrepareOrdersEditor(data)"
              severity="secondary"
              style="background: transparent; border: none;"
              rounded
            ></Button>
          </div>
        </template>
      </Column>

    </DataTable>
    <EditorOrder
            v-if="selectedRowData && Object.keys(selectedRowData).length > 0"
            :route="marketplace"
            v-model:visible="showDialogEditor"
            :data="selectedRowData"
            @updateData="updateDataTableEditor"
            style="padding: 0px;"
          />
  </div>
  <Toast position="bottom-right" group="br" />
  <ConfirmDialog></ConfirmDialog>
  <!-- <ScrollTop severity="contrast"/> -->
</template>

<script setup>
  import toolbar from '../components/toolbar.vue';
  import { ref, onMounted } from 'vue';
  import Button from 'primevue/button';
  import EditorOrder from '../components/EditOrder.vue';
  import Cards_ from '../components/InfoOrders.vue';
  import DataTable from 'primevue/datatable';
  import Column from 'primevue/column';
  import Tag from 'primevue/tag';
  import { useToast } from "primevue/usetoast";
  import { inject } from 'vue';
  import { getSeverityIcon, getNameStatus, saveToCache, getFromCache, fetchOrders, updateLink, searching_func } from '../components/utils.mjs'; // Importando funções nomeadas

  import SearchBar from '../components/filters_query.vue';

  const marketplace = ref("leroy");
  const base_redirect = ref("https://adeo-marketplace.mirakl.net")
  const base_url = inject('base_url');
  const editingRows = ref([]);
  const expandedRows = ref({});
  const products = ref([]);
  const totalRecords = ref(0);
  const skeletonRows = ref(new Array(20).fill({}));
  const currentPage = ref(1);
  const rows = 48; 
  const loading = ref(false);
  const hoverTag = ref(false);
  const toast = useToast();
  const sortField = ref(null);
  const sortOrder = ref(1);
  const metaKey = ref(false);
  const selectedProduct = ref([]);
  const showDialog = ref(false);
  const showDialogEditor = ref(false);
  const selectedRowData = ref({});
  const statusMaps2 = {
    1:"Script",
    2:"Gestor",
  }

  const selectedAssigment = ref('Atribuir ao Automatizado');
    const cities = ref([
      { name: 'Atribuir ao Gestor', code: 2 },
      { name: 'Atribuir ao Automatizador', code: 1},
    ]);


    const statusProgressOptions = ref([
    { label: 'Pedido Novo', value: 1 },
    { label: 'Em preparo', value: 2 },
    { label: 'Encomenda Feita', value: 3 },
    { label: 'Aguardando Tracking', value: 4 },
    { label: 'Concluído', value: 5 },
    { label: 'Sem Estoque', value: 6 },
    { label: 'Reembolsado', value: 7 },
    { label: 'Cancelado', value: 8 },
    { label: 'Tracking Fake', value: 9 },
    { label: 'Encomenda Fake', value: 10 },
    { label: 'Etiqueta Pronta', value: 11 }
  ]);
  const updateDataTable = (updatedData) => {
    
    if (updatedData != false) {
        selectedProduct.value = [];
        const response_products = updatedData.products;
        response_products.forEach((response_product) => {
          const index = products.value.findIndex(product => product.unique_id_order === response_product.unique_id_order);
          if (index !== -1) {
            products.value[index] = response_product;
            
          }
        });
    }
  };

  async function CallbackFilters(payload) {
    localStorage.setItem(`payload_${marketplace.value}`, JSON.stringify(payload));
    currentPage.value = 1
    fetchProducts(1);
  };

  const openPrepareOrdersEditor = (rowData) => {
    selectedRowData.value = rowData; // Atualiza os dados da linha
    showDialogEditor.value = true;   // Abre o diálogo
  };
  
  const updateDataTableEditor = (updatedData) => {
    
    if (updatedData != false) {
        selectedProduct.value = [];
        const response_products = updatedData;
        response_products.forEach((response_product) => {
          const index = products.value.findIndex(product => product.unique_id_order === response_product.unique_id_order);
          if (index !== -1) {
            products.value[index] = response_product;
          }
        });
    }
   
  };

  const onRowEditSave = async (event) => {
    const { newData, index } = event;
    const updatedProduct = products.value[index];

    if (updatedProduct.link !== newData.link) {
      const sku = updatedProduct.sku;
      const newLink = newData.link;
      const order_id = updatedProduct.order_id;
      const newStateProgress = newData.state_progress;
      // Chama a função para atualizar o link na API
      const response = await updateLink(base_url,sku, newStateProgress,order_id, newLink);

      // Atualiza os dados no array reativo
      products.value[index].link = response.link;
      products.value[index].state_progress = response.state_progress;
      products.value[index].atribuicao = response.atribuicao;

    }
    if (updatedProduct.state_progress !== newData.state_progress) {
      const sku = updatedProduct.sku;
      const order_id = updatedProduct.order_id;
      const newLink = newData.link;
      const newStateProgress = newData.state_progress;
      const response = await updateLink(base_url,sku, newStateProgress,order_id, newLink);

      // Atualiza os dados no array reativo
      products.value[index].link = response.link;
      products.value[index].state_progress = response.state_progress;
      products.value[index].atribuicao = response.atribuicao;
      
    }

  };
  
  const updateStock = async (Order_id,Link) => {
    try {
      const response = await fetch(`${base_url}/links/GoodSn`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ link: Link ,order_id: Order_id}),
        credentials: 'include',
      });


      if (response.redirected || response.status === 302 || response.status === 401) {
        window.location.href = "/login"; 
        return;
      }

      if (!response.ok) {
        throw new Error('Erro ${response.status}: Não foi possível atualizar o link.');
      }

      const data = await response.json();
      return data;
    } catch (err) {
    }
  };

  const updateComment = async (unique_order_id,comment) => {
    try {
      const response = await fetch(`${base_url}/orders/comment`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ unique_order_id: unique_order_id,comment:comment}),
        credentials: 'include', // Garantir envio do cookie de autenticação
      });

      // Verifica se o usuário foi redirecionado
      if (response.redirected || response.status === 302 || response.status === 401) {
        window.location.href = "/login"; // Redireciona para a página de login
        return;
      }

      if (!response.ok) {
        throw new Error('Erro ${response.status}: Não foi possível atualizar o link.');
      }

      const data = await response.json();
      return data;
    } catch (err) {
    }
  };

  const updateStateProgress = async (Order_id,state_progress) => {
    try {
      const response = await fetch(`${base_url}/orders/state_progress`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ state_progress: state_progress,order_id: Order_id}),
        credentials: 'include', // Garantir envio do cookie de autenticação
      });

      // Verifica se o usuário foi redirecionado
      if (response.redirected || response.status === 302 || response.status === 401) {
        window.location.href = "/login"; // Redireciona para a página de login
        return;
      }

      if (!response.ok) {
        throw new Error('Erro ${response.status}: Não foi possível atualizar o link.');
      }

      const data = await response.json();

      return data;
    } catch (err) {
      console.error('Erro ao atualizar o link:', err);
    }
  };

  async function fetchProducts(page) {
    loading.value = true;
    const savedPayload = JSON.parse(localStorage.getItem(`payload_${marketplace.value}`));

    if (savedPayload) {
          const updatedData = await searching_func(base_url,marketplace.value,savedPayload,currentPage.value);
          products.value = updatedData.offers
          totalRecords.value = updatedData.total_records || 0;
          loading.value = false; 

    } else {
        const cachedData = getFromCache(`page_cache_${marketplace.value}_${page}`, 10000);
        if (cachedData) {
          products.value = cachedData.products;
          totalRecords.value = cachedData.totalRecords;
          loading.value = false; 
          return;
        }

        const data = await fetchOrders(page,base_url,rows,marketplace.value);

        products.value = data.products.map((product) => ({
          ...product,
          
        }));
        totalRecords.value = data.total_records || 0;

        saveToCache(`page_cache_${marketplace.value}_${page}`, { products: products.value, totalRecords: totalRecords.value });
        loading.value = false; 
      
      }


  }

  const sendchanges = async (selectedProduct) => {
      const itens = selectedProduct.map((item) => item.order_id);
      const payload = {
        itens,
        assigment: selectedAssigment.value['code'],
      };

      try {
        const response = await fetch(`${base_url}/orders/assignment?marketplace=${marketplace.value}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
          credentials: 'include', // Garantir envio do cookie de autenticação
        });

        if (!response.ok) {
          throw new Error(`Erro ${response.status}: Não foi possível atualizar.`);
        }

        const data = await response.json();
        updateDataTable(data);
        selectedProduct.value = []
      } catch (error) {
      }
    };

  async function onRowStockUpdate(dataproduct) {
      const newLink = dataproduct['link'];
      const order_id = dataproduct['unique_id_order'];
      try {
          const response = await updateStock(order_id,newLink);  
              const index = products.value.findIndex(product => product.unique_id_order === dataproduct.unique_id_order);
              if (index !== -1) {
                  products.value[index].stock = response.stock;
                  products.value[index].state_progress = response.state_progress;
                  toast.add({
                      severity: 'success',
                      summary: 'Progresso Atualizado',
                      detail: `O Progresso foi atualizado para ${response.stock}`,
                      group: 'br',
                      life: 3000
                  });
            
          }
      } catch (error) {
          toast.add({
              severity: 'error',
              summary: 'Erro ao Atualizar Stock',
              detail: error,
              group: 'br',
              life: 3000
          });
      }
  }

  async function onRowStateProgressUpdate(dataproduct) {
      const newLink = dataproduct['state_progress'];
      const order_id = dataproduct['unique_id_order'];
      try {
          const response = await updateStateProgress(order_id,newLink);  

              // Encontra o índice do produto na tabela
              const index = products.value.findIndex(product => product.unique_id_order === dataproduct.unique_id_order);

              if (index !== -1) {
                  products.value[index].state_progress = response.state_progress;
                  products.value[index].atribuicao = response.atribuicao;
                  
                  // Mensagem de sucesso
                  toast.add({
                      severity: 'success',
                      summary: 'Progresso Atualizado',
                      detail: `O Progresso foi atualizado para ${getNameStatus(response.state_progress, 1)}`,
                      group: 'br',
                      life: 3000
                  });
            
          }
      } catch (error) {
          // Mensagem de erro
          toast.add({
              severity: 'error',
              summary: 'Erro ao Atualizar Stock',
              detail: error,
              group: 'br',
              life: 3000
          });

          // Opcional: redefinir o campo `link` para null
        
      }
  }

  const onPageChange = (event) => {
    currentPage.value = event.page + 1;
    fetchProducts(currentPage.value);
  };

  const getPaginaFromUrl = () => {
    const urlParams = new URLSearchParams(window.location.search);
    return parseInt(urlParams.get('page'), 10) || 1;
  };

  const ReloadPageSelected = () => {
    const page = getPaginaFromUrl()
    currentPage.value = page
    fetchProducts(page);
  };

  onMounted(() => {
    const page = getPaginaFromUrl()
    currentPage.value = page
    fetchProducts(page);
  });

  const onCellEditComplete = async (event) => {
    let { data, newValue, field } = event;
    if (field == 'comment') {
      const response = await updateComment(data.unique_id_order,newValue);  
      const index = products.value.findIndex(product => product.unique_id_order === data.unique_id_order);

      if (index !== -1) {
            products.value[index].comment = response.comment;
            toast.add({
                severity: 'success',
                summary: 'Comentario',
                detail: 'seu comentario foi adicionado ao item',
                group: 'br',
                life: 3000
            });
      
            }
    }


  };

</script>

<style scoped>
    .locale {
      font-size: 11px;
      border: solid 1px black;
      border-radius: 5px;
      padding: 0px 3px;
      font-weight: 600;
      margin-right: 7px;
    }
    .image_products {
      max-width: 50px !important;
      border: solid 1px !important;
      border-color: rgb(231, 231, 231) !important;
      display: flex !important;
      justify-content: center !important;
      align-items: center !important; 
      height: 100% !important;   
    }
    .icon-container {
      display: flex !important;
      justify-content: center !important;
      align-items: center !important; 
      height: 100% !important;  
    }
    .icon-container2 {
      display: flex !important;
      justify-content: end !important; 
      align-items: end !important; 
      height: 100% !important; 
      
    }

    .icon_valid {
      color: rgb(180, 180, 180) !important; 
    }

    .icon_invalid {
      color: rgb(255, 55, 55) !important;
      background-color: rgba(255, 139, 139, 0.141) !important;
    }

    .data-table-container {
    height: calc(50vh - 150px); /* Ajuste o valor conforme necessário */
  }
</style>
