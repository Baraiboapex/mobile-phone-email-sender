async function setupFetch({
    url,
    body,
    otherConfig,
    method,
    headers
}){
    return new Promise(async (resolve, reject)=>{
        console.log("CONFIG",{
            url,
            body,
            otherConfig,
            method,
            headers
        });
        try{
            const fetchData = await fetch(
                url,{
                    method,
                    body,
                    headers,
                    ...otherConfig
                }
            );

            console.log("CONFIG-2",url,{
                method,
                body,
                headers,
                ...otherConfig
            });

            const parsedData = await parseResponseData({
                resp:fetchData,
            });

            const getFinalData = await displayData({
                data:parsedData
            });

            resolve(getFinalData);
        }catch(err){
            console.error("ERROR: ",err);
            reject(err);
        }
    }) 
}

async function parseResponseData({resp}){
    return new Promise(async (res, rej)=>{
        console.log(resp);
        if(resp.ok){
            const json = await resp.json();
            console.log("DATA",json);
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