async function setupFetch({
    url,
    body,
    otherConfig,
    method,
    headers,
    noConfig
}){
    return new Promise(async (resolve, reject)=>{
        try{
            const configToSend = {
                method,
                headers,
                ...otherConfig
            };

            if(body){
                configToSend.body = body;
            }
            
            let fetchData = null;

            if(noConfig){
                fetchData = await fetch(url);
            }else{
                fetchData = await fetch(
                    url, configToSend
                );
            }

            console.log(fetchData, url, configToSend);

            if(method !== "GET"){
                resolve({dataSent:true});
            }else{
                const parsedData = await parseResponseData({
                    resp:fetchData,
                });
    
                const getFinalData = await displayData({
                    data:parsedData
                });
    
                resolve(getFinalData);
            }

        }catch(err){
            reject(err);
        }
    }) 
}

async function parseResponseData({resp}){
    return new Promise(async (res, rej)=>{
        if(resp.ok){
            const json = await resp.json();
            res(json);
        }else{
            rej("Could not get data from server");
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