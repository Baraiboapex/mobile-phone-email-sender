const CURRENT_PROXY_URL = "https://mb-cors-proxy.fly.dev/";
const CURRENT_SECURITY_SERVER_URL = "https://sum-auth-server-aged-smoke-7979.fly.dev/solution";

async function makeSecureApiCall({
    apiObject,
    callBody,
    headers,
    method,
    otherConfig
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
            url:securitySolutionSecrets.u,
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
            customConfigObject = { ...config, ...otherConfig};
        }
        
        const basicApiCall = await apiObject[method]((otherConfig !== null ? customConfigObject : config));

        return basicApiCall;
        
    }catch(err){
        console.log(err);
    }
}

async function getCurrentSolution({proxyUrl}){
    const config = {
        method:"GET",
        headers:{
          "Target-URL":CURRENT_SECURITY_SERVER_URL
        }
    };
    return fetch(proxyUrl, config);
}

async function postCurrentSolutionToGetSecrets({proxyUrl, solution}){
    const config = {
        method:"POST",
        body:JSON.stringify(solution),
        headers: {
        "Content-Type": "application/json",
        "Target-URL":CURRENT_SECURITY_SERVER_URL
        }
    };
    return fetch(proxyUrl, config);
}

const securityBinder = {
    makeSecureApiCall
};

export default securityBinder;