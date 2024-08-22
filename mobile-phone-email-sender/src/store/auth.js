import { defineStore } from "pinia";
import {makeSecureApiCall} from "../Infra/httpSecurityBinder";
import api from "../Infra/apiCompnent";

export const AuthStore = defineStore("Auth", {
    state:()=>{
        return {
            user:{},
            isLoggedIn:false
        }
    },
    actions:{
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
                        noConfig:true,
                        secretObjectKey:"u2"
                    });
                    
                    let validLogin = validateLogin.userIsLoggedIn;

                    if(validLogin){
                        this.isLoggedIn = validLogin;
                        resolve(validLogin);
                    }else{
                        this.isLoggedIn = false;
                        reject();
                    }
                }catch(err){
                    throw new Error("Could not login:", err);
                }
            });
        },
        logout(){
            this.isLoggedIn = false;
            this.user = {};
        },
        setIsLoggedInToTrue(){
            this.isLoggedIn = true;
        }
    },
    getters:{
        getUser:(state)=>state.user,
        getIsLoggedIn:(state)=>state.isLoggedIn
    }
});