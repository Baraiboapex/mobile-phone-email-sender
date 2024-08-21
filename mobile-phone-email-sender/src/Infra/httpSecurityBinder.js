const CURRENT_PROXY_URL = "http://localhost:3002/";
const CURRENT_SECURITY_SERVER_URL = "http://localhost:3000/solution";

import { markRaw } from "vue";

async function getCurrentSolution({proxyUrl}){
    const config = {
        method:"GET",
        headers:{
          "Target-URL":CURRENT_SECURITY_SERVER_URL
        }
    };
    return new Promise(async(resolve, reject)=>{
        try{
            const results = await fetch(proxyUrl, config);
            if(results.ok){
                console.log("TETT");
                resolve(results.json());
            }else{
                throw new Error("Could not make request");
            }
        }catch(err){
            reject("Could not make request");
            throw new Error("Could not make request");
        }
    });
}

async function postCurrentSolutionToGetSecrets({proxyUrl, solution}){

    const objectToSend = {
        k:solution.sol_k,
        side:solution.sid
    };

    const config = {
        method:"POST",
        body:JSON.stringify(objectToSend),
        headers: {
            "Content-Type": "application/json",
            "Target-URL":CURRENT_SECURITY_SERVER_URL
        }
    };
    return new Promise(async(resolve, reject)=>{
        const results = await fetch(proxyUrl, config);
        try{
            if(results.ok){
                console.log("TSTT");
                resolve(results.json());
            }else{
                throw new Error("Could not make request");
            }
        }catch(err){
            reject("Could not make request");
            throw new Error("Could not make request");
        }
    });
}

export async function makeSecureApiCall({
    apiObject,  
    callBody,
    headers,
    method,
    otherConfig,
    secretObjectKey
}){
    try{

        console.log("ITEMS being sent ==>",callBody);
        console.log("TEST", CURRENT_PROXY_URL);

        const getSecuritySolution = await getCurrentSolution({
            proxyUrl:CURRENT_PROXY_URL
        });
    
        const securitySolutionSecrets = await postCurrentSolutionToGetSecrets({
            proxyUrl:CURRENT_PROXY_URL,
            solution:getSecuritySolution
        });
        
        const config = {
            url:securitySolutionSecrets.$sec[secretObjectKey],
            method,
        };
    
        let customConfigObject = null;
        
        if(headers !== null && headers !== undefined){
            config.headers = headers;
        }
    
        if(callBody !== null && callBody !== undefined){
            config.body = JSON.stringify(markRaw(callBody));
        }
    
        if(otherConfig !== null && otherConfig !== undefined){
            customConfigObject = { ...config, otherConfig};
        }
        
        const basicApiCall = await apiObject[method]((otherConfig !== null ? customConfigObject : config));

        console.log(basicApiCall);

        return basicApiCall;
        
    }catch(err){
        throw new Error("Could not make request");
    }
}
