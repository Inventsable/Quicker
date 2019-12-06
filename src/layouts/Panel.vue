<template>
  <q-layout view="hHh lpR fFf">
    <q-header>
      <q-bar>
        <q-btn dense flat @click="getColors" :icon="`mdi-palette`">
          <tooltipper msg="getColors from AI" />
        </q-btn>
        <q-input
          v-model="size"
          class="q-ml-lg"
          style="width: 80px;"
          suffix="px"
          type="number"
          dense
          borderless
        />
        <q-space></q-space>
        <q-btn dense flat @click="openFile" :icon="`mdi-send`">
          <tooltipper msg="Send to AI" />
        </q-btn>
      </q-bar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { evalScript } from "cluecumber";
import spy from "cep-spy";
const fs = require("fs");

export default {
  name: "MyLayout",
  components: {
    drawer: require("components/panel/Drawer.vue").default,
    tooltipper: require("components/panel/tooltipper.vue").default
  },
  data: () => ({}),
  mounted() {
    console.log("Panel");
  },
  computed: {
    ...mapGetters("settings", ["settings"]),
    app() {
      return this.$root.$children[0];
    },
    text() {
      return this.settings.text;
    },
    size: {
      get() {
        return this.settings.size;
      },
      set(val) {
        this.setSize(val);
      }
    },
    FG: {
      get() {
        return this.settings.FG;
      },
      set(val) {
        this.setFG(val);
      }
    },
    BG: {
      get() {
        return this.settings.BG;
      },
      set(val) {
        this.setBG(val);
      }
    }
  },
  methods: {
    ...mapActions("settings", ["setText", "setFG", "setBG", "setSize"]),
    async getColors() {
      let result = await evalScript("getColors()");
      this.convertColors(result);
    },
    convertColors(data) {
      Object.keys(data).forEach(color => {
        let vals = Object.keys(data[color]).map(key => {
          return data[color][key];
        });
        if (vals.length < 4) vals = [35, 31, 32, 1];
        this[color.toUpperCase()] = this.rgbaToHex(vals);
      });
    },
    rgbaToHex(val) {
      val.pop();
      return `#${val
        .map(c => {
          c = c < 256 ? Math.abs(c).toString(16) : 0;
          return c.length < 2 ? `0${c}` : c;
        })
        .join("")}`;
    },
    openFile() {
      let dataURL = document.getElementById("mirror").toDataURL();
      var buf = new Buffer(
        dataURL.replace(/^data:image\/\w+;base64,/, ""),
        "base64"
      );
      let path = `${spy.path.root}/temp/${this.text.replace(/\s/gm, "-")}.png`;
      fs.writeFileSync(path, buf);
      evalScript(`placeImage('${path}')`);
    }
  }
};
</script>

<style>
.q-layout__section--marginal {
  user-select: none;
  cursor: default;
  background-color: var(--color-header-border);
}

@media screen and (max-width: 260px) {
  .toolbar-title {
    display: none;
  }
}
</style>
