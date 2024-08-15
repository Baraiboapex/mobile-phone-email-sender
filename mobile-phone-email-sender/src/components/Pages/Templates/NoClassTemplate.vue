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

    const formData = reactive({
        subject:"",
        reason:""
    });

    const textValidationObject = reactive({
        subject: DEFAULT_TEXT_VALIDATION_OBJECT_VALUE,
        reason: DEFAULT_TEXT_VALIDATION_OBJECT_VALUE
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
                    <div class="form-group mt-2 mb-2">
                        <label for="subject">Subject</label>
                        <input type="text" name="subject" :class="textValidationObject.subject.classValue + ' w-100 m-1 text-input'" @change="(event) => setTemplateData(event)"/>
                        <span v-if="textValidationObject.subject.isValid" class="validator">
                            {{ textValidationObject.subject.invalidText }}
                        </span>
                    </div>
                    <div class="form-groupmt-2 mb-2 ">
                        <label for="reason">Reason For No Class</label>
                        <input type="text" name="reason" :class="textValidationObject.reason.classValue + ' w-100 m-1 text-input'" @change="(event) => setTemplateData(event)"/>
                        <span v-if="textValidationObject.reason.isValid" class="validator">
                            {{ textValidationObject.reason.invalidText }}
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