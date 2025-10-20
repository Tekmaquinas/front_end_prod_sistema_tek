<template>
    <toolbar />
      <div class="profile">
        <h1 style="color: black;">profile</h1>
        <p style="color: black;">Bem-vindo à página inicial!</p>
      </div>
    </template>
    
    <script setup>
      import toolbar from '../components/toolbar.vue';
    </script>
    
    <style scoped>
    .profile {
      padding: 20px;
    }
    </style>
    