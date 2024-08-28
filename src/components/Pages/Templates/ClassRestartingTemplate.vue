<script setup>
   import {reactive, computed} from "vue";
   import {
      formatDateTimeAsPhrase,
      formatTime,
      formatMonth,
      formatDay
    } from "../../../helpers/formatHelpers/dateForm";
    
   const emittedEvents = defineEmits([
        "setTemplateParams",
        "setUsersToSendTo",
        "setSelectedTemplate",
        "setMode",
        "sendData"
    ]);

    const formData = reactive({
         date:new Date(),
         subject:"",
         day:null,
         month:null,
         year:null,
         time:null
    });

    const formatterObject = {
      day:(val)=>formatDay(val),
      time:(val)=>formatTime(val),
      month:(val)=>formatYear(val)
    };

    const setTemplateData = (event)=>{
      const hasFormattingEntry = formatterObject[event.target.name];

      if(hasFormattingEntry){
         formData[event.target.name] = formatterObject[event.target.name](event.target.value);
      }else{
         formData[event.target.name] = event.target.name;
      }
        
    };

    const submitEmail = ()=>{
         const formattedDate = formData.day + "/" + format.month + "/" + format.year;

         const formatToDateAsPhraseInput = {
            dateToFormat:formattedDate, 
            timeToFormat:formData.time, 
            joiningWord:"at"
         };

         const dateData = {
            subject:formData.subject,
            date:formatDateTimeAsPhrase(formatToDateAsPhraseInput)
         };

        $emit("setTemplateParams", dateData);
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
                        <input type="text" name="subject" class="" @change="(event) => setTemplateData(event)"/>
                    </div>
                    <div class="form-group">
                        <label for="subject">Date</label>
                        <input type="text" name="date" @change="(event) => setTemplateData(event)"/>
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