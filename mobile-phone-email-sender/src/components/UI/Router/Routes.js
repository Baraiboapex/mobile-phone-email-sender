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
        return {currentPage:Routes[PageNames.SEND_TYPE_TEMPLATE_NAME]}
    },
    actions:{
        updatePage(pageName){
            this.currentPage = Routes[pageName];
        }
    },
    getters:{
        getCurrentPage:(state)=>state.currentPage
    }
});
