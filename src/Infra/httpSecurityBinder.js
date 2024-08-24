const CURRENT_PROXY_URL = "https://mb-cors-proxy.fly.dev/";
const CURRENT_SECURITY_SERVER_URL = "https://sum-auth-server-aged-smoke-7979.fly.dev/solution";

async function getCurrentSolution({proxyUrl}){
    const config = {
        method:"GET",
        headers:{
          "Target-URL":CURRENT_SECURITY_SERVER_URL,
            "App-Name":"mobile-phone-email-sender"
        }
    };
    return new Promise(async(resolve, reject)=>{
        try{
            const results = await fetch(proxyUrl, config);
            if(results.ok){
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
            "Target-URL":CURRENT_SECURITY_SERVER_URL,
            "App-Name":"mobile-phone-email-sender"
        }
    };
    return new Promise(async(resolve, reject)=>{
        const results = await fetch(proxyUrl, config);
        try{
            if(results.ok){
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
    urlParams,
    secretObjectKey
}){
    try{

        const getSecuritySolution = await getCurrentSolution({
            proxyUrl:CURRENT_PROXY_URL
        });
    
        const securitySolutionSecrets = await postCurrentSolutionToGetSecrets({
            proxyUrl:CURRENT_PROXY_URL,
            solution:getSecuritySolution
        });
        
        const config = {
            url:securitySolutionSecrets.$sec[secretObjectKey] + (urlParams ? "?"+urlParams : ""),
            method,
        };

        let customConfigObject = null;

        if(headers !== null && headers !== undefined){
            config.headers = headers;
        }
    
        if(callBody !== null && callBody !== undefined){
            config.body = callBody;
        }
        
        if(otherConfig !== null && otherConfig !== undefined){
            customConfigObject = { ...config, otherConfig};
        }

        console.log("CONFIG BUILT IN HTTP SECURITY BINDER ===> ",method, customConfigObject);

        const basicApiCall = await apiObject[method]((otherConfig !== null && otherConfig !== undefined ? customConfigObject : config));

        return basicApiCall;
        
    }catch(err){
        throw new Error("Could not make request");
    }
}
