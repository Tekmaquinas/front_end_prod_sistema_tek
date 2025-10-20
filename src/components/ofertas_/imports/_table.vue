<template>
    <Card>
        <template #content >
            <div class="bg-white dark:bg-surface-900 p-5 md:p-10 lg:p-20" style="border-radius: 20px;">

                <DataTable 
                        v-model:selection="selectedOrder" 
                        :value="loading ? LoadingRows : imports_data"
                        size="large"
                        >

                    <Column field="date" header="data"  style="width: 1rem;" />

                    <Column field="time" header="hora" style="width: 1rem;" />
                    <Column field="time_execution" header="Execução" style="width: 7rem;" />
                    <Column field="service" header="Serviço" style="max-width: 10px;" />
                    

                    <Column field="status" header="hora" style="max-width: 10px;" />
                    <Column field="data_updates" header="Atualizados" style="max-width: 10px;" />

                </DataTable>
            </div>

        </template>
    </Card>

</template>
    
<script setup>
    import { ref, onMounted, inject, watch } from 'vue';
    import { useRoute, useRouter } from 'vue-router';
    import { saveToCache, getFromCache } from '../../utils.mjs';

    
        
    const selectedOrder = ref(null);
    const loading   = ref(false);
    const LoadingRows = ref(new Array(20).fill({}));

    const base_url  = inject('base_url_ofertas')
    const endpoint  = useRoute()
    const router  = useRouter()
    const imports_data = ref([
        {
            id:1,
            date:"10/01/2025",
            time:"23:12",
            time_execution:"23 minutes",
            service:"Update DATA VEVOR",
            status:'concluido',
            data_updates: 4.234, 
        },
        {
            id:2,
            date:"10/01/2025",
            time:"23:12",
            time_execution:"23 minutes",
            service:"Update DATA VEVOR",
            status:'concluido',
            data_updates: 4.234, 
        },
        {
            id:3,
            date:"10/01/2025",
            time:"23:12",
            time_execution:"23 minutes",
            service:"Update DATA VEVOR",
            status:'concluido',
            data_updates: 4.234, 
        },
        {
            id:4,
            date:"10/01/2025",
            time:"23:12",
            time_execution:"23 minutes",
            service:"Update DATA VEVOR",
            status:'concluido',
            data_updates: 4.234, 
        },
        {
            id:5,
            date:"10/01/2025",
            time:"23:12",
            time_execution:"23 minutes",
            service:"Update DATA VEVOR",
            status:'concluido',
            data_updates: 4.234, 
        },
        

    ]);
    const meta_data = ref({})
    const expandedRows = ref({});




</script>

<style scoped>
    ::v-deep(.p-card-body ) {
        padding: 0px !important;
    }
</style>
