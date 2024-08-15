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
        announcement:""
    });

    const textValidationObject = reactive({
        subject: DEFAULT_TEXT_VALIDATION_OBJECT_VALUE,
        announcement: DEFAULT_TEXT_VALIDATION_OBJECT_VALUE
    });

    const textFieldValidationList = [
        ()=>({
            fieldName:"subject",
            validator:()=>validateTextInput({
                rule:textRulesNames.REQUIRED_RULE,
                textValue:formData.subject,
                invalidText:"Please input a subject"
            }),
            invalidText:"Please input a subject"
        }),
        ()=>({
            fieldName:"announcement",
            validator:()=>validateTextInput({
                rule:textRulesNames.REQUIRED_RULE,
                textValue:formData.announcement,
                invalidText:"Please input an announcement"
            }),
            invalidText:"Please input an announcement"
        }),
    ];

    const setTemplateData = (event)=>{
        formData[event.target.name] = event.target.value;
    };

    const submitEmail = ()=>{
        const textInputIsValid = validateAllTextFields(textFieldValidationList);

        renderTextFieldValidation({
            validFieldsList:textInputIsValid.validFieldsList,
            invalidFieldsList:textInputIsValid.invalidFieldsList,
            valueToValidateFromValidatorObject:textValidationObject
        });
        
        if(textInputIsValid.inputsAreValid){
            emittedEvents("setTemplateParams", formData);
            emittedEvents("sendData");
        }
    };
</script>
<template>
    <div class="container-fluid p-0">
        <div class="row">
            <div class="col-12">
                <form>
                    <div class="field-group mt-2 mb-2">
                        <label for="subject">Subject</label>
                        <input type="text" name="subject" :class="textValidationObject.subject.classValue + ' w-100 m-1 text-input'" @change="(event) => setTemplateData(event)"/>
                        <span v-if="!textValidationObject.subject.isValid" class="validator">
                            {{ textValidationObject.subject.invalidText }}
                        </span>
                    </div>
                    <div class="field-group mt-2 mb-2">
                        <label for="announcement">Announcement</label>
                        <input type="text" name="announcement" :class="textValidationObject.announcement.classValue + ' w-100 m-1 text-input'" @change="(event) => setTemplateData(event)"/>
                        <span v-if="!textValidationObject.announcement.isValid" class="validator">
                            {{ textValidationObject.announcement.invalidText }}
                        </span>
                    </div>
                </form>
            </div>
        </div>
        <div class="row mt-4 mb-4">
            <div class="col-12">
                <button @click="submitEmail" class="btn btn-light app-button">
                    Send Email
                </button>
            </div>
        </div>
    </div>
</template>