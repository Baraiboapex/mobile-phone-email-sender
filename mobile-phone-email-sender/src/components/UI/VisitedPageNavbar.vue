<template>
    <div class="row pt-4 pb-4 mb-4">
        <div class="col-12">
            <div class="d-flex flex-row">
                <div v-for="(page, index) in visitedPages.pages">
                    <button :name="page.pageTemplateString" @click="goToPage" class="btn btn-danger app-btn-nav">
                        {{ page.pageName }}
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
    import {reactive, watch, computed} from "vue";
    import {
        addSpaceBeforeCapitalLetters
    } from "../../helpers/UILegibilityHelpers/wordFormatHelpers";
    import _ from "lodash";
    import {
        CurrentPageStore,
        Routes
    } from "./Router/Routes.js";
    const useCurrentPageStore = CurrentPageStore();

    const visitedPages = reactive({
        pages:[]
    });

    const hasVisitedPages = computed(()=>visitedPages.pages.length > 0);
    const getVisitedPages = computed(()=>{
        return _.isEmpty(useCurrentPageStore.visitedPages) === false ? useCurrentPageStore.visitedPages : null;
    });

    watch(
        getVisitedPages,
        (newValue, oldValue)=>{
            updatePagesList(newValue);
        }
    );

    const updatePagesList = (val) => {
        const pages = Object.keys(val);
        visitedPages.pages = pages.map((page)=>{
            return {
                pageName:addSpaceBeforeCapitalLetters(page),
                pageTemplateString:page
            };
        });
    };

    const goToPage = (e) => {
        const pageName = e.target.name;
        useCurrentPageStore.updatePage(pageName);
    }

</script>