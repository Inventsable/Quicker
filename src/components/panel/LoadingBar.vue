<template>
  <q-ajax-bar ref="bar" :position="position" size="6px" skip-hijack />
</template>

<script>
export default {
  props: {
    position: {
      type: String,
      default: "bottom"
    }
  },
  computed: {
    app() {
      return this.$root.$children[0];
    }
  },
  mounted() {
    this.app.loadingBar = this;
  },
  methods: {
    // we manually trigger it (this is not needed if we
    // don't skip Ajax calls hijacking)
    trigger() {
      const bar = this.$refs.bar;

      bar.start();
      // bar.increment(50);
      this.timer = setTimeout(() => {
        if (this.$refs.bar) {
          this.$refs.bar.stop();
        }
      }, Math.random() * 3000 + 1000);
    }
  }
};
</script>

<style scoped>
.bg-red {
  background: var(--color-selection) !important;
}
</style>
