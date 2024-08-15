<script setup>
    import {reactive, ref, inject} from "vue";
    import {
        validateTextInput,
        validateAllTextFields,
        renderTextFieldValidation,
        textRulesNames,
        DEFAULT_TEXT_VALIDATION_OBJECT_VALUE
    } from "../../Infra/inputValidator.js";

    const {
        setUsersToSendTo,
        setMode
    } = inject("dataUpdaters");

    const emittedEvents = defineEmits([
        "changeCurrentRoute"
    ]);

    const studentsSelected = ref("");
    const listOfStudentsSelected = ref(false);
    const textFieldIsValid = ref(false);

    const textFieldValidationList = [
        ()=>({
            fieldName:"studentsToSelect",
            validator:()=>validateTextInput({
                rule:textRulesNames.REQUIRED_RULE,
                textValue:studentsSelected.value,
                invalidText:"Please input student emails to send to"
            }),
            invalidText:"Please input student emails to send to"
        })
    ];

    const textValidationObject = reactive({
        studentsToSelect: DEFAULT_TEXT_VALIDATION_OBJECT_VALUE
    });

    const selectListOfStudents = () => {
        listOfStudentsSelected.value = true;
    };

    const cancelListOfStudentsSelected = () => {
        listOfStudentsSelected.value = false;
        textValidationObject.studentsToSelect = DEFAULT_TEXT_VALIDATION_OBJECT_VALUE;
    };

    const goToTemplateSelection = (event) => {
        const currentTemplateName = event.target.id;
        const currentMode = event.target.name;
        const currentSelectedTemplate = currentTemplateName.substring(
            3, 
            currentTemplateName.length
        );

        console.log(currentSelectedTemplate);

        const textInputIsValid = validateAllTextFields(textFieldValidationList);

        renderTextFieldValidation({
            validFieldsList:textInputIsValid.validFieldsList,
            invalidFieldsList:textInputIsValid.invalidFieldsList,
            valueToValidateFromValidatorObject:textValidationObject
        });

        let students = [];

        if(students.includes(",")){
            students = studentsSelected.value.join(",")
        }else{
            students.push(studentsSelected.value);
        }

        if(listOfStudentsSelected.value){
            if(textInputIsValid.inputsAreValid){
                setMode(currentMode);
                setUsersToSendTo(students);
                emittedEvents("changeCurrentRoute",currentSelectedTemplate);
            }
        }else{
            setMode(currentMode);
            emittedEvents("changeCurrentRoute",currentSelectedTemplate);
        }
    }

</script>
<template>
    <div class="container">
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
                            <label for="studentsToSelect d-flex flex-wrap m-1">
                                Please type in the list of students to select with each student email separated by a comma.
                            </label>
                            <textarea type="text" :class="textValidationObject.studentsToSelect.classValue + ' w-100 m-1 text-input'" name="studentsToSelect" v-model="studentsSelected"></textarea>
                            <span v-if="!textValidationObject.studentsToSelect.isValid" class="validator m-1">
                                {{ textValidationObject.studentsToSelect.invalidText }}
                            </span>
                        </div>
                        <div class="d-flex flex-row align-items-center justify-content-start m-1">
                            <button @click="cancelListOfStudentsSelected" class="btn btn-danger app-button-small cancel">Cancel</button>
                            <span>&nbsp;&nbsp;</span>
                            <button id="setSelectTemplate" name="SendEmailsToSelected" @click="goToTemplateSelection" class="btn btn-danger app-button-small">Continue</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>