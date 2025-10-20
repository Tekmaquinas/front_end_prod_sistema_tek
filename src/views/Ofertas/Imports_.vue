<template>
    <toolbar />
    <div style="height: 90%; border: none !important; padding: 0px; font-size:smaller;">
        <div class="flex flex-1 gap-4">
            <div class="w-1/5" style="margin-left: 10px; min-width: 220px;">
                <Navigation />
            </div>
             <div style="min-width: 700px; max-width: 90%; width: 77%; margin-right: 10px;">

                    <Breadcrumb :home="home" :model="items" style="background-color: transparent; padding: 0px; padding: 5px 0px 15px;">
                        <template #item="{ item, props }">
                            <router-link v-if="item.route" v-slot="{ href, navigate }" :to="item.route" custom>
                                <a :href="href" v-bind="props.action" @click="navigate">
                                    <span :class="[item.icon, 'text-color']" />
                                    <span v-if="item?.last" class="text-primary font-semibold">{{ item.label }}</span>
                                    <span v-else class="text-surface-500 dark:text-surface-0">{{ item.label }}</span>
                                </a>
                            </router-link>
                            <a v-else :href="item.url" :target="item.target" v-bind="props.action">
                                <span class="text-surface-500 dark:text-surface-0">{{ item.label }}</span>
                            </a>
                        </template>
                        <template #separator>/</template>
                        
                    </Breadcrumb>


                <Form_  class="mb-3"/>
                <Table_ />
            </div>

        </div>
    </div>
    
</template>

<script setup>
    import { ref } from "vue";
    import toolbar from '../../components/toolbar.vue';
    import Navigation from '../../components/ofertas_/_navigation.vue'
    import Form_ from '../../components/ofertas_/imports/_form.vue'
    import Table_ from '../../components/ofertas_/imports/_table.vue'  

    

    const home = ref({
    icon: 'pi pi-home',
    route: '/'
    });
    const items = ref([
        { label: 'Ofertas', route: '/offers/leroy'},
        { label: 'Importações', route: '/offers/imports',  last:true}
    ]);

</script>
    
    
<style scoped>

</style>
