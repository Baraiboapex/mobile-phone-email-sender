<template>
    <section v-if="showSubmissionMessage" class="message message-box w-100" id="submissionMessage">
        <h3 id="submissionMessageText">{{ submissionMessageText }}</h3>
        <h1 id="submissionIconImage">
            <slot name="submissionSuccessIconImage" :submissionSuccessful="submissionWasSuccessful"></slot>
            <slot name="submissionFailureIconImage" :submissionSuccessful="submissionWasSuccessful"></slot>
        </h1>
        <button @click="$emit('submissionButtonClicked')" class="btn btn-danger app-button" type="submit" value="Submit" id="newSubmissionButton">
            {{ submissionButtonText }}
        </button>
    </section>
</template>
<script setup>
    import { computed } from "vue";

    const props = defineProps({
        submissionMessageText:String,
        nameOfDataBeingSubmitted:String,
        submissionButtonText:String,
        showSubmissionMessage:Boolean,
        submissionWasSuccessful:Boolean
    });

    const submissionMessageText = computed(()=>{
        return props.submissionWasSuccessful ? 
            `Data for ${props.nameOfDataBeingSubmitted} was successfully submitted` 
            : 
            `Could not submit data for ${props.nameOfDataBeingSubmitted}`
    });

    defineEmits([
        "submissionButtonClicked"
    ]);
</script>