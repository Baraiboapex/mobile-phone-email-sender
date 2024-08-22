<template>
    <div class="w-100">
        <div v-if="canShowNavbar" class="row pt-4 pb-4 mb-4">
            <div class="col-12">
                <div class="d-flex flex-xl-row flex-lg-row flex-md-row flex-sm-column flex-column justify-content-between">
                    <div class="d-flex flex-xl-row flex-lg-row flex-md-row flex-sm-column flex-column">
                        <div v-for="(page, index) in visitedPages.pages">
                            <button :name="page.pageTemplateString" @click="goToPage" :disabled="visitedPages.buttonsDisabled" class="btn btn-danger app-btn-nav">
                                {{ page.pageName }}
                            </button>
                        </div>
                    </div>
                    <div class="d-flex flex-row">
                        <button @click="logout" class="btn btn-danger app-btn-nav" :disabled="visitedPages.buttonsDisabled">
                            <div class="d-flex flex-row">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-box-arrow-right" viewBox="0 0 16 16">
                                    <path fill-rule="evenodd" d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0z"/>
                                    <path fill-rule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708z"/>
                                </svg>
                                <span>&nbsp;&nbsp;</span>
                                <span>Logout</span>
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <div class="row">
            <slot></slot>
        </div>
    </div>

</template>
<script setup>
    import {reactive, watch, computed, onMounted, provide} from "vue";
    import {
        addSpaceBeforeCapitalLetters
    } from "../../helpers/UILegibilityHelpers/wordFormatHelpers";
    import _ from "lodash";
    import {
        CurrentPageStore,
        PageNames
    } from "./Router/Routes.js";
    import {
        AuthStore
    } from "../../store/auth.js";

    const useCurrentPageStore = CurrentPageStore();
    const useAuthStore = AuthStore();

    const visitedPages = reactive({
        pages:[],
        buttonsDisabled:false
    });

    const getVisitedPages = computed(()=>{
        return _.isEmpty(useCurrentPageStore.visitedPages) === false ? useCurrentPageStore.visitedPages : null;
    });

    const canShowNavbar = computed(()=>{
        console.log(useAuthStore.getIsLoggedIn, useAuthStore.getUserIsAuthroized);
        return useAuthStore.getIsLoggedIn && useAuthStore.getUserIsAuthroized ? true : false;
    });

    watch(
        getVisitedPages,
        (newValue, oldValue)=>{
            updatePagesList(newValue);
        }
    );

    const updatePagesList = (val) => {
        if(val !== null){
            const pages = Object.keys(val);
            visitedPages.pages = pages.map((page)=>{
                return {
                    pageName:addSpaceBeforeCapitalLetters(page),
                    pageTemplateString:page
                };
            });
        }
    };

    const goToPage = (e) => {
        const pageName = e.target.name;
        useCurrentPageStore.updatePage(pageName);
    }

    const logout = ()=>{
        useAuthStore.logout();
        useCurrentPageStore.updatePageWithoutNav(PageNames.LOGIN_PAGE_NAME);
        useCurrentPageStore.resetVisitedPagesList();
    };

    function enableDisableNavbarButtons({
        buttonsDisabled
    }){
        visitedPages.buttonsDisabled = buttonsDisabled;
    }

    provide("navbarControls",{
        enableDisableNavbarButtons
    });

</script>