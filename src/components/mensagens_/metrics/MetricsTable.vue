<template>
  <Card class="metric-component">
    <template #title>{{ title }}</template>
    <template #content>
      <div class="overflow-x-auto">
        <table class="metrics-table w-full">
          <thead>
            <tr>
              <th v-for="column in columns" :key="column">{{ column }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in rows" :key="row.id">
              <td v-for="(value, index) in row.values" :key="index" :class="{ 'font-bold': index === row.values.length - 1 }">
                {{ value }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>
  </Card>
</template>

<script setup>
import Card from 'primevue/card';

defineProps({
  title: {
    type: String,
    default: 'Métricas Detalhadas'
  },
  columns: {
    type: Array,
    required: true
  },
  rows: {
    type: Array,
    required: true
  }
});
</script>

<style scoped>
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
</style>
