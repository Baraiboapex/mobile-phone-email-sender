import AnnouncementTemplate from "../../Pages/Templates/AnnouncementTemplate.vue";
import ClassRestartingTemplate from "../../Pages/Templates/ClassRestartingTemplate.vue";
import CustomTemplate from "../../Pages/Templates/CustomTemplate.vue";
import NoClassTemplate from "../../Pages/Templates/NoClassTemplate.vue";
import SelectTemplate from "../../Pages/SelectTemplate.vue";
import SendTypeTemplate from "../../Pages/SendTypeTemplate.vue";
import Login from "../../Pages/Login.vue";
import AuthCodeForm from "../../Pages/AuthCodeForm.vue";

import { defineStore } from "pinia";

export const PageNames = {
    ANNOUNCEMENT_TEMPLATE_NAME:"AnnouncementTemplate",
    CLASS_RESTARTING_TEMPLATE_NAME:"ClassRestartingTemplate",
    CUSTOM_TEMPLATE:"CustomTemplate",
    NO_CLASS_TEMPLATE_NAME:"NoClassTemplate",
    SEND_TYPE_TEMPLATE_NAME:"SendTypeTemplate",
    SELECT_TEMPLATE_NAME:"SelectTemplate",
    AUTH_CODE_PAGE_NAME:"AuthCodeForm",
    LOGIN_PAGE_NAME:"Login"
};

export const Routes = {
    AnnouncementTemplate,
    ClassRestartingTemplate,
    CustomTemplate,
    NoClassTemplate,
    SelectTemplate,
    SendTypeTemplate,
    Login,
    AuthCodeForm
};

export const CurrentPageStore = defineStore("CurrentPage", {
    state:()=>{
        return {
            currentPage:Routes[PageNames.LOGIN_PAGE_NAME],
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
        updatePageWithoutNav(pageName){
            this.currentPage = Routes[pageName];
        },
        resetVisitedPagesList(){
            this.visitedPages={}
        }
    },
    getters:{
        getCurrentPage:(state)=>state.currentPage
    }
});
