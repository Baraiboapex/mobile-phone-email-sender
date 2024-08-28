<template>
    <div class="container w-100">
        <div class="row mt-4">
            <div class="col-12">
                <div class="w-100 d-flex justify-content-center align-items-center">
                    <h3>Please describe how you wish to send your emails</h3>
                    <hr/>
                </div>
            </div>
        </div>
        <div class="row mt-2">
            <div class="col-12">
                <button id="setSelectTemplate" @click="goToTemplateSelection" name="SendEmailsToAll" class="btn btn-light app-button w-100">Send to all students</button>
            </div>
        </div>
        <div class="row mt-2 mb-4">
            <div class="col-sm-12">
                <button @click="selectListOfStudents" class="btn btn-light app-button">Send to selected students</button>
                <div class="w-100 d-flex flex-column justify-content-center align-items-center">
                    <div v-if="listOfStudentsSelected" class="container-fluid p-0 mt-4">
                        <div class="field-group">
                            <SearchableList
                                :listItems="listOfStudentEmails.emails"
                                :searchableField = "SEARCHABLE_LIST_SEARCH_FIELD"
                                :selectableField="SEARCHABLE_LIST_SELECTION_FIELD"
                                :listLabel="SEARCHABLE_LIST_LABEL"
                                :dataLoadingMessage="LOADING_LIST_MESSAGE"
                                @list-items-updated="updateStudentList"
                            />
                        </div>
                        <div class="d-flex flex-row align-items-center justify-content-start m-1">
                            <button @click="cancelListOfStudentsSelected" class="btn btn-danger app-button-small cancel">Cancel</button>
                            <span>&nbsp;&nbsp;</span>
                            <button id="setSelectTemplate" name="SendEmailsToSelected" :disabled="checkCanContinue" @click="goToTemplateSelection" class="btn btn-danger app-button-small">Continue</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
    import {reactive, ref, inject, computed} from "vue";
    import {
        CurrentPageStore,
    } from "../UI/Router/Routes.js"
    import {
        validateTextInput,
        validateAllTextFields,
        renderTextFieldValidation,
        textRulesNames,
        DEFAULT_TEXT_VALIDATION_OBJECT_VALUE
    } from "../../helpers/inputValidation/inputValidator.js";

    import SearchableList from "../UI/Reusable/SearchableList.vue";

    import {makeSecureApiCall} from "../../Infra/httpSecurityBinder.js";
    import api from "../../Infra/apiCompnent.js";

    const {
        setUsersToSendTo,
        setMode
    } = inject("dataUpdaters");

    const store = CurrentPageStore();

    const emittedEvents = defineEmits([
        "changeCurrentRoute"
    ]);

    const studentsSelected = ref("");
    const listOfStudentsSelected = ref(false);
    const listOfStudentEmails = reactive({
        emails:[]
    });

    const SEARCHABLE_LIST_SEARCH_FIELD = ref("name");
    const SEARCHABLE_LIST_SELECTION_FIELD = ref("emailAddress");
    const SEARCHABLE_LIST_LABEL = ref("Student Emails");
    const LOADING_LIST_MESSAGE = ref("Loading Data");

    const checkCanContinue = computed(()=>!(studentsSelected.value !== ""));

    const getDataForEmailList = async ({
        api,
    }) => {
        const dataToGet = await makeSecureApiCall({
            urlParams:new URLSearchParams({studentDataToGet:"Email"}).toString(),
            apiObject:api,
            method:"get",
            otherConfig:{
                redirect: "follow"
            },
            secretObjectKey:"u3" 
        }); 

        listOfStudentEmails.emails = dataToGet;
    };

    const updateStudentList = (selectedStudents) => {
        let studentsString = selectedStudents.map((student)=>student.emailAddress).join(", ");
        studentsSelected.value = studentsString;
    }

    const selectListOfStudents = () => {
        getDataForEmailList({
            api
        });
        listOfStudentsSelected.value = true;
    };

    const cancelListOfStudentsSelected = () => {
        listOfStudentsSelected.value = false;
    };

    const goToTemplateSelection = (event) => {
        const currentTemplateName = event.target.id;
        const currentMode = event.target.name;
        const currentSelectedTemplate = currentTemplateName.substring(
            3, 
            currentTemplateName.length
        );

        let students = [];

        if(studentsSelected.value.includes(", ")){
            students = studentsSelected.value.split(", ")
        }else{
            students.push(studentsSelected.value);
        }

        if(listOfStudentsSelected.value){
            setMode(currentMode);
            setUsersToSendTo(students);
            emittedEvents("changeCurrentRoute", currentSelectedTemplate);
        }else{
            setMode(currentMode);
            emittedEvents("changeCurrentRoute", currentSelectedTemplate);
        }
    }

</script>