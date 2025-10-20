<template>
    <toolbar />
    <div style="height: 90%; border: none !important; padding: 0px; font-size:smaller;">
        <div class="flex flex-1 gap-4">
            <div class="w-1/6 " style="margin-left: 10px; min-width: 220px;">
                <Navigation />
            </div>
            <h1>ADJUST</h1>
            <!-- <div class="w-7/12" style="min-width: 700px;">
                <TableOffers />
            </div>
            <div class="w-3/12" style="min-width: 300px;">

                <ul class="list-none p-0 m-0">

                    <Historico />

                    <Card_Ranking style="margin-top: 15px;"/>
                </ul>

            </div> -->

        </div>
    </div>
    
</template>

<script setup>
    import toolbar from '../../components/toolbar.vue';
    import Navigation from '../../components/ofertas_/_navigation.vue'
    import Historico from  '../../components/ofertas_/index/_features.vue'
    import Card_Ranking from  '../../components/ofertas_/index/_card_imports.vue'
    import TableOffers from '../../components/ofertas_/index/_table.vue'
    


</script>
    
    
<style scoped>

</style>
