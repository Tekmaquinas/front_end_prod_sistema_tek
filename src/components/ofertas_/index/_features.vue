<template>
    <Card class="dark:bg-surface-900 mb-2  h-1/6" style="border-radius: 20px; margin-right: 10px;">
        <template #content>
            <div class="px-3 py-4 ">
                <div class="w-full flex" >
                    <i class="pi pi-box h-full" style=" border-radius: 10px; width: 3.1rem;"></i>
                    <div style="background-color: white; border-radius: 10px; width: 100%;">
                        
                        <div class="flex justify-between items-center" style="width: 100%;">
                            <div class="ml-3">
                                <p class="font-semibold">Aviso de Estoque</p>
                                <span>254 esta com estoque baixo</span>
                            </div>

                            <div>
                                <Tag icon="pi pi-chevron-right" severity="secondary"></Tag>
                            </div>
                            
                            
                        </div>
                        
                    </div>
                </div>
                <Divider />
                
                <div class="w-full flex" >
                    <i class="pi pi-tags h-full" style=" border-radius: 10px; width: 3.1rem;"></i>
                    <div style="background-color: white; border-radius: 10px; width: 100%;">
                        
                        <div class="flex justify-between items-center" style="width: 100%;">
                            <div class="ml-3">
                                <p class="font-semibold">Preços alterados</p>
                                <span>32 itens teve os preços alterados</span>
                            </div>

                            <div >
                                <Tag icon="pi pi-chevron-right" severity="secondary"></Tag>
                            </div>
                            
                            
                        </div>
                        
                    </div>
                </div>

                <Divider />

                <div class="w-full flex" >
                    <i class="pi pi-megaphone h-full" style=" border-radius: 10px; width: 3.1rem;"></i>
                    <div style="background-color: white; border-radius: 10px; width: 100%;">
                        
                        <div class="flex justify-between items-center" style="width: 100%;">
                            <div class="ml-3">
                                <p class="font-semibold">Novas ofertas disponiveis</p>
                                <span>Vevor anunciou 5 itens novos</span>
                            </div>

                            <div>
                                <Tag icon="pi pi-chevron-right" severity="secondary"></Tag>
                            </div>
                            
                            
                        </div>
                        
                    </div>
                </div>
            </div>

        </template>
    </Card>



</template>
      
<script setup>


</script>
    
<style scoped>
    .pi-box,.pi-shopping-bag, .pi-link ,.pi-tags ,.pi-megaphone {
    font-size: 1.6rem;
    color: rgba(74, 0, 171, 0.702);
    background-color: rgba(141, 92, 255, 0.085);
    padding: .8rem .7rem;
    margin: auto;
    border-radius: 5px;
    }

    /* .pi-link {
    color: rgba(255, 166, 0, 0.945);
    background-color: rgba(255, 166, 0, 0.213);
    } */

    .pi-box {
    color: rgba(175, 35, 1, 0.701);
    background-color: rgba(255, 143, 31, 0.126)
    }

    .pi-box {
    color: rgba(175, 35, 1, 0.701);
    background-color: rgba(255, 143, 31, 0.126)
    }
    .pi-megaphone {
        color: rgba(0, 171, 83, 0.518);
        background-color: rgba(0, 187, 78, 0.085);
    }
    /* .pi-shopping-bag {

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
    