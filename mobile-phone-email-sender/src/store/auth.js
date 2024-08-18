import { defineStore } from "pinia";
import {makeSecureApiCall} from "../Infra/httpSecurityBinder";

export const AuthStore = defineStore("Auth", {
    state:()=>{
        return {
            user:{},
            isLoggedIn:false
        }
    },
    actions:{
        login({
            username,
            password
        }){
            return Promise(async (resolve,reject)=>{
                const callBodyToSend = {
                    username,
                    password
                }
                const loginReady = await makeSecureApiCall({
                    apiObject:api,
                    callBody:JSON.stringify(callBodyToSend),
                    headers:{
                        "Content-Type": "application/json",
                    },
                    method:"post",
                    otherConfig:{
                        redirect: "follow",
                        mode:"no-cors"
                    },
                    secretObjectKey:"lu"
                });
                
                state.isLoggedIn = true;

                resolve(loginReady);
            })
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