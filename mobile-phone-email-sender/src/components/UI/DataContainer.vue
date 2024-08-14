<template>
    <div class="container-fluid p-0">
        <div v-if="!pageIsLoading">
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
</template>
<script setup>
    import {ref, reactive, computed} from "vue",

    const dataToSend = reactive({
        usersToSendTo:[],
        selectedTemplate:null,
        templateParams:{},
        mode:null
    });

    const pageIsLoading = ref(false);
    const showToast = ref(false);
    const toastMessge = ref(false);
    
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

    const sendData = () => {
        pageIsLoading.value = true;

        window.setTimeOut(()=>{
            pageIsLoading.value = false;
            console.log("Here is the data to send ===> ", data);
        }, 1500);

        showToast.value = true;
        window.setTimeOut(()=>{
            showToast.value = false;
        }, 2000);
    }
</script>