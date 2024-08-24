async function setupFetch({
    url,
    body,
    otherConfig,
    method,
    headers,
}){
    return new Promise(async (resolve, reject)=>{
        try{
            const configToSend = {
                ...otherConfig
            };

            if(method !== "GET"){
                configToSend.method = method;
                configToSend.headers = headers;
            }

            if(body){
                configToSend.body = body;
            }
            
            console.log("CONFIG BUILT IN API COMPONENT ===> ", url, configToSend, method);

            fetch(url, configToSend)
            .then((res)=>parseResponseData({resp:res, method}))
            .then(async (data)=>{
                if(method !== "GET"){
                    resolve({dataSent:true});
                }else{
                    const getFinalData = await displayData({
                        data
                    });
        
                    resolve(getFinalData);
                }
            });

        }catch(err){
            reject(err);
        }
    }) 
}

async function parseResponseData({resp, method}){
    console.log("METHOD", method);
    return new Promise(async (res, rej)=>{
        if(method === "GET"){
            console.log("GET");
            if(resp.ok){
                const json = await resp.json();
                res(json);
            }else{
                rej("Could not get data from server");
            }
        }else{
            console.log("POST");
            res();
        }
    })
}

async function displayData({data}){
    return new Promise((res,rej)=>{
        try{
            res(data);
        }catch(err){
            rej("Could not get data from server");
        }
    });
}

const api = {
    get:async ({
        url,
        body,
        otherConfig,
        headers
    })=>setupFetch({
        url,
        body,
        method:"GET",
        otherConfig,
        headers
    }),
    post:async ({
        url,
        body,
        otherConfig,
        headers
    })=>setupFetch({
        url,
        body,
        method:"POST",
        otherConfig,
        headers
    })   
};

export default api;