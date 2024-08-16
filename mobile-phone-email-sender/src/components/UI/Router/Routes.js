import AnnouncementTemplate from "../../Pages/Templates/AnnouncementTemplate.vue";
import ClassRestartingTemplate from "../../Pages/Templates/ClassRestartingTemplate.vue";
import CustomTemplate from "../../Pages/Templates/CustomTemplate.vue";
import NoClassTemplate from "../../Pages/Templates/NoClassTemplate.vue";
import SelectTemplate from "../../Pages/SelectTemplate.vue";
import SendTypeTemplate from "../../Pages/SendTypeTemplate.vue";

import { defineStore } from "pinia";

export const PageNames = {
    ANNOUNCEMENT_TEMPLATE_NAME:"AnnouncementTemplate",
    CLASS_RESTARTING_TEMPLATE_NAME:"ClassRestartingTemplate",
    CUSTOM_TEMPLATE:"CustomTemplate",
    NO_CLASS_TEMPLATE_NAME:"NoClassTemplate",
    SEND_TYPE_TEMPLATE_NAME:"SendTypeTemplate",
    SELECT_TEMPLATE_NAME:"SelectTemplate"
};

export const Routes = {
    AnnouncementTemplate,
    ClassRestartingTemplate,
    CustomTemplate,
    NoClassTemplate,
    SelectTemplate,
    SendTypeTemplate
};

export const CurrentPageStore = defineStore("CurrentPage", {
    state:()=>{
        return {
            currentPage:Routes[PageNames.SEND_TYPE_TEMPLATE_NAME],
            visitedPages:{}
        }
    },
    actions:{
        updatePage(pageName){
            this.currentPage = Routes[pageName];

            let hasVisitedPage = this.visitedPages[pageName];
            
            if(hasVisitedPage){
                //delete this.visitedPages[pageName]
                const pages = Object.keys(this.visitedPages);
                const indexOfSelectedPage = pages.indexOf(pageName);

                const filteredPages = pages.filter(page => pages.indexOf(page) !== indexOfSelectedPage + 1);

                const newObject = {};

                filteredPages.forEach(page=>{
                    newObject[page] = page;
                });

                this.visitedPages = newObject;
                
            }else{
                const newObject = {};
                
                newObject[pageName] = pageName;

                this.visitedPages = {...this.visitedPages, ...newObject};
            }
        },
        goForwardOnePage(currentPage){
            const pageKeys = Object.keys(Routes);
            pageKeys.forEach((page)=>{
                if(page === currentPage){
                    let pageAfterCurrentPage = pageKeys[pageKeys.indexOf(currentPage) + 1];
                    this.currentPage = Routes[pageAfterCurrentPage];
                }
            });
        },
        goBackOnePage(currentPage){
            const pageKeys = Object.keys(Routes);
            pageKeys.forEach((page)=>{
                if(page === currentPage){
                    let pageBeforeCurrentPage = pageKeys[pageKeys.indexOf(currentPage) - 1];
                    this.currentPage = Routes[pageBeforeCurrentPage];
                }
            });
        }
    },
    getters:{
        getCurrentPage:(state)=>state.currentPage
    }
});
