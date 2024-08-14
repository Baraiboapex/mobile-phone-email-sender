<script setup>
    import {reactive, computed} from "vue";
    const emittedEvents = defineEmits([
        "setTemplateParams",
        "setUsersToSendTo",
        "setSelectedTemplate",
        "setMode",
        "sendData"
    ]);

    const formData = reactive({
        reason:"",
        subject:""
    });

    const setTemplateData = (event)=>{
        formData[event.target.name] = event.target.value;
    };

    const submitEmail = ()=>{
        $emit("setTemplateParams", formData);
        $emit("sendData");
    };
    
</script>
<template>
    <div class="container-fluid p-0">
        <div class="row">
            <div class="col-12">
                <form>
                    <div class="form-group">
                        <label for="subject">Subject</label>
                        <input type="text" name="subject" class="" @change="(event) => setTemplateData(event)"/>
                    </div>
                    <div class="form-group">
                        <label for="subject">Reason For No Class</label>
                        <input type="text" name="reason" @change="(event) => setTemplateData(event)"/>
                    </div>
                </form>
            </div>
        </div>
        <div class="row">
            <button @click="submitEmail" class="btn btn-light app-button">
                Send Email
            </button>
        </div>
    </div>
</template>