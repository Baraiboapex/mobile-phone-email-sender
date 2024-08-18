<script setup>
    import { storeToRefs } from 'pinia'
    import {
        CurrentPageStore
    } from "./Routes.js"
    
    const store = CurrentPageStore();
    const { getCurrentPage } = storeToRefs(store);

    function changeCurrentRoute(route){
        store.updatePage(route);
    }
</script>
<template>
    <div class="d-flex">
        <component
            @change-current-route="changeCurrentRoute" 
            :is="getCurrentPage"
        ></component>
    </div>
</template>