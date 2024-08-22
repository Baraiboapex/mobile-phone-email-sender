<template>
    <div class="container-fluid p-0">
        <div class="row">
            <div class="col-12">
                <div v-if="showPage">
                    <slot  
                        name="data"
                        :dataToSend="dataToSend"
                    ></slot>
                </div>
                <div v-else class="d-flex justify-content-center w-100">
                    <LoadingSign
                        :showLoadingSign="showLoadingSign"
                        loadingMessageText="Sending email..."
                    />
                    <SubmissionMessage
                :showSubmissionMessage="showSubmissionMessage"
                :submissionWasSuccessful="submissionWasSuccessful"
                :nameOfDataBeingSubmitted="nameOfDataBeingSubmitted"
                submissionButtonText="Make new submission"
                @submission-button-clicked="resetForm"
            >
                <template #submissionSuccessIconImage="data">
                    <svg 
                    v-if="data.submissionSuccessful"
                        xmlns="http://www.w3.org/2000/svg" 
                        width="100" 
                        height="100" 
                        fill="currentColor" 
                        class="bi bi-check" 
                        viewBox="0 0 16 16"
                    >
                    <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425z"/>
                </svg>
                </template>
                <template #submissionFailureIconImage="data">
                    <svg v-if="!data.submissionSuccessful"
                        xmlns="http://www.w3.org/2000/svg" 
                        width="100" 
                        height="100" 
                        fill="currentColor" 
                        style="color:red;" 
                        class="bi bi-x" 
                        viewBox="0 0 16 16"
                    >
                    <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/>
                    </svg>
                </template>
            </SubmissionMessage>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
    import {ref, reactive, computed, provide, onMounted, markRaw, inject} from "vue";
    import {makeSecureApiCall} from "../../Infra/httpSecurityBinder";
    import api from "../../Infra/apiCompnent";
    
    import LoadingSign from "../UI/Reusable/LoadingSign.vue";
    import SubmissionMessage from "../UI/Reusable/SubmissionMessage.vue";

    const {
        enableDisableNavbarButtons
    } = inject("navbarControls");

    const dataToSend = reactive({
        usersToSendTo:[],
        selectedTemplate:null,
        templateParams:{},
        mode:null
    });
    
    const showPage = ref(true);
    const submissionWasSuccessful = ref(false);
    const showLoadingSign = ref(false);
    const nameOfDataBeingSubmitted = ref("");
    
    const showSubmissionMessage = computed(()=>!showLoadingSign.value);

    onMounted(()=>{
        if(!sessionStorage.getItem("currentData")){
            initializeDataObjectInSessionStorage();
        }else{
            setDataStateFromLocalStorage();
        }
    });

    const setDataStateFromLocalStorage = () => {
        const currentStateFromSessionStorage =  JSON.parse(dataToSend);

        const updateObject = {
            ...currentStateFromSessionStorage
        };

        updateSessionStorage(updateObject);
    }

    const updateSessionStorage = (currentStateObject) => {
        if(sessionStorage.getItem("currentData")){
            sessionStorage.removeItem("currentData");
            sessionStorage.setItem("currentData", JSON.stringify(currentStateObject));
        }else{
            sessionStorage.setItem("currentData", JSON.stringify(currentStateObject));
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
        updateSessionStorage(dataToSend);
    }

    const setUsersToSendTo = (users) => {
        dataToSend.usersToSendTo = users;
        updateSessionStorage(dataToSend);
    }

    const setSelectedTemplate = (template) => {
        dataToSend.selectedTemplate = template;
        updateSessionStorage(dataToSend);
    }

    const setMode = (mode) => {
        dataToSend.mode = mode;
        updateSessionStorage(dataToSend);
    }

    const resetForm = ()=>{
        showPage.value = true;
        submissionWasSuccessful.value = false;
        showLoadingSign.value = false;
        showSubmissionMessage.value = false;
        enableDisableNavbarButtons({
            buttonsDisabled:false
        });
    }

    const toggleSubmissionMessage = ({
        showMessage,
        submissionSuccessful,
        messageText
    }) => {
        submissionWasSuccessful.value = submissionSuccessful;
        nameOfDataBeingSubmitted.value = messageText ? messageText : null;
    }

    const toggleLoadingSign = ({
        showLoading
    })=>{
        showLoadingSign.value = showLoading;
    };

    const sendData = async () => {
        
        try{
            showPage.value = false;

            enableDisableNavbarButtons({
                buttonsDisabled:true
            });

            toggleLoadingSign({
                showLoading:true
            });

            toggleSubmissionMessage({
                showMessage:false,
                submissionSuccessful:false,
            });
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

            toggleLoadingSign({
                showLoading:false
            });

            toggleSubmissionMessage({
                showMessage:true,
                submissionSuccessful:true,
                messageText:"Email"
            });
        }catch(err){
            console.log(err);

            enableDisableNavbarButtons({
                buttonsDisabled:false
            });

            toggleLoadingSign({
                showLoading:false
            });
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