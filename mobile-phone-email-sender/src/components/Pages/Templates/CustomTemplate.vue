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

    const textFieldValidationList = [
        ()=>({
            fieldName:"header",
            validator:validateTextInput({
                rule:textRulesNames.REQUIRED_RULE,
                textValue:studentsSelected.value,
                invalidText:"Please input a message header/subject"
            })
        }),
        ()=>({
            fieldName:"message",
            validator:validateTextInput({
                rule:textRulesNames.REQUIRED_RULE,
                textValue:studentsSelected.value,
                invalidText:"Please type a message to be used in your email"
            })
        })
    ];

    const textValidationObject = reactive({
        customMessageHeaderValue: DEFAULT_TEXT_VALIDATION_OBJECT_VALUE,
        customMessageValue: DEFAULT_TEXT_VALIDATION_OBJECT_VALUE
    });

    const formData = reactive({
        customMessageHeaderValue:"",
        customMessageValue:""
    });

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

        if(textInputIsValid){
            $emit("setTemplateParams", formData);
            $emit("sendData");
        }
    };
</script>
<template>
    <div class="container-fluid p-0">
        <div class="row">
            <div class="col-12">
                <form>
                    <div class="form-group">
                        <label for="header">Subject</label>
                        <input type="text" name="customMessageHeaderValuer" :class="textValidationObject.customMessageValue.classValue" @change="(event) => setTemplateData(event)"/>
                        <span v-if="textValidationObject.customMessageHeaderValue.isValid" class="validator">
                            {{ textValidationObject.customMessageHeaderValue.invalidText }}
                        </span>
                    </div>
                    <div class="form-group">
                        <label for="message">Message</label>
                        <textarea type="text" name="customMessageValue" :class="textValidationObject.customMessageValue.classValue" @change="(event) => setTemplateData(event)"></textarea>
                        <span v-if="textValidationObject.customMessageValue.isValid" class="validator">
                            {{ textValidationObject.customMessageValue.invalidText }}
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