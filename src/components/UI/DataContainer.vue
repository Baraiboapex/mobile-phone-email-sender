<template>
    <div class="container-fluid p-0">
        <div class="row">
            <div class="col-12">
                <div v-if="pageIsLoaded">
                    <slot  
                        :data="data" 
                        @set-template-params="setTemplateParams"
                        @set-users-to-send-to="setUsersToSendTo"
                        @set-selected-template="setSelectedTemplate"
                        @set-mode="setMode"
                        @send-data="sendData"
                    ></slot>
                </div>
                <div v-else>
                    <section class="message message-box" id="loadingMessage">
                        <h3 id="loadingMessageText">Sending Data</h3>
                        <h2 class="spinner-border" role="status"></h2>
                    </section>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-12">
                <div :class="altertType.type" role="alert">
                    {{ altertType.text }}
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
    import {ref, reactive, computed} from "vue",
    import {makeSecureApiCall} from "../../Infra/httpSecurityBinder";
    import api from "../../Infra/apiComponent";

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

    const setTemplateParams = (params)=>{
        data.templateParams = params;
    }

    const setUsersToSendTo = (users) => {
        data.usersToSendTo = users;
    }

    const setSelectedTemplate = (template) => {
        data.selectedTemplate = template;
    }

    const setMode = (mode) => {
        data.mode = mode;
    }

    const sendData = async () => {
        try{
            pageIsLoading.value = true;

            await makeSecureApiCall({
                apiObject:api,
                callBody:dataToSend,
                headers: headers: {
                "Content-Type": "application/json",
                },
                method:"post",
                otherConfig:{
                    redirect: "follow",
                }
            });

            page
            pageIsLoading.value = false;
        }catch(err){
            pageIsLoading.value = true;
        }
    }
</script>