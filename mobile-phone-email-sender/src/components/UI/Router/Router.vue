<script setup>
    import { storeToRefs } from 'pinia'
    import { onMounted } from 'vue';
    import {
        CurrentPageStore
    } from "./Routes.js"
    
    const store = CurrentPageStore();
    const { getCurrentPage } = storeToRefs(store);

    onMounted(()=>{
        if(!sessionStorage.getItem("currentRouter")){
            store.initializeRouteObjectInSessionStorage();
        }else{
            store.setRouterStateFromLocalStorage();
            changeCurrentRoute(store.getCurrentPage.__name);
        }
    });

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