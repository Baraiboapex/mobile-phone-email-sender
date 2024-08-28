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
                configToSend.body = JSON.stringify(body);
            }
            
            fetch(url, configToSend)
            .then((res)=>parseResponseData({resp:res, method}))
            .then(async (data)=>{
                if(method !== "GET"){
                    if(data){
                        resolve({dataSent:true});
                    }else{
                        reject({
                            error:"Could not get data"
                        });
                    }
                }else{
                    const getFinalData = await displayData({
                        data
                    });

                    resolve(getFinalData);
                }
            }).catch((err)=>{
                reject(err);
            });

        }catch(err){
            reject(err);
        }
    }) 
}

async function parseResponseData({resp, method}){
    return new Promise(async (res, rej)=>{
        if(method === "GET"){
            if(resp.ok){
                const json = await resp.json();
                res(json);
            }else{
                rej("Could not get data from server");
            }
        }else{
            res(resp);
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