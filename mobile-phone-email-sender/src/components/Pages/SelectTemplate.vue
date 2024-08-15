<script setup>
    import {computed} from "vue";

    const emittedEvents = defineEmits([
        "setTemplateParams",
        "setUsersToSendTo",
        "setSelectedTemplate",
        "setMode",
        "sendData",
        "changeCurrentRoute"
    ]);

    const selectTemplate = (event)=>{
        const currentTemplateName = event.target.id;
        const currentSelectedTemplate = currentTemplateName.substring(
            3, 
            currentTemplateName.length
        );

        emittedEvents("setSelectedTemplate",currentSelectedTemplate);
        emittedEvents("changeCurrentRoute",currentSelectedTemplate);
    };

</script>
<template>
    <div class="container">
        <div class="row mt-2 mb-2">
            <div class="col-12">
                <div class="w-100 d-flex justify-content-center align-items-center">
                    <h3>Please select the type of email you wish to send.</h3>
                    <hr/>
                </div>
            </div>
        </div>
        <div class="row mt-2 mb-2">
            <div class="col-sm-12 d-flex justify-content-center align-items-center">
                <div class="w-100 d-flex justify-content-center align-items-center">
                    <button id="setAnnouncementTemplate" @click="selectTemplate" class="btn btn-light app-button">Announcement Email</button>
                </div>
            </div>
        </div>
        <div class="row mt-2 mb-2">
            <div class="col-sm-12 d-flex justify-content-center align-items-center">
                <div class="w-100 d-flex justify-content-center align-items-center">
                    <button id="setClassRestartingTemplate" @click="selectTemplate" class="btn btn-light app-button">Class Restart Email</button>
                </div>
            </div>
        </div>
        <div class="row mt-2 mb-2">
            <div class="col-sm-12 d-flex justify-content-center align-items-center">
                <div class="w-100 d-flex justify-content-center align-items-center">
                    <button id="setNoClassTemplate" @click="selectTemplate" class="btn btn-light app-button">No Class Email</button>
                </div>
            </div>
        </div>
        <div class="row mt-2 mb-2">
            <div class="col-sm-12 d-flex justify-content-center">
                <div class="w-100 d-flex justify-content-center align-items-center">
                    <button id="setCustomTemplate" @click="selectTemplate" class="btn btn-light app-button">Custom Email</button>
                </div>
            </div>
        </div>
    </div>
</template>