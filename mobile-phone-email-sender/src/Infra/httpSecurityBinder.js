const CURRENT_PROXY_URL = "http://localhost:3002/solution";
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
        const results = await fetch(proxyUrl, config);
        results.ok ? resolve(results.json()) : reject(null);
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
        results.ok ? resolve(results.json()) : reject(null);
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

        console.log("ITEMS being sent ==>",JSON.parse(callBody));

        const getSecuritySolution = await getCurrentSolution({
            proxyUrl:CURRENT_PROXY_URL
        });
    
        const securitySolutionSecrets = await postCurrentSolutionToGetSecrets({
            proxyUrl:CURRENT_PROXY_URL,
            solution:getSecuritySolution
        });
        
        const config = {
            url:securitySolutionSecrets.$sec.u,
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

        return basicApiCall;
        
    }catch(err){
        console.log(err);
    }
}
