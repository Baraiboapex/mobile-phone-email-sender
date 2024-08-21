<template>
    <div class="container-fluid p-0">
        <div class="row">
            <div class="col-12">
                <div v-if="showToast" :class="altertType.type" role="alert">
                    {{ altertType.text }}
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-12">
                <div v-if="pageIsLoaded">
                    <slot  
                        name="data"
                        :dataToSend="dataToSend"
                    ></slot>
                </div>
                <div v-else class="d-flex align-items-center">
                    <section class="message message-box" id="loadingMessage">
                        <h3 id="loadingMessageText">Sending Data</h3>
                        <h2 class="spinner-border" role="status"></h2>
                    </section>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
    import {ref, reactive, computed, provide, onMounted, markRaw} from "vue";
    import {makeSecureApiCall} from "../../Infra/httpSecurityBinder";
    import api from "../../Infra/apiCompnent";

    const dataToSend = reactive({
        usersToSendTo:[],
        selectedTemplate:null,
        templateParams:{},
        mode:null
    });

    const pageIsLoading = ref(false);
    const showToast = ref(false);
    const dataSentSuccessfully = ref(false);
    
    const pageIsLoaded = computed(()=>!pageIsLoading.value);
    const altertType = computed(()=>{
        return dataSentSuccessfully.value ? {
            text:"Email sent successfully!",
            type:"alert alert-success"
        } : {
            text:"Email could not be sent",
            type:"alert alert-danger"
        }
    });

    onMounted(()=>{
        if(!sessionStorage.getItem("currentData")){
            initializeDataObjectInSessionStorage();
        }else{
            setDataStateFromLocalStorage();
        }
    });

    const setDataStateFromLocalStorage = () => {
        const currentStateFromSessionStorage =  JSON.parse(sessionStorage.getItem("currentData"));

        const updateObject = {
            ...currentStateFromSessionStorage
        };

        updateSessionStorage(updateObject);
    }

    const updateSessionStorage = (currentRouteObject) => {
        if(sessionStorage.getItem("currentRouter")){
            sessionStorage.removeItem("currentRouter");
            sessionStorage.setItem("currentRouter", JSON.stringify(currentRouteObject));
        }else{
            sessionStorage.setItem("currentRouter", JSON.stringify(currentRouteObject));
        }
    };

    const initializeDataObjectInSessionStorage = () => {
        const updateObject = {
            ...markRaw(dataToSend)
        };
        sessionStorage.setItem("currentData", JSON.stringify(updateObject));
    }

    const setTemplateParams = (params)=>{    
        dataToSend.templateParams = params;
    }

    const setUsersToSendTo = (users) => {
        dataToSend.usersToSendTo = users;
    }

    const setSelectedTemplate = (template) => {
        dataToSend.selectedTemplate = template;
    }

    const setMode = (mode) => {
        dataToSend.mode = mode;
    }

    const popToast = () => {
        showToast.value = false;
        window.setTimeout(()=>{
            showToast.value = false;
        },1500);
    }

    const sendData = async () => {
        try{
            pageIsLoading.value = true;
            await makeSecureApiCall({
                apiObject:api,
                callBody:dataToSend,
                headers:{
                    "Content-Type": "application/json",
                },
                method:"post",
                otherConfig:{
                    redirect: "follow",
                    mode:"no-cors"
                },
                secretObjectKey:"u"
            });
            pageIsLoading.value = false;
            dataSentSuccessfully.value = true;
            popToast();

            sessionStorage.removeItem("senderData");
        }catch(err){
            pageIsLoading.value = false;
            dataSentSuccessfully.value = false;
            popToast();
        }
    }

    provide("dataUpdaters",{
        setTemplateParams,
        setUsersToSendTo,
        setSelectedTemplate,
        setMode,
        sendData
    });
</script>