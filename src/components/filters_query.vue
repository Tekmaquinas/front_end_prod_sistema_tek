<template>
    <div class="flex flex-wrap items-center justify-between gap-3">
        
        <IconField>
            <InputIcon>
            <i class="pi pi-search" />
            </InputIcon>
            <InputText v-model="query_search" id="search" name="search" type="text" placeholder="Pesquisar" variant="filled" fluid size="small" style="width: 20dvw;"/>
        </IconField>
        <div class="flex flex-col">
            <Button severity="contrast" icon="pi pi-search" size="small" @click="construct_payload(query_search, initialValues)" />
        </div>

            <Button class="toggle-button"   @click="openFilterPanel"  size="small" label="+ Filtrar" text  />
            <Button  size="small" @click="clearFilters"  v-if="hasActiveFilters()" label="- Limpar Filtros" text />
    </div>
    <Drawer v-model:visible="isPanelOpen" header="Filtros Avançados " position="right" class="!w-full md:!w-80 lg:!w-[20rem]">
    
        <p style="font-weight: 500;">Período:</p>
        <DatePicker v-model="dates" selectionMode="range" :manualInput="false" class="!w-full md:!w-80 lg:!w-[30rem]" dateFormat="dd/mm/yy" style="padding: 5px 0px;" showIcon/>
        <div style="padding: 5px 0px;">
            <MultiSelect v-model="selectedCountry" :options="canais_vendas" optionLabel="name" placeholder="Canais de Vendas" class="!w-full" size="small" />
        </div>
        <div style="padding: 5px 0px;">
            <MultiSelect name="city" v-model="initialValues" :options="status_progress" :virtualScrollerOptions="{ itemSize: 30 }" optionLabel="name" filter placeholder="Status Pedido" :maxSelectedLabels="3" class="w-full md:w-50" size="small" />

        </div>


        <label>Preço:</label>
        <Slider v-model="controle_preco" range class="w-52" :min="0"  :max="10000" style="margin-top: 0.7rem;"/>
        <div class="flex w-full gap-3" style="margin-top: 1rem;">
            <InputNumber v-model="controle_preco[0]"  :minFractionDigits="2" :maxFractionDigits="5" mode="currency" currency="EUR" locale="de-DE" fluid/> 
            <p>_</p>
            <InputNumber v-model="controle_preco[1]"  :minFractionDigits="2" :maxFractionDigits="5" mode="currency" currency="EUR" locale="de-DE" fluid/> 
        </div>

        <label>Estoque:</label>
        <Slider v-model="controle_estoque" range class="w-52" :min="0"  :max="5000" style="margin-top: 0.7rem;"/>
        <div class="flex w-full gap-3" style="margin-top: 1rem;">
            <InputNumber v-model="controle_estoque[0]"  :min="0"  :max="5000" fluid /> 
            <p>_</p>
            <InputNumber v-model="controle_estoque[1]"  :min="0"  :max="5000" fluid /> 
        </div>


        <div class="flex items-center gap-3 !w-full" style="padding: 2px 0px; justify-content: space-around;margin-top: 1rem;">
            <p style="padding-right: 1.6rem; font-size:large;" >Atribuição: </p>
            <SelectButton v-model="AssigmentValue" :options="AssigmnetOptions" optionLabel="name"  class="!w-full"/>

        </div>
        <template #footer>
            <div class="flex items-center gap-2">
                <Button label="Cancelar" icon="pi pi-sign-out" class="flex-auto" severity="danger" text @click="togglePanel" ></Button>
                <Button label="Filtrar" icon="pi pi-search" class="flex-auto" severity="contrast" @click="applyFilters"
                :disabled="!hasActiveFilters()"></Button>
                
            </div>
        </template>
    </Drawer>
  </template>
  
<script setup>

import { ref, defineProps, defineEmits, onMounted, } from 'vue';
import { searching_func } from '../components/utils.mjs';

import { inject } from 'vue';

