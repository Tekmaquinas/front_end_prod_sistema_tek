<template>
    <Card class="mb-5">
        <template #content>
            <div class="flex flex-col gap-5">
                <div class="flex justify-between">
                    <div> 
                        <p>home</p>
                        <h2 style="line-height: 0;">QUALQUER COISA</h2>
                    </div>
                    <div>
                        <Button class="mt-5" label="Contrast" severity="contrast" variant="outlined" rounded />
                    </div>
                </div>
                <div class="flex gap-5">
                    <div class="shadow w-1/5 h-full rounded" style="border: solid 1px; height: 100px;">

                    </div>
                    <div class="shadow w-1/5 h-full rounded" style="border: solid 1px; height: 100px;">

                    </div>
                    <div class="shadow w-1/5 h-full rounded" style="border: solid 1px; height: 100px;">

                    </div>
                    <div class="shadow w-1/5 h-full rounded" style="border: solid 1px; height: 100px;">

                    </div>
                    <div class="shadow w-1/5 h-full rounded" style="border: solid 1px; height: 100px;">

                    </div>
                </div>
            </div>
        </template>
    </Card>

    <div class="flex w-full gap-5">
        <Card class="w-full h-screen">
            <template #content>
                <div class="flex flex-col gap-5">

                </div>
            </template>
        </Card>

        <Card class="w-6/12">
            <template #content>
                <div class="flex flex-col gap-5">

                </div>
            </template>
        </Card>

    </div>

</template>
    
<script setup>
import { Card } from 'primevue';


</script>

<style scoped>

</style>
