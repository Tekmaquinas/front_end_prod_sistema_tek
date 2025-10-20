<template>
    <Card class="dark:bg-surface-900  mb-2 h-1/6" style="border-radius: 20px; margin-right: 10px;">
        <template #header>
            <div class="flex items-center justify-between px-3 py-2">
                <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">Importações</div>
                <div>
                    <Button icon="pi pi-ellipsis-v" text rounded @click="$refs.menu2.toggle($event)" />
                    <Menu ref="menu2" :popup="true" :model="items" />
                </div>
            </div>

        </template>
        <template #content>
                <div class="bg-surface-0 dark:bg-surface-900 rounded-border px-6 max-w-[40rem] mx-auto" style="border-radius: 20px;">
                    <ul class="list-none py-1 m-0">
                        <li class="py-4 border-b border-surface flex md:items-start md:justify-between flex-col md:flex-row">
                            <div class="flex items-start mr-0 lg:mr-8 items-center">
                                <i class="pi pi-spin pi-spinner" style="font-size: 1rem; margin-right: 10px; color: orange;"></i>
                                <div>
                                    <span class="text-surface-900 dark:text-surface-0 font-medium block">Atualização de Estoque</span>
                                    <span class="block text-surface-500 dark:text-surface-300 font-medium ">Atualizando...</span>

                                </div>
                            </div>
                            
                        </li>
                        <li class="py-4 border-b border-surface flex md:items-start md:justify-between flex-col md:flex-row">
                            
                            <div class="flex items-start mr-0 lg:mr-8 items-center">
                                <i class="pi pi-spin pi-spinner" style="font-size: 1rem; margin-right: 10px; color: orange;"></i>
                                <div>
                                    <span class="text-surface-900 dark:text-surface-0 font-medium block">Coleta de preços da concorrência</span>
                                    <span class="block text-surface-500 dark:text-surface-300 font-medium ">2 horas atrás</span>
                                </div>
                            </div>
                            
                        </li>
                        <li class="py-4 border-b border-surface flex md:items-start md:justify-between flex-col md:flex-row">
                            
                            <div class="flex items-start mr-0 lg:mr-8 items-center">
                                <i class="pi pi-check-circle"  style="height: 65%; margin-right: 10px; color: green;" rounded ></i>
                                <div>
                                    <span class="text-surface-900 dark:text-surface-0 font-medium block">Coleta de dados VEVOR</span>
                                    <span class="block text-surface-500 dark:text-surface-300 font-medium ">14 minutos atrás</span>

                                </div>
                            </div>
                            
                        </li>
                        <li class="py-4 border-b border-surface flex md:items-start md:justify-between flex-col md:flex-row">
                            
                            <div class="flex items-start mr-0 lg:mr-8 items-center">
                                <i class="pi pi-check-circle"  style="height: 65%; margin-right: 10px; color: green;" rounded ></i>
                                <div>
                                    <span class="text-surface-900 dark:text-surface-0 font-medium block">Coleta de preços da concorrência</span>
                                    <span class="block text-surface-500 dark:text-surface-300 font-medium ">2 horas atrás</span>

                                </div>
                            </div>
                            
                        </li>
                        <li class="py-4 border-b border-surface flex md:items-start md:justify-between flex-col md:flex-row">
                            
                            <div class="flex items-start mr-0 lg:mr-8 items-center">
                                <i class="pi pi-times-circle"  style="height: 65%; margin-right: 10px; color: red;" rounded ></i>
                                <div>
                                    <span class="text-surface-900 dark:text-surface-0 font-medium block">Coleta de preços da concorrência</span>
                                    <span class="block text-surface-500 dark:text-surface-300 font-medium ">2 horas atrás</span>

                                </div>
                            </div>
                            
                        </li>

                    </ul>
                </div>

        </template>
    </Card>



</template>
      
<script setup>
    import { ref } from 'vue';
    
    const items = ref([
        { label: 'Add New', icon: 'pi pi-fw pi-plus' },
        { label: 'Remove', icon: 'pi pi-fw pi-minus' }
    ]);
</script>
    
<style scoped>
    .pi-box,.pi-shopping-bag, .pi-link ,.pi-tags{
    font-size: 1.6rem;
    color: rgba(74, 0, 171, 0.431);
    background-color: rgba(84, 11, 255, 0.119);
    padding: .8rem .8rem;
    margin: auto;
    border-radius: 5px;
    }

    /* .pi-link {
    color: rgba(255, 166, 0, 0.945);
    background-color: rgba(255, 166, 0, 0.213);
    } */

    .pi-box {
    color: rgba(199, 40, 0, 0.734);
    background-color: rgba(255, 128, 0, 0.126);
    }

    /* .pi-shopping-bag {
    color: rgba(144, 0, 255, 0.945);
    background-color: rgba(121, 18, 255, 0.246);
    }  */


    .title_card {
    word-break: normal;
    font-size: 0.9rem;
    margin: 0;
    color: rgb(134, 134, 134);
    
    }

    .count_orders {
    font-size: 1.5rem;
    margin: 0;
    font-weight: 500;
    line-height: 0.8;
    }

    .novos_registrados {
    font-size: 1.0rem;
    color: rgb(32, 215, 0);
    font-weight: 700;
    }

    .novos_registrados2 {
    font-size: 1.0rem;
    color: rgb(215, 0, 0);
    font-weight: 700;
    }

    .trackings_pendentes{
    font-size: 1.0rem;
    color: rgb(215, 115, 0);
    font-weight: 700;
    }

    .encomenda_registrados{
    color: rgb(0, 215, 0);
    font-weight: 700;
    font-size: 1.0rem;
    }

    ::v-deep(.p-card-body ) {
        padding: 0px !important;
    }

</style>
    