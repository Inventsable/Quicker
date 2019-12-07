<template>
  <div class="q-pa-lg typewrap">
    <q-select
      v-model="model"
      dense
      :options="models"
      label="Format"
      style="width: 80px"
    />
    <q-select
      v-show="model && hasVariant"
      v-model="variant"
      :options="getVariant"
      dense
      label="#"
      style="margin-left: 10px;width: 60px"
    />
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  data: () => ({
    models: ["EAN", "UPC", "CODE", "ITF", "MSI", "pharmacode", "codabar"],
    variants: {
      EAN: ["13", "8", "5", "2"],
      UPC: [],
      CODE: ["128A", "128B", "128C", "39"],
      ITF: ["14"],
      MSI: ["10", "11", "1010", "1110"],
      pharmacode: [],
      codabar: []
    }
  }),
  computed: {
    ...mapGetters("settings", ["settings"]),
    model: {
      get() {
        return this.settings.model;
      },
      set(val) {
        this.variant = this.getFirstVariant(val);
        return this.setModel(val);
      }
    },
    variant: {
      get() {
        return this.settings.variant;
      },
      set(val) {
        return this.setVariant(val);
      }
    },
    hasVariant() {
      return this.model && this.variants[this.model].length;
    },
    getVariant() {
      return this.variants[this.model];
    }
  },
  watch: {
    model(val) {
      this.variant = this.variant ? this.variant : this.getVariant[0];
    }
  },
  methods: {
    ...mapActions("settings", ["setVariant", "setModel"]),
    getFirstVariant(name) {
      return this.variants[name].length ? this.variants[name][0] : "";
    }
  }
};
</script>

<style>
.typewrap {
  display: flex;
}
</style>
