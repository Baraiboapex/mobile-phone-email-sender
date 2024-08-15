<template>
    <div class="row">
        <div class="col-12">

        </div>
    </div>
</template>
<script setup>
    import {reactive, watch, computed} from "vue";
    import _ from "lodash";
    import {
        CurrentPageStore,
        Routes
    } from "./Routes.js";
    const useCurrentPageStore = CurrentPageStore();

    const visitedPages = reactive([]);

    const getVisitedPages = computed(()=>{
        _.isEmpty(useCurrentPageStore.visitedPages) === false ? useCurrentPageStore.visitedPages : null;
    });

    watch(
        getVisitedPages,
        (newValue, oldValue)=>{
            updatePagesList(newValue);
        }
    );

    const updatePagesList = (val) => {
        visitedPages = val;
    };

    const goToPage = (page) => {
        useCurrentPageStore.updatePage(page);
    }

</script>