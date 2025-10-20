<template>
    <Card>
        <template #title>
            <h2>Configurações</h2> 

        </template>
        <template #content>
            <div class="flex gap-5">
                <div class=" flex w-full gap-5">
                    <div class="flex w-full">
                        <div class="flex-auto">
                            <label for="locale-german" class="font-bold block mb-2"> Marketplace </label>
                            <MultiSelect v-model="selectedShop" showClear :options="options_shops" optionLabel="name" placeholder="Selecione Marketplace" :maxSelectedLabels="4" class="w-full" />
                        </div>
                    </div>

                    <div class="flex w-full">
                        <div class="flex-auto">
                            <label for="locale-german" class="font-bold block mb-2"> Canal de vendas </label>
                            <MultiSelect v-model="selectedChannels" showClear :options="Channels" optionLabel="name" filter placeholder="Selecione os Canais" :maxSelectedLabels="4" class="w-full" />
                        </div>
                    </div>


                    <div class="flex w-full">
                        <div class="flex-auto">
                            <label for="locale-german" class="font-bold block mb-2"> Preço minimo </label>
                            <InputNumber class="w-full md:w-80" v-model="value3" inputId="locale-german" locale="de-DE" placeholder="Digite o preço minimo" :minFractionDigits="2" fluid size="small" />
                        </div>
                    </div>

                    <div class="flex w-full">
                        <div class="flex-auto">
                            <label for="locale-german" class="font-bold block mb-2"> Porcentagem Padrão</label>
                            <InputNumber class="w-full md:w-80" v-model="value3" placeholder="Select Channels" inputId="locale-german" locale="de-DE" :minFractionDigits="2" fluid size="small" />
                        </div>
                    </div>


                    <div class="flex w-full">
                        <div class="flex-auto">
                            <label for="locale-german" class="font-bold block mb-2"> Porcentagem Relativa</label>
                            <InputNumber class="w-full md:w-80" v-model="value3" placeholder="Select Channels" inputId="locale-german" locale="de-DE" :minFractionDigits="2" fluid size="small" />
                        </div>
                    </div>
                </div>

            </div>
            <div class="flex gap-2 w-full" style="justify-content: end;">
                    <Button class="mt-2 " style="border-radius: .75rem;" label="Salvar" severity="contrast" variant="outlined" size="small" />
                    <Button class="mt-2 " style="border-radius: .75rem;" label="Salvar e Importar" severity="contrast" size="small" />
            </div>

        </template>
    </Card>
</template>
    
<script setup>

    import { ref, onMounted, inject, watch } from 'vue';
    import { useRoute, useRouter } from 'vue-router';
    import { saveToCache, getFromCache } from '../../utils.mjs';

    const selectedChannels = ref();
    const Channels = ref([
        { name: 'New York', code: 'NY' },
        { name: 'Rome', code: 'RM' },
        { name: 'London', code: 'LDN' },
        { name: 'Istanbul', code: 'IST' },
        { name: 'Paris', code: 'PRS' }
    ]);

    const selectedShop = ref();
    const options_shops = ref([
        { name: 'Leroy Merlin', code: 'leroy' },
        { name: 'Worten PT', code: 'worten' }
    ]);


    const configuration = ref({
        leroy : { 
                channels: [], min_stock: 5, min_price: 200,
                percent: { default: 200, relative: 200, reference: 0 },
                },
        worten : { 
                channels: [], min_stock: 5, min_price: '200,00 €',
                percent: { default: 200, relative: 200, reference: 0 },
                },
    });
    const pizza = ref();

</script>

<style scoped>

</style>
