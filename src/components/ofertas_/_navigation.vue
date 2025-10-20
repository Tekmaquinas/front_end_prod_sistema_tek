<template>
    <Card class=" h-full" >
        <template #header>
            <div class="flex justify-between" style="padding: 16px 20px 10px;">
                <h3 style="margin: auto 0px;">Ofertas</h3>
                <Button icon="pi pi-plus" severity="contrast" size="small"/>
            </div>
        </template>
        <template #content>
            <Menu  :model="items" class="w-full h-full" style="border-radius: 20px; border: none; min-width: none;" >
                <template #submenulabel="{ item }" style="margin: 20px !important;">
                    <span :class="[item.icon, 'text-primary group-hover:text-inherit']" />
                    <span class="px-2 text-primary font-bold">{{ item.label }}</span>
                </template>


                <template #item="{ item, props }" style="margin: 20px 0px !important;">
                    <router-link v-if="item.route" v-slot="{ href, navigate, isActive }"  :to="item.route" custom>
                        <a v-ripple :href="href" v-bind="props.action" @click="navigate"  :class="{ 'bg-emphasis rounded-border': isActive }">
                        <span :class="[item.icon, 'text-primary group-hover:text-inherit']" />
                        <span :class="['ml-3', { 'font-semibold': item.items }]">
                            {{ item.label }}
                            
                        </span>
                            <Badge v-if="item.key == 'offers_leroy'" class="ml-auto " :value="meta_data?.records?.leroy?.all || null"  severity="secondary" size="small" outlined />
                            <Badge v-if="item.key == 'offers_worten'" class="ml-auto " :value="meta_data?.records?.worten?.all || null"  severity="secondary" size="small" outlined />
                        
                        </a>
                    </router-link>
                    
                </template>
                <template #end>

                </template>
            </Menu>
        </template>
    </Card>

</template>

<script setup>
    import { ref,  inject, onMounted } from 'vue';
    import { saveToCache, getFromCache } from '../utils.mjs';

    onMounted(() => {GetTotalRecords()});

    const base_url  = inject('base_url_ofertas')
    const meta_data = ref({})
 
    const GetTotalRecords = async () => {
        const cachedData = getFromCache(`navigation_records`, 60000);
        if (cachedData) {
          meta_data.value = cachedData;
          return;
        }
        const response = await fetch(`${base_url}/v1/ofertas/metrics?datamode=records&shop=all`, {
            method: 'GET',
            credentials: 'include',
            headers: {
            'Content-Type': 'application/json',
            },});

        if (!response.ok) {
            throw new Error('Failed to fetch members');
            }

        const data = await response.json();
        meta_data.value = data;
        
        saveToCache(`navigation_records`, data);

        return;
    };


    const items = ref([
        {
        separator: true
        },
        {
        key: 'offers', label: 'ANUNCIOS', icon: 'pi pi-shopping-bag' ,
        items: [
            {key: 'offers_leroy', label: "Leroy Merlin", route: '/offers/leroy/'},
            {key: 'offers_worten', label: "Worten PT", route: '/offers/worten/'},
            {key: 'offers_warehouse', label: "Armazem", route: '/offers/warehouse/'},
            {key: 'offers_marketplace', label: "Importações",route: '/offers/imports'},
            {key: 'offers_marketplaces', label: "Correções", route: '/offers/adjust',}
        ]
        },
        {
        separator: true
        },

        {
        key: 'metrics', label: 'METRICAS', icon: 'pi pi-chart-line', badge: 5,
        items: [

                    // {
                    // key: 'metrics_worten', label: "Ranking",
                    // route: '/offers/metrics/',
                    // },
                    {
                    key: 'actives_worten', label: "Relatórios", severity: 'secondary',
                    route: '/offers/report',
                    },

                    {
                    key: 'inactive_worten', label: "Analise de Preços",  severity: 'secondary',
                    route: '/offers/analysis',
                    },
                ]

        },
        {
        separator: true
        },
        {
        key: 'metrics', label: 'COLETA DE DADOS', icon: 'pi pi-chart-line', badge: 5,
        items: [

                    
                    {
                    key: 'actives_worten', label: "Preços", severity: 'secondary',
                    route: '/offers/metrics/active',
                    },
                    {
                    key: 'metrics_worten', label: "Estoque",
                    route: '/offers/metrics/',
                    },
                ]

        },

    ]);
    
    
</script>

<style scoped>
    


</style>
