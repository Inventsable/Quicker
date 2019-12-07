<template>
  <q-input
    v-model="text"
    label="Write value here"
    class="row q-px-lg"
    :spellcheck="false"
    @keyup.enter="$emit('submitted')"
  >
    <template v-if="text.length" v-slot:append>
      <q-icon name="mdi-close" class="cursor-pointer" @click="text = ''" />
    </template>
  </q-input>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

export default {
  computed: {
    ...mapGetters("settings", ["settings"]),
    text: {
      get() {
        return this.settings.text;
      },
      set(val) {
        this.setText(val);
      }
    }
  },
  methods: {
    ...mapActions("settings", ["setText"])
  }
};
</script>

<style></style>
