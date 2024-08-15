<script setup>
    import {reactive, computed} from "vue";
    import {
        validateTextInput,
        validateAllTextFields,
        renderTextFieldValidation,
        textRulesNames,
        DEFAULT_TEXT_VALIDATION_OBJECT_VALUE
    } from "../../../Infra/inputValidator.js";

    const emittedEvents = defineEmits([
        "setTemplateParams",
        "setUsersToSendTo",
        "setSelectedTemplate",
        "setMode",
        "sendData"
    ]);

    const formData = reactive({
        subject:"",
        reason:""
    });

    const textFieldValidationList = [
        ()=>({
            fieldName:"subject",
            validator:validateTextInput({
                rule:textRulesNames.REQUIRED_RULE,
                textValue:studentsSelected.value,
                invalidText:"Please input a template type"
            })
        }),
        ()=>({
            fieldName:"reason",
            validator:validateTextInput({
                rule:textRulesNames.REQUIRED_RULE,
                textValue:studentsSelected.value,
                invalidText:"Please input a template type"
            })
        }),
    ];

    const textValidationObject = reactive({
        subject: DEFAULT_TEXT_VALIDATION_OBJECT_VALUE,
        reason: DEFAULT_TEXT_VALIDATION_OBJECT_VALUE
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
                        <input type="text" name="subject" :class="textValidationObject.subject.classValue" @change="(event) => setTemplateData(event)"/>
                        <span v-if="textValidationObject.subject.isValid" class="validator">
                            {{ textValidationObject.subject.invalidText }}
                        </span>
                    </div>
                    <div class="form-group">
                        <label for="reason">Reason For No Class</label>
                        <input type="text" name="reason" :class="textValidationObject.reason.classValue" @change="(event) => setTemplateData(event)"/>
                        <span v-if="textValidationObject.reason.isValid" class="validator">
                            {{ textValidationObject.reason.invalidText }}
                        </span>
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