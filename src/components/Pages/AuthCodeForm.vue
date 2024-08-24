<template>
    <div class="d-flex justify-content-center w-100">
        <div v-if="showAuthCodeForm">
            <div class="row mt-2 mb-2">
                <div class="col-12">
                    <div class="w-100 d-flex justify-content-center flex-column">
                        <h3> Please input the provided authentication code sent to your email</h3>
                        <div class="field-group">
                            <input :class="textValidationObject. twoFAAuthenticationCode.classValue + ' w-100 m-1 text-input'" v-model="formData.twoFAAuthenticationCode"/>
                            <span v-if="!textValidationObject. twoFAAuthenticationCode.isValid" class="validator">
                                {{ textValidationObject. twoFAAuthenticationCode.invalidText }}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-12 mt-2 mb-2">
                    <button  @click="submitAuthCode" class="btn btn-danger app-button" type="submit" value="Submit" id="newSubmissionButton">
                        Submit Code
                    </button>
                </div>
            </div>
        </div>
        <div v-else class="d-flex justify-content-center mb-4 w-100">
            <LoadingSign
                :showLoadingSign="showLoadingSign"
                loadingMessageText="Logging in..."
             />
            <SubmissionMessage
                :showSubmissionMessage="showSubmissionMessage"
                :submissionWasSuccessful="submissionWasSuccessful"
                :nameOfDataBeingSubmitted="nameOfDataBeingSubmitted"
                submissionButtonText="Try Again"
                @submission-button-clicked="resetForm"
            >
                <template #submissionSuccessIconImage="data">
                    <svg 
                    v-if="data.submissionSuccessful"
                        xmlns="http://www.w3.org/2000/svg" 
                        width="100" 
                        height="100" 
                        fill="currentColor" 
                        class="bi bi-check" 
                        viewBox="0 0 16 16"
                    >
                    <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425z"/>
                </svg>
                </template>
                <template #submissionFailureIconImage="data">
                    <svg v-if="!data.submissionSuccessful"
                        xmlns="http://www.w3.org/2000/svg" 
                        width="100" 
                        height="100" 
                        fill="currentColor" 
                        style="color:red;" 
                        class="bi bi-x" 
                        viewBox="0 0 16 16"
                    >
                    <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/>
                    </svg>
                </template>
            </SubmissionMessage>
        </div>
    </div>
</template>
<script setup>

import {reactive, computed  ,ref} from "vue";
import {CurrentPageStore, PageNames} from "../UI/Router/Routes.js";
import { AuthStore } from "../../store/auth.js";
import { makeSecureApiCall } from "../../Infra/httpSecurityBinder.js";
import api from "../../Infra/apiCompnent.js";

import {
    validateTextInput,
    validateAllTextFields,
    renderTextFieldValidation,
    textRulesNames,
    DEFAULT_TEXT_VALIDATION_OBJECT_VALUE
} from "../../helpers/inputValidation/inputValidator.js";

import LoadingSign from "../UI/Reusable/LoadingSign.vue";
import SubmissionMessage from "../UI/Reusable/SubmissionMessage.vue";

const VERIFICATION_CODE_BEING_SUBMITTED = "Login Data";

const store = CurrentPageStore();
const authStore = AuthStore();

const formData = reactive({
    twoFAAuthenticationCode:"",
});

const textValidationObject = reactive({
    twoFAAuthenticationCode: DEFAULT_TEXT_VALIDATION_OBJECT_VALUE,
});

const showLoadingSign = ref(false);
const showAuthCodeForm = ref(true);
const submissionWasSuccessful = ref(false);
const nameOfDataBeingSubmitted = ref("");

const showSubmissionMessage = computed(()=>!showLoadingSign.value);

const textFieldValidationList = [
    ()=>({
        fieldName:"twoFAAuthenticationCode",
        validator:()=>validateTextInput({
            rules:[
                textRulesNames.REQUIRED_RULE,
                textRulesNames.VALID_AUTH_CODE
            ],
            textValue:formData.twoFAAuthenticationCode
        }),
        invalidText:"Please input a valid 6-digit auth code"
    }),
];

const sendData = async ({
    api,
    dataToSend
}) => {
        return new Promise(async (resolve, reject)=>{
            try{
                await makeSecureApiCall({
                    apiObject:api,
                    callBody:JSON.stringify(dataToSend),
                    headers:{
                        "Content-Type": "application/json",
                    },
                    method:"post",
                    otherConfig:{
                        redirect: "follow",
                        mode:"no-cors"
                    },
                    secretObjectKey:"u"
                });
                
                dataToSend.loginMode = "ValidateUserAuthCodeExists";

                const loginValidationFieldsToSubmit = new URLSearchParams(dataToSend).toString();

                const validateAuthCode = await makeSecureApiCall({
                    urlParams:loginValidationFieldsToSubmit,
                    apiObject:api,
                    method:"get",
                    otherConfig:{
                        redirect: "follow"
                    },
                    secretObjectKey:"u" 
                });

                let authCodeIsValid = validateAuthCode.userIsAuthorized;

                console.log(authCodeIsValid);

                if(authCodeIsValid){
                    submissionWasSuccessful.value = true;
                    showAuthCodeForm.value = false;
                    showLoadingSign.value = false;
                }else{
                    throw new Error("Could not authroize user");
                }

                resolve();
            }catch(error){
                submissionWasSuccessful.value = false;
                showAuthCodeForm.value = false;
                showLoadingSign.value = false;
                reject();
            }
        });
    };

    const resetForm = ()=>{
        showAuthCodeForm.value = true;
        submissionWasSuccessful.value = false;
        showLoadingSign.value = false;
    }

    const sendDataFake = async () => {
        return new Promise((resolve)=>{
            setTimeout(()=>{
                submissionWasSuccessful.value = true;
                showAuthCodeForm.value = false;
                showLoadingSign.value = false;

                resolve()
            },1500);
        });
    };

    const submitAuthCode = async () => {
        try{
            const textInputIsValid = validateAllTextFields(textFieldValidationList);

            renderTextFieldValidation({
                validFieldsList:textInputIsValid.validFieldsList,
                invalidFieldsList:textInputIsValid.invalidFieldsList,
                valueToValidateFromValidatorObject:textValidationObject
            });

            if(textInputIsValid.inputsAreValid){
                nameOfDataBeingSubmitted.value = VERIFICATION_CODE_BEING_SUBMITTED;
                submissionWasSuccessful.value = false;
                showAuthCodeForm.value = false;
                showLoadingSign.value = true;

                await sendData({
                    api,
                    dataToSend:{
                        authCode:formData.twoFAAuthenticationCode,
                        userName:"matthewpbaileydesigns@gmail.com",
                        loginMode:"UserAuthCodeValidate"
                    }
                });

                store.updatePage(PageNames.SEND_TYPE_TEMPLATE_NAME);
                authStore.setIsLoggedInToTrue();
                authStore.setUserAuthorization(true);
            }
        }catch(err){
            console.log("ERROR :", err)
        }
    }

</script>