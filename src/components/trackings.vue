<template>
    <toolbar />
    <div class="home">
        <h1 style="color: black;">Home</h1>
        <p style="color: black;">Bem-vindo à página inicial!</p>
    </div>
</template>

<script setup>
    import toolbar from '../components/toolbar.vue';
</script>

<style scoped>
.home {
    padding: 20px;
}
</style>
