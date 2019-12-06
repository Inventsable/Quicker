<template>
  <q-tooltip anchor="top middle" self="bottom middle" :offset="[10, 10]">{{msg}}</q-tooltip>
</template>

<script>
export default {
  name: "tooltipper",
  props: {
    msg: String
  }
};
</script>