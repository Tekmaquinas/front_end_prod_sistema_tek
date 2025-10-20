<template>
    <div>
      <p v-if="isAuthenticated">Componente Protegido Carregado!</p>
      <p v-else>Você precisa estar autenticado para acessar este conteúdo.</p>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import axios from 'axios';
  
  const isAuthenticated = ref(false);
  
  // Função para verificar a autenticação
  const checkAuth = async () => {
    try {
      const response = await axios.get('/auth/check');  // Seu endpoint de verificação de autenticação
      isAuthenticated.value = response.data.authenticated;
    } catch (error) {
      console.error('Erro na verificação de autenticação:', error);
      isAuthenticated.value = false;
    }
  };
  
  onMounted(() => {
    checkAuth();
  });
  </script>
  