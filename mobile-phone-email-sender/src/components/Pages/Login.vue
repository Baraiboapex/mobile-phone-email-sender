<template>
    <div class="d-flex justify-content-center w-100">
        <form v-if="showLoginForm" class="w-100">
            <div class="row">
                <div class="col-12">
                    <div class="field-group mt-2 mb-2">
                        <label for="userName">Username</label>
                        <input type="text" name="userName" :class="textValidationObject.userName.classValue + ' w-100 m-1 text-input'" @change="(event) => setTemplateData(event)"/>
                        <span v-if="!textValidationObject.userName.isValid" class="validator">
                            {{ textValidationObject.userName.invalidText }}
                        </span>
                    </div>
                    <div class="field-group mt-2 mb-2">
                        <label for="password">Password</label>
                        <input type="password" name="password" :class="textValidationObject.password.classValue + ' w-100 m-1 text-input'" @change="(event) => setTemplateData(event)"/>
                        <span v-if="!textValidationObject.password.isValid" class="validator">
                            {{ textValidationObject.password.invalidText }}
                        </span>
                    </div>
                </div>
            </div>
            <div class="row pb-4">
                <div class="col-12">
                    <button class="btn btn-danger app-button-small" @click="loginToApp">Login</button>
                </div>
            </div>
        </form>
        <div v-else class="d-flex justify-content-center mb-4 w-100">
            <LoadingSign
                :showLoadingSign="showLoadingSign"
                loadingMessageText="Sending verification code..."
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
    
    import {
        validateTextInput,
        validateAllTextFields,
        renderTextFieldValidation,
        textRulesNames,
        DEFAULT_TEXT_VALIDATION_OBJECT_VALUE
    } from "../../helpers/inputValidation/inputValidator.js";

    import LoadingSign from "../UI/Reusable/LoadingSign.vue";
    import SubmissionMessage from "../UI/Reusable/SubmissionMessage.vue";

    const LOGIN_DATA_BEING_SUBMITTED = "Login";

    const store = CurrentPageStore();
    const authStore = AuthStore();

    const formData = reactive({
        userName:"",
        password:""
    });
    
    const textValidationObject = reactive({
        userName: DEFAULT_TEXT_VALIDATION_OBJECT_VALUE,
        password: DEFAULT_TEXT_VALIDATION_OBJECT_VALUE
    });
    
    const showLoadingSign = ref(false);
    const submissionWasSuccessful = ref(false);
    const showLoginForm = ref(true);
    const nameOfDataBeingSubmitted = ref("");
    
    const showSubmissionMessage = computed(()=>!showLoadingSign.value);

    const textFieldValidationList = [
        ()=>({
            fieldName:"userName",
            validator:()=>validateTextInput({
                rules:[
                    textRulesNames.REQUIRED_RULE
                ],
                textValue:formData.userName
            }),
            invalidText:"Please input your userName"
        }),
        ()=>({
            fieldName:"password",
            validator:()=>validateTextInput({
                rules:[
                    textRulesNames.REQUIRED_RULE
                ],
                textValue:formData.password,
            }),
            invalidText:"Please input your password"
        }),
    ];

    const setTemplateData = (event)=>{
        formData[event.target.name] = event.target.value;
    };
    
    const sendData = async ({
        dataToSend
    }) => {
        return new Promise(async (resolve, reject)=>{
            try{
                const loginData = await authStore.login(dataToSend);

                submissionWasSuccessful.value = true;
                showLoginForm.value = false;
                showLoadingSign.value = false;

                resolve(loginData);
            }catch(err){
                submissionWasSuccessful.value = false;
                showLoginForm.value = false;
                showLoadingSign.value = false;
                reject(err);
                throw new Error(err);
            }
        }) 
    };

    const sendDataFake = async () => {
        return new Promise((resolve)=>{
            setTimeout(()=>{
                submissionWasSuccessful.value = true;
                showLoginForm.value = false;
                showLoadingSign.value = false;

                resolve()
            },1500);
        });
    };

    const resetForm = ()=>{
        showLoginForm.value = true;
        submissionWasSuccessful.value = false;
        showLoadingSign.value = false;
        showSubmissionMessage.value = false;
    }

    const loginToApp = async (e)=>{
        try{
            e.preventDefault();
            const textInputIsValid = validateAllTextFields(textFieldValidationList);

            renderTextFieldValidation({
                validFieldsList:textInputIsValid.validFieldsList,
                invalidFieldsList:textInputIsValid.invalidFieldsList,
                valueToValidateFromValidatorObject:textValidationObject
            });
            
            if(textInputIsValid.inputsAreValid){
                
                showLoadingSign.value = true;
                showLoginForm.value = false;
                submissionWasSuccessful.value = false;
                nameOfDataBeingSubmitted.value = LOGIN_DATA_BEING_SUBMITTED;

                //await sendDataFake();
                await sendData({
                    dataToSend:{
                        userName:formData.userName,
                        password:formData.password,
                        applicationName:"Mobile Emailer",
                        loginMode:"UserLogin"
                    }
                });

                if(authStore.getIsLoggedIn){
                    store.updatePageWithoutNav(PageNames.AUTH_CODE_PAGE_NAME);
                }
            }
        }catch(err){
            console.log("Could not login :"+err);
        }
    };
</script>



