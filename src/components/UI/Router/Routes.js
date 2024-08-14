import AnnouncementTemplate from "../../Pages/Templates/AnnouncementTemplate.vue";
import ClassRestartingTemplate from "../../Pages/Templates/ClassRestartingTemplate.vue";
import CustomTemplate from "../../Pages/Templates/CustomTemplate.vue";
import NoClassTemplate from "../../Pages/Templates/NoClassTemplate.vue";
import SelectTemplate from "../../Pages/SelectTemplate.vue";
import SendTypeTemplate from "../../Pages/SendTypeTemplate.vue";

import { defineStore } from "pinia";

const PageNames = {
    ANNOUNCEMENT_TEMPLATE_NAME:"AnnouncementTemplate",
    CLASS_RESTARTING_TEMPLATE_NAME:"ClassRestartingTemplate",
    CUSTOM_TEMPLATE:"CustomTemplate",
    NO_CLASS_TEMPLATE_NAME:"NoClassTemplate",
    SEND_TYPE_TEMPLATE_NAME:"SendTypeTemplate",
    SELECT_TEMPLATE_NAME:"SelectTemplate"
};

const Routes = {
    AnnouncementTemplate,
    ClassRestartingTemplate,
    CustomTemplate,
    NoClassTemplate,
    SelectTemplate,
    SendTypeTemplate
};

const CurrentPageStore = defineStore("CurrentPage", {
    state:()=>{
        return {currentPage:Routes[PageNames.NO_CLASS_TEMPLATE_NAME]}
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

export default {
    CurrentPageStore,
    PageNames,
    Routes
}