const emit = defineEmits([
  'updateData',
  'updatePagination', 
  'updateFilters',
  'searchError'
]);

const props = defineProps({
  route: {
  type: [String, Object],
  required: true,
  },
  marketplace: {
    type: String,
    required: false,
    default: null
  }
});


const query_search = ref('');
const initialValues = ref([]);
const dates = ref();



const isPanelOpen = ref(false);
const canais_vendas = ref([
  { name: 'Portugal', code:"PT" },
  { name: 'Espanha', code: "ES" },
  { name: 'Italia', code: "IT" },
  { name: "França", code:'FR' }
]);

const controle_preco = ref([0, 10000]);
const controle_estoque = ref([0, 5000]);
const selectedCountry = ref(null);
const status_progress = ref([
{ name: 'Pedido Novo', code: 1 },
{ name: 'Em preparo', code: 2 },
{ name: 'Encomenda Enviada', code: 3 },
{ name: 'Aguardando Tracking', code: 4 },
{ name: 'Concluido', code: 5 },
{ name: 'Sem Estoque', code: 6 },
{ name: 'Reembolsado', code: 7 },
{ name: 'Cancelado', code: 8 },
{ name: 'Tracking Fake', code: 9 },
{ name: 'Encomenda Fake', code: 10 }
]);
const openFilterPanel = () => {
  isPanelOpen.value = true;
};

    const AssigmentValue = ref(null);
    const AssigmnetOptions = ref([
        { name: 'Gestor', value: 2 },
        { name: 'Script', value: 1 }
    ]);

    // Lógica para fechar o painel de filtros
const closeFilterPanel = () => {
  isPanelOpen.value = false;
};

// Aplicar filtros
const applyFilters = () => {
  if (hasActiveFilters()) {
    applyFiltersToUrl();
    construct_payload(query_search.value, initialValues.value);
    closeFilterPanel();
  }
};

const applyFiltersToUrl = () => {
  // Inicia com os parâmetros atuais da URL
  const queryParams = new URLSearchParams(window.location.search);

  // Pesquisa
  if (query_search.value) {
    queryParams.set('search', query_search.value);
  } else {
    queryParams.delete('search');
  }

  // Datas
  if (dates.value?.length === 2) {
    queryParams.set('start_date', dates.value[0].toISOString().split('T')[0]);
    queryParams.set('end_date', dates.value[1].toISOString().split('T')[0]);
  } else {
    queryParams.delete('start_date');
    queryParams.delete('end_date');
  }

  // Países
  if (selectedCountry.value?.length) {
    queryParams.set('countries', selectedCountry.value.map(c => c.code).join(','));
  } else {
    queryParams.delete('countries');
  }

  // Status
  if (initialValues.value?.length) {
    queryParams.set('status', initialValues.value.map(s => s.code).join(','));
  } else {
    queryParams.delete('status');
  }

  // Controle de estoque
  if (controle_estoque.value[0] > 0 || controle_estoque.value[1] < 5000) {
    queryParams.set('min_stock', controle_estoque.value[0]);
    queryParams.set('max_stock', controle_estoque.value[1]);
  } else {
    queryParams.delete('min_stock');
    queryParams.delete('max_stock');
  }

  // Controle de preço
  if (controle_preco.value[0] > 0 || controle_preco.value[1] < 10000) {
    queryParams.set('min_price', controle_preco.value[0]);
    queryParams.set('max_price', controle_preco.value[1]);
  } else {
    queryParams.delete('min_price');
    queryParams.delete('max_price');
  }

  // Atribuição
  if (AssigmentValue.value) {
    queryParams.set('assignment', AssigmentValue.value.value);
  } else {
    queryParams.delete('assignment');
  }

  // Atualiza a URL sem recarregar a página
  window.history.pushState({}, '', `${window.location.pathname}?${queryParams}`);
};

