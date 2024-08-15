<script setup>
  import Router from "./components/UI/Router/Router.vue";
  import DataContainer from "./components/UI/DataContainer.vue";
</script>
<template>
  <div class="background">
    <div class="container-fluid">
      <div class="row">
        <div class="col-12">
          <div class="d-flex justify-content-center">
          <div class="form">
            <div class="logo mb-4"></div>
            <DataContainer>
              <template #data="data">
                <Router
                  :data="data.dataToSend"
                />
              </template>
            </DataContainer>
          </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
