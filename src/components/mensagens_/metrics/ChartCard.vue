<template>
  <Card class="chart-card">
    <template #title>{{ title }}</template>
    <template #content>
      <Chart :type="type" :data="data" :options="options" class="h-20rem" />
    </template>
  </Card>
</template>

<script setup>
import Chart from 'primevue/chart';
import Card from 'primevue/card';

defineProps({
  title: {
    type: String,
    required: true
  },
  type: {
    type: String,
    default: 'bar'
  },
  data: {
    type: Object,
    required: true
  },
  options: {
    type: Object,
    default: () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom'
        }
      }
    })
  }
});
</script>

<style scoped>
.chart-card {
  flex: 1;
  min-width: 0;
}
</style>