// Função para ler parâmetros da URL
const readUrlParams = () => {
  const params = new URLSearchParams(window.location.search);

  // Pesquisa
  query_search.value = params.get('search') || '';

  // Datas
  if (params.get('start_date') && params.get('end_date')) {
    dates.value = [
      new Date(params.get('start_date')),
      new Date(params.get('end_date'))
    ];
  }

  // Países (canais_vendas)
  if (params.get('countries')) {
    const countryCodes = params.get('countries').split(',');
    selectedCountry.value = canais_vendas.value.filter(c => 
      countryCodes.includes(c.code)
    );
  }

  // Status (status_progress)
  if (params.get('status')) {
    const statusCodes = params.get('status').split(',').map(Number);
    initialValues.value = status_progress.value.filter(s => 
      statusCodes.includes(s.code)
    );
  }

  // Preço
  controle_preco.value = [
    Number(params.get('min_price')) || 0,
    Number(params.get('max_price')) || 10000
  ];

  // Estoque
  controle_estoque.value = [
    Number(params.get('min_stock')) || 0,
    Number(params.get('max_stock')) || 5000
  ];

  // Atribuição (AssigmnetOptions)
  if (params.get('assignment')) {
    const assignmentValue = Number(params.get('assignment'));
    AssigmentValue.value = AssigmnetOptions.value.find(
      o => o.value === assignmentValue
    ) || null;
  }
};
const clearFilters = () => {
    query_search.value = '';
    initialValues.value = [];
    dates.value = null;
    selectedCountry.value = null;
    controle_preco.value = [0, 10000];
    controle_estoque.value = [0, 5000];
    AssigmentValue.value = null;
  
    window.history.pushState({}, '', window.location.pathname);
    emit('updateData', false);
    // construct_payload();
};
onMounted(() => {
  window.addEventListener('popstate', () => {
    readUrlParams();
    construct_payload(query_search.value, initialValues.value);
  });
  readUrlParams();
  if (hasActiveFilters()) {
    construct_payload(query_search.value, initialValues.value);
  }
});
const togglePanel = () => {
  isPanelOpen.value = !isPanelOpen.value;
  clearFilters()
};


const hasActiveFilters = () => {
  return (
    query_search.value.trim() ||
    (dates.value?.length === 2) ||
    selectedCountry.value?.length > 0 ||
    initialValues.value?.length > 0 ||
    controle_estoque.value[0] > 0 ||
    controle_estoque.value[1] < 5000 ||
    controle_preco.value[0] > 0 ||
    controle_preco.value[1] < 10000 ||
    AssigmentValue.value !== null
  );
};

const construct_payload = async (query = '', filters = []) => {
  if (controle_preco.value[0] > controle_preco.value[1]) {
    emit('searchError', 'O valor mínimo não pode ser maior que o máximo');
    return;
  }

  if (controle_estoque.value[0] > controle_estoque.value[1]) {
    emit('searchError', 'O estoque mínimo não pode ser maior que o máximo');
    return;
  }

  const payload = {
    query: query.trim(),
    filters: {
      status: filters.map(f => Number(f.code)),
      paises: selectedCountry.value?.map(c => c.code) || [],
      periodo: dates.value?.length === 2 ? {
        inicio: formatDate(dates.value[0]),
        fim: formatDate(dates.value[1])
      } : undefined,
      preco: {
        minimo: Number(controle_preco.value[0]),
        maximo: Number(controle_preco.value[1])
      },
      estoque: {
        minimo: Number(controle_estoque.value[0]),
        maximo: Number(controle_estoque.value[1])
      },
      atribuicao: AssigmentValue.value?.value || undefined
    }
  };

  function formatDate(date) {
    return date.toISOString().split('T')[0];
  }

  emit('updateData', payload);
};


const handleFilterClick = () => {
  applyFiltersToUrl();
  construct_payload(query_search.value, initialValues.value); // Passa os valores atuais
  isPanelOpen.value = false;
};

</script>
  
  <style scoped>
  /* Estilização adicional, se necessário */
  </style>
  