<template>
  <div class="metric-card">
    <div class="flex align-items-center">
      <div class="metric-icon-container" :class="iconBackground">
        <i :class="icon" :style="{ fontSize: '1.5rem' }"></i>
      </div>
      <div class="metric-data">
        <span class="block text-500">{{ title }}</span>
        <span class="text-3xl font-bold" :class="valueClass">{{ value }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  value: {
    type: [String, Number],
    required: true
  },
  icon: {
    type: String,
    default: 'pi pi-chart-bar'
  },
  color: {
    type: String,
    default: ''
  },
  iconBackground: {
    type: String,
    default: 'bg-blue-100'
  }
});

const valueClass = computed(() => {
  return props.color ? `text-${props.color}-500` : '';
});
</script>

<style scoped>
.metric-card {
  flex: 1;
  min-width: 200px;
  padding: 1rem;
  margin: 0.25rem;
  background-color: var(--surface-50);
  border-radius: 8px;
}

.metric-icon-container {
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1rem;
}

.metric-data {
  display: flex;
  flex-direction: column;
}
</style>
