<script setup>
    import {computed} from "vue";
    import {}
    const emittedEvents = defineEmits([
        "setTemplateParams",
        "setUsersToSendTo",
        "setSelectedTemplate",
        "setMode",
        "sendData",
        "changeCurrentRoute"
    ]);

    const selectTemplate = (event)=>{
        const currentTemplateId = event.target.id;
        const currentTSelectedTemplate = currentTemplateId.substring(
            currentTemplateId[2], 
            currentTemplateId.length - 1
        );
        $emit("setSelectedTemplate",currentTSelectedTemplate);
        $emit("changeCurrentRoute",currentTSelectedTemplate);
    };

</script>
<template>
    <div class="container">
        <div class="row">
            <div class="col-12 d-flex justify-content-center">
                <h1>Please select the email you wish to send.</h1>
                <hr/>
            </div>
        </div>
        <div class="row">
            <div class="col-sm-12 d-flex justify-content-center">
                <button id="setAnnouncementTemplate" class="btn btn-light app-button">Announcement Email</button>
            </div>
        </div>
        <div class="row">
            <div class="col-sm-12 d-flex justify-content-center">
                <button id="setClassRestartingTemplate" class="btn btn-light app-button">Class Restart Email</button>
            </div>
        </div>
        <div class="row">
            <div class="col-sm-12 d-flex justify-content-center">
                <button id="setNoClassTemplate" class="btn btn-light app-button">No Class Email</button>
            </div>
        </div>
        <div class="row">
            <div class="col-sm-12 d-flex justify-content-center">
                <button id="setCustomTemplate" class="btn btn-light app-button">Custom Email</button>
            </div>
        </div>
    </div>
</template>