<template>
  <div id="q-app">
    <menus />
    <loading-bar position="top" ref="loader" />
    <router-view />
  </div>
</template>

<script>
// Dynamic CSS variables that automatically handle all app themes and changes:
// https://github.com/Inventsable/starlette
import starlette from "starlette";

// Dynamic identification object that reports all panel and host information:
// https://github.com/Inventsable/CEP-Spy
import spy from "cep-spy";

import { mapActions } from "vuex";

import { Dialog, Loading, Notify, LoadingBar } from "quasar";
import showErrorMessage from "src/functions/function-show-error-message.js";

export default {
  name: "App",
  components: {
    menus: require("src/components/dev/menus.vue").default,
    "loading-bar": require("src/components/panel/LoadingBar").default
  },
  data: () => ({
    // required
    csInterface: null,
    isMounted: false,
    spy: null,
    menus: null,
    // optional
    modal: null,
    loading: false,
    loadingBar: null
  }),
  watch: {
    loading(state) {
      if (state) {
        Loading.show();
      } else {
        Loading.hide();
      }
    }
  },
  computed: {
    storage() {
      return window.localStorage;
    },
    // If extensionID has "modal" we know it's not the panel:
    notModal() {
      return !/modal/.test(spy.extID);
    }
  },
  async mounted() {
    console.clear();
    starlette.init();
    this.getSettings();

    this.loading = false;
    this.csInterface = new CSInterface();
    this.csInterface.addEventListener("console", this.consoler);

    // Utility components already mounted prior to this
    console.log(
      `${spy.extName} ${spy.extVersion} : ${spy.isDev ? "DEV" : "BUILD"}`
    );

    // The modal and panel share the same Vue instance.
    // If this is the modal window (we know by it's ID from manifest.xml), push it to the Modal route.
    if (!this.notModal) {
      this.$router.push({ path: "/modal" });
      // this.modal.init();
    } else {
      this.csInterface.addEventListener(
        // General a name-specific close event listener for that modal (but doesn't work if X is pressed)
        `${spy.extID.match(/.*\./)[0]}modal-close`,
        evt => {
          // Show a snackbar notification as proof we communicated and print input data to Quasar dialog
          console.log(evt);
          Dialog.create({
            title: "Text from Modal",
            message: evt.data
          });
        }
      );
    }
    this.loadUniversalScripts();

    //
    this.$q.notify.setDefaults({
      timeout: 2500,
      actions: [{ icon: "close", color: "white" }]
    });
  },
  methods: {
    ...mapActions("settings", ["getSettings"]),

    notify(text) {
      this.$q.notify(text);
    },
    error(text) {
      showErrorMessage(text);
    },
    launchModal() {
      console.log(`${spy.extID.match(/.*\./)[0]}modal`);
      // Dynamically open the modal at any time
      this.csInterface.requestOpenExtension(
        `${spy.extID.match(/.*\./)[0]}modal`,
        ""
      );
    },
    async runCS(text) {
      return new Promise((resolve, reject) => {
        this.csInterface.evalScript(`${text}`, res => {
          if (res) {
            let msg = this.isJson(res) ? JSON.parse(res) : res;
            resolve(msg);
          } else reject("Error");
        });
      });
    },
    isJson(str) {
      try {
        JSON.parse(str);
      } catch (e) {
        return false;
      }
      return true;
    },
    dispatchEvent(name, data) {
      var event = new CSEvent(name, "APPLICATION");
      event.data = data;
      this.csInterface.dispatchEvent(event);
    },
    loadScript(path) {
      // Correctly loads a script regardless of whether Animate or regular CEP app
      if (!/FLPR/.test(spy.appName))
        this.csInterface.evalScript(`$.evalFile('${path}')`);
      else
        this.csInterface.evalScript(
          `fl.runScript(FLfile.platformPathToURI("${path}"))`
        );
    },
    loadUniversalScripts() {
      // Preloads any script located inside ./src/host/universal
      let utilFolder = window.cep.fs.readdir(
        `${spy.path.root}/src/host/universal/`
      );
      if (!utilFolder.err) {
        let valids = utilFolder.data.filter(file => {
          return /\.(jsx|jsfl)$/.test(file);
        });
        valids.forEach(file => {
          this.loadScript(`${spy.path.root}/src/host/universal/${file}`);
        });
      }
      // Preloads any script located in ./src/host/[appName]/
      let hostFolder = window.cep.fs.readdir(
        `${spy.path.root}/src/host/${spy.appName}/`
      );
      if (!hostFolder.err) {
        let valids = hostFolder.data.filter(file => {
          return /\.(jsx|jsfl)$/.test(file);
        });
        valids.forEach(file => {
          this.loadScript(`${spy.path.root}/src/host/${spy.appName}/${file}`);
        });
      } else {
        console.log(
          `${spy.path.root}/src/host/${spy.appName} has no valid files or does not exist`
        );
      }
    },
    consoler(msg) {
      // Catches all console.log() usage in .jsx files via CSEvent
      console.log(`${spy.appName}: ${msg.data}`);
    },
    getCSS(prop) {
      // Returns current value of CSS variable
      // prop == typeof String as name of variable, with or without leading dashes:
      // this.getCSS('color-bg') || this.getCSS('--scrollbar-width')
      return window
        .getComputedStyle(document.documentElement)
        .getPropertyValue(`${/^\-\-/.test(prop) ? prop : "--" + prop}`);
    },
    setCSS(prop, data) {
      // Sets value of CSS variable
      // prop == typeof String as name of variable, with or without leading dashes:
      // this.setCSS('color-bg', 'rgba(25,25,25,1)') || this.setCSS('--scrollbar-width', '20px')
      document.documentElement.style.setProperty(
        `${/^\-\-/.test(prop) ? prop : "--" + prop}`,
        data
      );
    }
  }
};
</script>

