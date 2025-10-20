<template>
  <Card class="metric-component">
    <template #title>Tempo Médio de Resposta</template>
    <template #content>
      <div class="grid response-time-container">
        <div v-for="(time, key) in times" :key="key" class="col-4 response-time-item">
          <div class="text-center p-3 surface-50 border-round">
            <p class="text-lg mb-2">{{ labels[key] || key }}</p>
            <p class="text-2xl font-bold text-primary">{{ formatTime(time) }}</p>
          </div>
        </div>
      </div>
    </template>
  </Card>
</template>

<script setup>

  const props = defineProps({
    times: {
      type: Object,
      required: true
    },
    labels: {
      type: Object,
      default: () => ({
        geral: 'Geral',
        leroy: 'Leroy',
        worten: 'Worten'
      })
    },
    formatTime: {
      type: Function,
      required: true
    }
  });
</script>

<style scoped>
.response-time-container {
  display: flex;
  gap: 1rem;
}

.response-time-item {
  flex: 1;
}
</style>
