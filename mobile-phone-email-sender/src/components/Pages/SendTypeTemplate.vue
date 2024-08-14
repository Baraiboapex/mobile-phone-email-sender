<script setup>
    import {reactive} from "vue";

    const emittedEvents = defineEmits([
        "setTemplateParams",
        "setUsersToSendTo",
        "setSelectedTemplate",
        "setMode",
        "sendData"
    ]);

    const studentsSelected = defineModel();
    const listOfStudentsSelected = ref(false);
    
    const selectedType = reactive({
        mode:""
    });

    const selectListOfStudents = () => {
        listOfStudentsSelected.value = true;
    };

    const cancelListOfStudentsSelected = () => {
        listOfStudentsSelected.value = false;
    };

    const goToTemplateSelection = (event) => {
        const currentTemplateId = event.target.id;
        const currentTSelectedTemplate = currentTemplateId.substring(
            currentTemplateId[2], 
            currentTemplateId.length - 1
        );

        if(studentsSelected.value.length > 0 ){
            $emit("setUsersToSendTo", studentsSelected.value.join(","));
        }

        $emit("changeCurrentRoute",currentTSelectedTemplate);
    }

</script>
<template>
    <div class="container">
        <div class="row">
            <div class="col-12 d-flex justify-content-center">
                <h1>Please how you wish to send your emails</h1>
                <hr/>
            </div>
        </div>
        <div class="row">
            <div class="col-sm-12 d-flex justify-content-center">
                <button id="setSelectTemplate" @click="goToTemplateSelection" class="btn btn-light app-button">Send to selected students</button>
            </div>
        </div>
        <div class="row">
            <div class="col-sm-12 d-flex flex-column justify-content-center">
                <button @click="selectListOfStudents" class="btn btn-light app-button">Send to selected students</button>
                <div v-if="listOfStudentsSelected" class="container-fluid p-0">
                    <div class="form-group">
                        <label for="studentsToSelect d-flex flex-wrap">
                            Plese type in the list of students to select with each student email separated by a comma.
                        </label>
                        <input type="text" name="studentsToSelect" v-model="studentsSelected" class="textField"/>
                    </div>
                    <div class="d-flex flex-row align-items-center justify-content-start">
                        <button @click="cancelListOfStudentsSelected" class="btn btn-light app-button-small">Cancel</button>
                        <button @click="goToTemplateSelection" class="btn btn-light app-button-small">Continue</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>