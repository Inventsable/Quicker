<template>
  <q-pull-to-refresh style="height: 100%;" @refresh="refresh">
    <q-page class="q-py-lg">
      <div style="width: 100%;">
        <QRCoder />
      </div>
    </q-page>
  </q-pull-to-refresh>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  components: {
    QRCoder: require("src/components/QRCoder.vue").default
  },
  data: () => ({}),
  computed: {
    ...mapGetters("settings", ["settings"]),
    app() {
      return this.$root.$children[0];
    }
  },
  async mounted() {
    // await this.app.runCS("init()");
  },
  methods: {
    ...mapActions("settings", ["setSize"]),
    refresh(done) {
      location.reload();
    }
  }
};
</script>

<style>
.main-page {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  flex-wrap: wrap;
}
</style>
