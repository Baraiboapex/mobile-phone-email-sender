import { defineStore } from "pinia";
import {makeSecureApiCall} from "../Infra/httpSecurityBinder";
import api from "../Infra/apiCompnent";

export const AuthStore = defineStore("Auth", {
    state:()=>{
        return {
            isLoggedIn:sessionStorage.getItem("authStatus") ? JSON.parse(sessionStorage.getItem("authStatus")).isLoggedIn : false,
            userIsAuthroized:sessionStorage.getItem("authStatus") ? JSON.parse(sessionStorage.getItem("authStatus")).userIsAuthroized : false
        }
    },
    actions:{
        updateSessionStorage(currentRouteObject){
            sessionStorage.setItem("authStatus", JSON.stringify(currentRouteObject));
        },
        async login({
            userName,
            password,
            applicationName,
            loginMode
        }){
            return new Promise(async (resolve,reject)=>{
                try{
                    const callBodyToSend = {
                        userName,
                        password,
                        applicationName,
                        loginMode
                    };
                    
                    await makeSecureApiCall({
                        apiObject:api,
                        callBody:callBodyToSend,
                        headers:{
                            "Content-Type": "application/json",
                        },
                        method:"post",
                        otherConfig:{
                            mode:"no-cors",
                            redirect: "follow",
                        },
                        noConfig:false,
                        secretObjectKey:"u2"
                    });
                    
                    const loginValidationFieldsToSubmit = {
                        userName,
                        password,
                        loginMode: "ValidateUserExists",
                    };
                    
                    const validateLogin = await makeSecureApiCall({
                        urlParams:new URLSearchParams(loginValidationFieldsToSubmit).toString(),
                        apiObject:api,
                        method:"get",
                        noConfig:false,
                        headers:{
                            redirect: "follow",
                        },
                        secretObjectKey:"u2"
                    });
                    
                    let validLogin = validateLogin.userIsLoggedIn;

                    if(validLogin){
                        this.isLoggedIn = validLogin;
                        this.userIsAuthroized = false;
                        this.updateSessionStorage({isLoggedIn : true, userIsAuthroized:false});
                        resolve(validLogin);
                    }else{
                        this.isLoggedIn = false;
                        this.userIsAuthroized = false;
                        this.updateSessionStorage({isLoggedIn : false, userIsAuthroized:false});
                        reject();
                    }
                }catch(err){
                    this.updateSessionStorage({isLoggedIn : this.isLoggedIn, userIsAuthroized:false});
                    throw new Error("Could not login:", err);
                }
            });
        },
        logout(){
            this.isLoggedIn = false;
            this.userIsAuthorized = false;
            this.user = {};
            sessionStorage.removeItem("authStatus");
            sessionStorage.removeItem("currentRouter");
            sessionStorage.removeItem("currentData");
        },
        setIsLoggedInToTrue(){
            this.isLoggedIn = true;
        },
        setUserAuthorization(isAuthorized){
            this.userIsAuthroized = isAuthorized;
            this.updateSessionStorage({isLoggedIn : this.isLoggedIn, userIsAuthroized:isAuthorized})
        }
    },
    getters:{
        getUser:(state)=>state.user,
        getIsLoggedIn:(state)=>state.isLoggedIn,
        getUserIsAuthroized:(state)=>state.userIsAuthroized
    }
});