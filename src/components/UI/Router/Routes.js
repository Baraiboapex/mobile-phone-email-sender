import AnnouncementTemplate from "../../Pages/Templates/AnnouncementTemplate.vue";
import ClassResumesTemplate from "../../Pages/Templates/ClassResumesTemplate.vue";
import CustomTemplate from "../../Pages/Templates/CustomTemplate.vue";
import NoClassTemplate from "../../Pages/Templates/NoClassTemplate.vue";
import SelectTemplate from "../../Pages/SelectTemplate.vue";
import SendTypeTemplate from "../../Pages/SendTypeTemplate.vue";
import Login from "../../Pages/Login.vue";
import AuthCodeForm from "../../Pages/AuthCodeForm.vue";

import { defineStore } from "pinia";

export const PageNames = {
    ANNOUNCEMENT_TEMPLATE_NAME:"AnnouncementTemplate",
    CLASS_RESTARTING_TEMPLATE_NAME:"ClassResumesTemplate",
    CUSTOM_TEMPLATE:"CustomTemplate",
    NO_CLASS_TEMPLATE_NAME:"NoClassTemplate",
    SEND_TYPE_TEMPLATE_NAME:"SendTypeTemplate",
    SELECT_TEMPLATE_NAME:"SelectTemplate",
    AUTH_CODE_PAGE_NAME:"AuthCodeForm",
    LOGIN_PAGE_NAME:"Login"
};

export const Routes = {
    AnnouncementTemplate,
    ClassResumesTemplate,
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
            currentPage:sessionStorage.getItem("currentRouter") ? JSON.parse(sessionStorage.getItem("currentRouter")).currentPage : Routes[PageNames.LOGIN_PAGE_NAME] ,
            visitedPages:sessionStorage.getItem("currentRouter") ? JSON.parse(sessionStorage.getItem("currentRouter")).visitedPages : {}
        }
    },
    actions:{
        updateSessionStorage(currentRouteObject){
            sessionStorage.setItem("currentRouter", JSON.stringify(currentRouteObject));
        },
        updatePage(pageName){
            this.currentPage = Routes[pageName];

            let hasVisitedPage = this.visitedPages[pageName];
            
            if(pageName !== "Login" && pageName !== "AuthCodeForm"){
                if(hasVisitedPage){
                    const pages = Object.keys(this.visitedPages);
                    const indexOfSelectedPage = pages.indexOf(pageName);
    
                    const filteredPages = pages.filter(page => {
                        console.log(pages.indexOf(page) !== 0);
                        return (indexOfSelectedPage !== 0 ? pages.indexOf(page) !== indexOfSelectedPage + 1 : pages.indexOf(page) === 0);
                    });
    
                    const newObject = {};
    
                    filteredPages.forEach(page=>{
                        newObject[page] = page;
                    });
    
                    this.visitedPages = newObject;
                    
                    const updateObject = {
                        currentPage:this.currentPage,
                        visitedPages:this.visitedPages
                    };
    
                    this.updateSessionStorage(updateObject);
    
                }else{
                    const newObject = {};
                    
                    newObject[pageName] = pageName;
    
                    this.visitedPages = {...this.visitedPages, ...newObject};
    
                    const updateObject = {
                        currentPage:this.currentPage,
                        visitedPages:this.visitedPages
                    };
    
                    this.updateSessionStorage(updateObject);
                }
            }
            
        },
        updatePageWithoutNav(pageName){
            this.currentPage = Routes[pageName];
        },
        resetVisitedPagesList(){
            this.visitedPages={};
        },
        setRouterStateFromLocalStorage(){
            const currentStateFromSessionStorage =  JSON.parse(sessionStorage.getItem("currentRouter"));

            const updateObject = {
                currentPage:currentStateFromSessionStorage.currentPage,
                visitedPages:currentStateFromSessionStorage.visitedPages
            };

            this.updateSessionStorage(updateObject);
        },
        initializeRouteObjectInSessionStorage(){
            const updateObject = {
                currentPage:this.currentPage,
                visitedPages:this.visitedPages
            };
            this.updateSessionStorage(updateObject);
        }
    },
    getters:{
        getCurrentPage:(state)=>state.currentPage,
        getCurrentRouterState:(state)=>state,
        getCurrentVisitedPages:(state)=>state.visitedPages
    }
});
