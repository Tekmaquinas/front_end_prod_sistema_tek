<template>
  <div class="search-filter">
    <div class="search-input-wrapper">
      <span class="p-input-icon-left">
        <i class="pi pi-search" />
        <InputText 
          v-model="searchQuery" 
          placeholder="Buscar..." 
          @keyup.enter="search"
        />
      </span>
      
      <Button 
        icon="pi pi-search" 
        label="Buscar" 
        @click="search"
        :loading="loading"
      />
      
      <Button 
        v-if="showClearButton"
        icon="pi pi-times" 
        label="Limpar" 
        class="p-button-outlined" 
        @click="clear"
      />
    </div>
    
    <div class="filter-options">
      <slot name="filters"></slot>
      
      <div v-if="showDeepSearchOption" class="deep-search-option">
        <Checkbox 
          v-model="isDeepSearch" 
          binary 
          inputId="deep-search"
        />
        <label for="deep-search">Busca detalhada</label>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';

const props = defineProps({
  loading: {
    type: Boolean,
    default: false
  },
  modelValue: {
    type: String,
    default: ''
  },
  deepSearch: {
    type: Boolean,
    default: false
  },
  showDeepSearchOption: {
    type: Boolean,
    default: true
  }
});

const emit = defineEmits(['search', 'clear', 'update:modelValue', 'update:deepSearch']);

const searchQuery = ref(props.modelValue);
const isDeepSearch = ref(props.deepSearch);

watch(() => props.modelValue, (newValue) => {
  searchQuery.value = newValue;
});

watch(() => props.deepSearch, (newValue) => {
  isDeepSearch.value = newValue;
});

watch(searchQuery, (newValue) => {
  emit('update:modelValue', newValue);
});

watch(isDeepSearch, (newValue) => {
  emit('update:deepSearch', newValue);
});

const showClearButton = computed(() => searchQuery.value.trim() !== '');

const search = () => {
  if (searchQuery.value.trim()) {
    emit('search', { 
      query: searchQuery.value, 
      isDeepSearch: isDeepSearch.value 
    });
  }
};

const clear = () => {
  searchQuery.value = '';
  isDeepSearch.value = false;
  emit('clear');
};
</script>

<style scoped>
.search-filter {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.search-input-wrapper {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.p-input-icon-left {
  flex: 1;
}

.filter-options {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: center;
}

.deep-search-option {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
</style>
