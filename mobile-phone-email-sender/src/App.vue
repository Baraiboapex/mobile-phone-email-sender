<script setup>
  import Router from "./components/UI/Router/Router.vue";
  import DataContainer from "./components/UI/DataContainer.vue";
</script>
<template>
  <div class="background">
    <div class="container-fluid">
      <div class="row">
        <div class="col-12">
          <DataContainer>
            <template :data="data">
              <Router
                :data="data.dataToSend"
                @set-template-params="data.setTemplateParams"
                @set-users-to-send-to="data.setUsersToSendTo"
                @set-selected-template="data.setSelectedTemplate"
                @set-mode="data.setMode"
                @send-data="data.sendData"
              />
            </template>
          </DataContainer>
        </div>
      </div>
    </div>
  </div>
</template>