<style>
@import url("https://fonts.googleapis.com/css?family=Open+Sans&display=swap");
:root {
  --quad: cubic-bezier(0.48, 0.04, 0.52, 0.96);
  --quart: cubic-bezier(0.76, 0, 0.24, 1);
  --quint: cubic-bezier(0.84, 0, 0.16, 1);
  --toolbar-height: 48px;
  --bottombar-height: 30px;

  background-color: var(--color-bg);
  color: var(--color-default);
  font-family: "Open Sans", sans-serif;
}

#app {
  min-width: 400px;
}

body::-webkit-scrollbar {
  width: 16px;
}
#app::-webkit-scrollbar {
  display: block;
  width: 16px;
}
::-webkit-scrollbar {
  background-color: var(--color-scrollbar);
  width: 16px;
}
::-webkit-scrollbar-thumb {
  background: var(--color-scrollbar-thumb);
  border-radius: 20px;
}
::-webkit-scrollbar-thumb:hover {
  background: var(--color-scrollbar-thumb-hover);
}
::-webkit-scrollbar-resizer {
  display: none;
}
::-webkit-scrollbar-button {
  height: 0px;
}

.q-card.q-dialog-plugin {
  background-color: var(--color-bg);
  color: var(--color-icon);
}
.q-drawer {
  background: var(--color-header);
}

.q-item__label--caption {
  color: var(--color-default);
}

.q-item__label--header {
  color: var(--color-text-label);
}

.q-layout__section--marginal {
  color: var(--color-default);
}
.quasar-logo-text {
  fill: var(--color-default);
}
.q-notification {
  background-color: var(--color-header);
}

.q-menu {
  background-color: var(--color-header);
  color: var(--color-default);
}

.q-field__native,
.q-field__prefix,
.q-field__suffix,
.q-field__marginal,
/* .q-field__control, */
.q-field__label,
.q-field__bottom {
  color: var(--color-default);
}

.q-checkbox__inner {
  color: var(--color-default);
}

.q-checkbox__inner--active {
  color: var(--q-color-primary);
}

.q-field__focused {
  border-bottom-color: red;
}

.q-field--standard .q-field__control:before {
  border-bottom: 1px solid var(--color-default);
}
.q-field--standard .q-field__control:hover:before {
  border-bottom: 1px solid var(--color-btn-hover);
}

.q-dark {
  background: var(--color-bg);
}

.q-item__label--header {
  user-select: none;
  cursor: default;
  font-size: 1rem;
}

.q-separator {
  background: var(--color-btn-disabled-text);
}

.q-field__native,
.q-field__prefix,
.q-field__suffix {
  color: var(--color-default);
}

.q-field__marginal {
  color: var(--color-default);
}
</style>
