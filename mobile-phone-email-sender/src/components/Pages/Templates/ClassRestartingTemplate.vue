<script setup>
   import {reactive, computed, inject} from "vue";
   import {
      formatDateTimeAsPhrase
    } from "../../../helpers/formatHelpers/dateFormatHelper.js";

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
         date:"",
         subject:"",
         day:null,
         month:null,
         year:null,
         time:null
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
            fieldName:"day",
            validator:()=>validateTextInput({
                rule:textRulesNames.REQUIRED_RULE,
                textValue:formData.day,
                invalidText:"Please input a day in DD format"
            }),
            invalidText:"Please input a day in DD format"
        }),
        ()=>({
            fieldName:"month",
            validator:()=>validateTextInput({
                rule:textRulesNames.REQUIRED_RULE,
                textValue:formData.month,
                invalidText:"Please input a month in MM format"
            }),
            invalidText:"Please input a month in MM format"
        }),
        ()=>({
            fieldName:"year",
            validator:()=>validateTextInput({
                rule:textRulesNames.REQUIRED_RULE,
                textValue:formData.year,
                invalidText:"Please input a yeat in YYYY format"
            }),
            invalidText:"Please input a yeat in YYYY format"
        }),
        ()=>({
            fieldName:"time",
            validator:()=>validateTextInput({
                rule:textRulesNames.REQUIRED_RULE,
                textValue:formData.time,
                invalidText:"Please input a time in HH:MM format"
            }),
            invalidText:"Please input a time in HH:MM format"
        }),
    ];

    const textValidationObject = reactive({
        subject: DEFAULT_TEXT_VALIDATION_OBJECT_VALUE,
        day: DEFAULT_TEXT_VALIDATION_OBJECT_VALUE,
        month: DEFAULT_TEXT_VALIDATION_OBJECT_VALUE,
        year: DEFAULT_TEXT_VALIDATION_OBJECT_VALUE,
        time: DEFAULT_TEXT_VALIDATION_OBJECT_VALUE,
    });

    const setTemplateData = (event)=>{
      formData[event.target.name] = event.target.value;
    };

    const submitEmail = ()=>{
         const formattedDate = formData.month + "/" + formData.day + "/" + formData.year;

         const formatToDateAsPhraseInput = {
            dateToFormat:formattedDate, 
            timeToFormat:formData.time, 
            joiningWord:"at"
         };
         
         console.log(formatToDateAsPhraseInput);

        const dateData = {
            subject:formData.subject,
            date:formatDateTimeAsPhrase(formatToDateAsPhraseInput)
        };

        const textInputIsValid = validateAllTextFields(textFieldValidationList);

        renderTextFieldValidation({
            validFieldsList:textInputIsValid.validFieldsList,
            invalidFieldsList:textInputIsValid.invalidFieldsList,
            valueToValidateFromValidatorObject:textValidationObject
        });

        if(textInputIsValid.inputsAreValid){
            setTemplateParams(dateData);
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
                        <span v-if="!textValidationObject.subject.isValid" class="validator">
                            {{ textValidationObject.subject.invalidText }}
                        </span>
                    </div>
                    <div class="form-group mt-2 mb-2">
                        <label for="day">Day (input as DD)</label>
                        <input type="text" name="day" :class="textValidationObject.day.classValue + ' w-100 m-1 text-input'" @change="(event) => setTemplateData(event)"/>
                        <span v-if="!textValidationObject.day.isValid" class="validator">
                            {{ textValidationObject.day.invalidText }}
                        </span>
                    </div>
                    <div class="form-group mt-2 mb-2">
                        <label for="month">Month (input as MM)</label>
                        <input type="text" name="month" :class="textValidationObject.month.classValue + ' w-100 m-1 text-input'" @change="(event) => setTemplateData(event)"/>
                        <span v-if="!textValidationObject.month.isValid" class="validator">
                            {{ textValidationObject.month.invalidText }}
                        </span>
                    </div>
                    <div class="form-group mt-2 mb-2">
                        <label for="year">Year (input as YYYY)</label>
                        <input type="text" name="year" :class="textValidationObject.year.classValue + ' w-100 m-1 text-input'" @change="(event) => setTemplateData(event)"/>
                        <span v-if="!textValidationObject.year.isValid" class="validator">
                            {{ textValidationObject.year.invalidText }}
                        </span>
                    </div>
                    <div class="form-group mt-2 mb-2">
                        <label for="time">Time (input as h:mm am/pm)</label>
                        <input type="text" name="time" :class="textValidationObject.time.classValue + ' w-100 m-1 text-input'" @change="(event) => setTemplateData(event)"/>
                        <span v-if="!textValidationObject.time.isValid" class="validator">
                            {{ textValidationObject.time.invalidText }}
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