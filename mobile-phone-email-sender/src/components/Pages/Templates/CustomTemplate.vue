<script setup>
    import {reactive, computed, inject} from "vue";
    import {
        validateTextInput,
        validateAllTextFields,
        renderTextFieldValidation,
        textRulesNames,
        DEFAULT_TEXT_VALIDATION_OBJECT_VALUE
    } from "../../../Infra/inputValidator.js";

    const {
        setTemplateParams,
        sendData
    } = inject("dataUpdaters");

    const textFieldValidationList = [
        ()=>({
            fieldName:"header",
            validator:()=>validateTextInput({
                rule:textRulesNames.REQUIRED_RULE,
                textValue:formData.customMessageHeaderValue,
                invalidText:"Please input a message header/subject"
            })
        }),
        ()=>({
            fieldName:"message",
            validator:()=>validateTextInput({
                rule:textRulesNames.REQUIRED_RULE,
                textValue:formData.customMessageValue,
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
            setTemplateParams(formData);
            sendData();
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
                        <input type="text" name="customMessageHeaderValue" :class="textValidationObject.customMessageValue.classValue + ' w-100 m-1 text-input'" @change="(event) => setTemplateData(event)"/>
                        <span v-if="textValidationObject.customMessageHeaderValue.isValid" class="validator">
                            {{ textValidationObject.customMessageHeaderValue.invalidText }}
                        </span>
                    </div>
                    <div class="form-group">
                        <label for="message">Message</label>
                        <textarea type="text" name="customMessageValue" :class="textValidationObject.customMessageValue.classValue + ' w-100 m-1 text-input'" @change="(event) => setTemplateData(event)"></textarea>
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