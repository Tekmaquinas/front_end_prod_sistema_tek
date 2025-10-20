<template>
  <toolbar />
  <div class="metricas-container">
    <!-- Filtros -->
    <Card class="metric-component">
      <template #title>Filtros de Pesquisa</template>
      <template #content>
        <form @submit.prevent="fetchStatistics" class="filtros-form">
          <div class="p-fluid p-formgrid grid">
            <!-- Data Início -->
            <div class="field col-12 md:col-4">
              <label for="data-inicio" class="font-bold">Data Início</label>
              <Calendar 
                id="data-inicio"
                v-model="startDate" 
                dateFormat="dd/mm/yy" 
                showIcon 
                placeholder="Selecione a data inicial"
                inputStyle="width:100%" 
                class="filter-calendar"
              />
            </div>
            
            <!-- Data Fim -->
            <div class="field col-12 md:col-4">
              <label for="data-fim" class="font-bold">Data Fim</label>
              <Calendar 
                id="data-fim"
                v-model="endDate" 
                dateFormat="dd/mm/yy" 
                showIcon 
                placeholder="Selecione a data final"
                inputStyle="width:100%" 
                class="filter-calendar"
              />
            </div>
            
            <!-- Marketplace -->
            <div class="field col-12 md:col-4">
              <label for="marketplace" class="font-bold">Marketplace</label>
              <Dropdown 
                id="marketplace"
                v-model="selectedMarketplace" 
                :options="marketplaceOptions" 
                optionLabel="label"
                optionValue="value" 
                placeholder="Selecione um marketplace" 
                class="w-full"
              />
            </div>
          </div>
          
          <!-- Botões -->
          <div class="flex justify-content-end gap-2 mt-3">
            <Button 
              type="button"
              label="Limpar" 
              icon="pi pi-times" 
              class="p-button-outlined" 
              @click="resetFilters"
            />
            <Button 
              type="submit"
              label="Aplicar Filtros" 
              icon="pi pi-search" 
              :loading="isLoading"
            />
          </div>
        </form>
      </template>
    </Card>

    <!-- Estados de carregamento e erro usando componente StateDisplay -->
    <StateDisplay 
      v-if="isLoading" 
      type="loading" 
      message="Carregando estatísticas..."
    />
    
    <StateDisplay 
      v-else-if="error" 
      type="error" 
      :message="error"
      @retry="fetchStatistics"
    />

    <!-- Dados estatísticos -->
    <div v-else-if="statistics" class="stats-content">
      <!-- Cabeçalho com Período -->
      <Card class="metric-component">
        <template #title>
          <div class="flex justify-content-between align-items-center">
            <h2>Estatísticas do Período: {{ formatDate(statistics.periodo.inicio) }} a {{ formatDate(statistics.periodo.fim) }} ({{ statistics.periodo.dias }} dias)</h2>
          </div>
        </template>
        <template #content>
          <!-- Cards de métricas usando o componente MetricCard -->
          <div class="flex flex-wrap">
            <MetricCard 
              title="Total de Chats"
              :value="statistics.total.total_chats"
              icon="pi pi-comments"
              iconBackground="bg-blue-100"
            />
            
            <MetricCard 
              title="Pendentes"
              :value="statistics.total.pendentes"
              icon="pi pi-clock"
              iconBackground="bg-yellow-100"
              color="yellow"
            />
            
            <MetricCard 
              title="Finalizados"
              :value="statistics.total.finalizados"
              icon="pi pi-check-circle"
              iconBackground="bg-green-100"
              color="green"
            />
            
            <MetricCard 
              title="Salvos"
              :value="statistics.total.salvos"
              icon="pi pi-bookmark"
              iconBackground="bg-purple-100"
              color="purple"
            />
          </div>
        </template>
      </Card>

      <!-- Layout principal -->
      <div class="stats-grid">
        <!-- Tempo médio de resposta -->
        <Card class="metric-component">
          <template #title>Tempo Médio de Resposta</template>
          <template #content>
            <div class="grid response-time-container">
              <div class="col-4 response-time-item">
                <div class="text-center p-3 surface-50 border-round">
                  <p class="text-lg mb-2">Geral</p>
                  <p class="text-2xl font-bold text-primary">{{ formatTime(statistics.tempo_medio_resposta.geral) }}</p>
                </div>
              </div>
              <div class="col-4 response-time-item">
                <div class="text-center p-3 surface-50 border-round">
                  <p class="text-lg mb-2">Leroy</p>
                  <p class="text-2xl font-bold text-primary">{{ formatTime(statistics.tempo_medio_resposta.leroy) }}</p>
                </div>
              </div>
              <div class="col-4 response-time-item">
                <div class="text-center p-3 surface-50 border-round">
                  <p class="text-lg mb-2">Worten</p>
                  <p class="text-2xl font-bold text-primary">{{ formatTime(statistics.tempo_medio_resposta.worten) }}</p>
                </div>
              </div>
            </div>
          </template>
        </Card>
        
        <!-- Tabela de estatísticas detalhadas -->
        <Card class="metric-component">
          <template #title>Métricas Detalhadas por Marketplace</template>
          <template #content>
            <div class="overflow-x-auto">
              <table class="metrics-table w-full">
                <thead>
                  <tr>
                    <th>Métricas</th>
                    <th>Leroy</th>
                    <th>Worten</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Total de Chats</td>
                    <td>{{ statistics.leroy.total }}</td>
                    <td>{{ statistics.worten.total }}</td>
                    <td class="font-bold">{{ statistics.total.total_chats }}</td>
                  </tr>
                  <tr>
                    <td>Pendentes</td>
                    <td>{{ statistics.leroy.pendentes }}</td>
                    <td>{{ statistics.worten.pendentes }}</td>
                    <td class="font-bold">{{ statistics.total.pendentes }}</td>
                  </tr>
                  <tr>
                    <td>Urgentes</td>
                    <td>{{ statistics.leroy.urgentes }}</td>
                    <td>{{ statistics.worten.urgentes }}</td>
                    <td class="font-bold">{{ statistics.total.urgentes }}</td>
                  </tr>
                  <tr>
                    <td>Atenção</td>
                    <td>{{ statistics.leroy.atencao }}</td>
                    <td>{{ statistics.worten.atencao }}</td>
                    <td class="font-bold">{{ statistics.total.atencao }}</td>
                  </tr>
                  <tr>
                    <td>Finalizados</td>
                    <td>{{ statistics.leroy.finalizados }}</td>
                    <td>{{ statistics.worten.finalizados }}</td>
                    <td class="font-bold">{{ statistics.total.finalizados }}</td>
                  </tr>
                  <tr>
                    <td>Salvos</td>
                    <td>{{ statistics.chats_salvos.leroy.total }}</td>
                    <td>{{ statistics.chats_salvos.worten.total }}</td>
                    <td class="font-bold">{{ statistics.total.salvos }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </template>
        </Card>
        
        <!-- Gráficos usando o componente ChartCard -->
        <div class="chart-container">
          <ChartCard 
            title="Chats por Status"
            type="bar"
            :data="statusChartData"
            :options="statusChartOptions"
          />
          
          <ChartCard 
            title="Chats por Marketplace"
            type="bar"
            :data="marketplaceChartData"
            :options="chartOptions"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { formatDate } from './utils/helpers';
import toolbar from '../toolbar.vue';
import { useStatistics } from './composables/useStatistics';
import StateDisplay from './ui/StateDisplay.vue';
import MetricCard from './metrics/MetricCard.vue';
import ChartCard from './metrics/ChartCard.vue';

// Importações para componentes da PrimeVue
import Dropdown from 'primevue/dropdown';
import Calendar from 'primevue/calendar';
import Button from 'primevue/button';
import Card from 'primevue/card';

// Utilizando o composable de estatísticas para gerenciar a lógica
const {
  isLoading,
  error,
  statistics,
  startDate,
  endDate,
  selectedMarketplace,
  statusChartData,
  statusChartOptions,
  marketplaceChartData,
  chartOptions,
  formatTime,
  setupDefaultDateRange,
  resetFilters,
  fetchStatistics
} = useStatistics();

// Opções de marketplace
const marketplaceOptions = [
  { label: 'Todos', value: null },
  { label: 'Leroy', value: 'leroy' },
  { label: 'Worten', value: 'worten' }
];

// Inicialização
onMounted(() => {
  setupDefaultDateRange();
  fetchStatistics();
});
</script>

<style scoped>
.metricas-container {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* Estilo unificado para componentes */
.metric-component {
  padding: 1rem;
  border-radius: 6px;
}

/* Grid de estatísticas */
.stats-grid {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* Container para gráficos */
.chart-container {
  display: flex;
  gap: 20px;
}

/* Responsividade para gráficos */
@media (max-width: 991px) {
  .chart-container {
    flex-direction: column;
  }
}

/* Estilos para tempo de resposta */
.response-time-container {
  display: flex;
  gap: 1rem;
}

.response-time-item {
  flex: 1;
}

/* Estilos para tabela */
.metrics-table {
  border-collapse: collapse;
  width: 100%;
}

.metrics-table th, .metrics-table td {
  border: 1px solid var(--surface-200);
  padding: 0.75rem;
  text-align: center;
}

.metrics-table th {
  background-color: var(--surface-100);
  font-weight: 600;
}

.metrics-table tbody tr:nth-child(even) {
  background-color: var(--surface-50);
}

/* Estilos para formulários */
.filtros-form {
  padding: 0.5rem;
}

.filtros-form .field {
  margin-bottom: 1.5rem;
}

.filtros-form label {
  display: block;
  margin-bottom: 0.5rem;
}

/* Fix para componentes PrimeVue */
:deep(.p-dropdown), 
:deep(.p-calendar),
:deep(.p-calendar input), 
:deep(.p-inputtext) {
  width: 100% !important;
  display: block !important;
}

:deep(.p-calendar .p-button) {
  visibility: visible !important;
  display: flex !important;
}

:deep(.p-dropdown-panel), 
:deep(.p-datepicker) {
  z-index: 9999 !important;
  min-width: 250px !important;
  visibility: visible !important;
}

/* Ajustes para os cards */
:deep(.p-card-content) {
  padding: 1rem;
}

:deep(.p-card-title) {
  padding: 1rem 1rem 0 1rem;
  margin-bottom: 0;
}
</style>
