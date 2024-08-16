async function setupFetch({
    url,
    body,
    otherConfig,
    method,
    headers
}){
    return new Promise(async (resolve, reject)=>{
        console.log({
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

            console.log({
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
            console.error("Could not get data from server");
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