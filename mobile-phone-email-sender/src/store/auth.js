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
                const callBodyToSend = {
                    userName,
                    password,
                    applicationName,
                    loginMode
                };
                
                const loginReady = await makeSecureApiCall({
                    apiObject:api,
                    callBody:callBodyToSend,
                    headers:{
                        "Content-Type": "application/json",
                    },
                    method:"post",
                    otherConfig:{
                        mode:"no-cors"
                    },
                    secretObjectKey:"u2"
                });
                
                console.log(loginReady);

                state.isLoggedIn = true;

                resolve(loginReady);
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