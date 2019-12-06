<template>
  <q-layout view="hHh lpR fFf">
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
export default {
  name: "Modal",
  mounted() {
    console.log("Modal Layout mounted");
  }
};
</script>

<style></style>
